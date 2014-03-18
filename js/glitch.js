var Glitch = function(el, images, options) {
  this.options = JS.merge({
    animationLength: 800,
    animationFrames: 6,
    filterCount: 3,
    randomize: false,
    filterOptions: {
      scale: {
        w: 500, h: 200
      },
      filters: {
        brightness: {
          adjustment: 25
        }
      }
    },
    delay: 20000
  }, options);
  this.setCache(el);
  if(!this.options.filters){this.setFilters();}
  this.el = document.querySelectorAll(el)[0];
  JS.addClass(this.el, 'glitch');
  this.canvas = document.createElement('canvas');
  JS.addClass(this.canvas, 'glitch-canvas');
  this.images = images;
  this.context = this.canvas.getContext('2d');
  this.init();
};

Glitch.prototype = {
  init: function(){
    this.currentImageIndex = 0;
    this.firstRun = true;
    this.reverseImages = false;
    this.drawImage();
    this.appendCanvas();
    this.watchViewport();
  },
  setCache: function(el){
    //todo do localstorage or something here.
    this.id = el;
    window[this.id] = [];
  },
  setFilters: function(){
    var filter = new Filter();
    this.options.filters = [];
    for(var key in filter.filters){
      if(this.rollDice(3) === true && this.options.filters.length < this.options.filterCount){this.options.filters.push(key);}
    }
    if (this.options.filters.length === 0){this.options.filters = ['glitch'];}
  },

  appendCanvas: function() {
    this.canvas.setAttribute('width', 1900);
    this.canvas.setAttribute('height', 1080);
    this.el.insertBefore(this.canvas, this.el.firstChild);
    return;
  },

  selectImage: function(){
    return this.images[Math.floor(Math.random()*this.images.length)];
  },

  drawImage: function(){
    window[this.id].glitchImages = window[this.id].glitchImages || [];
    if(this.isStopped){return false;}
    var image = this.image = new Image();
    image.src = this.selectImage();
    image.onload = function(){
      if(!window[this.id].glitchImages[image.src]){
        var filteredImages = this.createFilteredImages(image);
      }else{
        this.animate(window[this.id].glitchImages[image.src]);
      }
    }.bind(this);
  },

  applyDataToCanvas: function(data, offset){
    offset = offset || 0;
    this.setCanvasClass(data);
    this.context.drawImage(data, 0, 0, data.width, data.height, 0, 0, data.width, data.height);
  },

  setCanvasClass: function(img){
    return (img.height < img.width) ? this.canvas.setAttribute('class', 'glitch-wide glitch-canvas') : this.canvas.setAttribute('class', 'glitch-tall glitch-canvas') ;
  },

  intervalLength:function(){
    var intervalLength = (this.currentImageIndex === 0) ? Math.floor(Math.random()*this.options.delay) : Math.floor(this.options.animationLength/(this.options.animationFrames+1));
    return intervalLength;
  },

  createFilteredImages: function(image){
    if(this.isStopped || !this.inView(this.el)){this.wait(this.createFilteredImages.bind(this));return false;}
    var filteredArray = [];

    for(var i=0; i< this.options.animationFrames; i++) {
      filteredArray[i] = this.filterImage(image, this.options.filters);
    }

    if(this.firstRun){
      this.applyDataToCanvas(this.image);
      this.firstRun = false;
    }
    this.lastArray = this.filteredArray || filteredArray;
    this.filteredArray = filteredArray;
    window[this.id].glitchImages[this.image.src] = filteredArray;
    this.animate(filteredArray);
  },

  animate: function(images){
    if(this.isStopped || !this.inView(this.el)){this.wait(this.animate.bind(this));return false;}
    var i = this.currentImageIndex;
    if (i<images.length){
      setTimeout(function(){
        var image = images[i];
        var offset = (i===0) ? 0 : Math.floor(image.width/i);
        if(i===0){
          this.canvas.setAttribute('width', image.width);
          this.canvas.setAttribute('height', image.height);
        }
        var fx = (this.options.slide) ? this.slide(image, this.lastArray[i], offset) : this.applyDataToCanvas(image);
        this.currentImageIndex++;
        this.animate(images);
      }.bind(this), this.intervalLength());
    } else {
      this.currentImageIndex = 0;
      this.applyDataToCanvas(this.image);
      if(this.options.randomize){this.setFilters();}
      this.drawImage();
    }
  },

  wait: function(cb){
    setTimeout(function(){cb(this.filteredArray);}.bind(this), this.options.delay);
  },

  slide: function(current, previous, left){
    this.applyDataToCanvas(current, left);
    this.applyDataToCanvas(previous, (left-previous.width));
  },

  stop: function(){
    this.isStopped = true;
  },

  start: function(){
    this.isStopped = false;
  },

  filterImage: function(image, filters){
    var glitch = new Filter(image, this.options.filterOptions);
    return glitch.applyFilters(filters.reverse());
  },

  drawOriginalImage: function(){
    this.applyDataToCanvas(this.filteredArray[0]);
  },
  
  grayscaleImage: function(){
    var glitch = new Filter(this.filteredArray[0]);
    this.applyDataToCanvas(glitch.filters.grayscale(glitch.image, glitch.canvas, 0));
  },

  watchViewport: function(){
    window.onscroll = function(){
      var iv = (this.inView(this.el)) ? this.isStopped = false : this.stop();
    }.bind(this);
  },
  
  inView: function(el){
    var top = this.offsetTop(el);
    var height = el.offsetHeight;

    return (
      top < (window.pageYOffset + window.innerHeight) &&
      (top + height) > window.pageYOffset
    );
  },

  percentInView: function(el){
    var viewportHeight = window.innerHeight;
    var scrollTop = window.pageYOffset;
    var elementOffsetTop = this.offsetTop(el);
    var elementHeight = el.offsetHeighteight;

    if (elementOffsetTop > (scrollTop + viewportHeight)) {
      return 0;
    } else if ((elementOffsetTop + elementHeight) < scrollTop) {
      return 100;
    } else {
      var distance = (scrollTop + viewportHeight) - elementOffsetTop;
      var percentage = distance / ((viewportHeight + elementHeight) / 100);
      percentage = Math.round(percentage);
      return percentage;
    }
  },

  offsetTop: function(el){
    var top = el.offsetTop;
    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
    }
    return top;
  },

  rollDice: function(odds){
    return (Math.floor(Math.random()*odds) === 0);
  }
};
