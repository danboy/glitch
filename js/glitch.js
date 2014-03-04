var Glitch = function(el, images, options) {
  this.options = JS.merge({
    animationLength: 500,
    animationFrames: 10,
    delay: 20000,
    filters: ['red', 'glitch', 'brightness']
  }, options);
  this.el = document.querySelectorAll(el)[0];
  JS.addClass(this.el, 'glitch');
  this.canvas = document.createElement('canvas');
  JS.addClass(this.canvas, 'glitch-canvas');
  this.context = this.canvas.getContext('2d');
  this.images = images;
  this.init();
};

Glitch.prototype = {
  init: function(){
    this.currentImageIndex = 0;
    this.firstRun = true;
    this.reverseImages = false;
    this.appendCanvas();
    this.drawImage();
    this.watchViewport();
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
    if(this.isStopped){return false;}
    var image = new Image();
    image.src = this.selectImage();
    image.onload = function(){
      var filteredImages = this.createFilteredImages(image);
    }.bind(this);
  },

  applyDataToCanvas: function(data, offset){
    offset = offset || 0;
    this.setCanvasClass(data);
    this.context.putImageData(data, offset, 0);
  },

  setCanvasClass: function(img){
    return (img.height < img.width) ? this.canvas.setAttribute('class', 'glitch-wide glitch-canvas') : this.canvas.setAttribute('class', 'glitch-tall glitch-canvas') ;
  },

  intervalLength:function(){
    var intervalLength = (this.currentImageIndex === 0) ? Math.floor(Math.random()*this.options.delay) : this.options.animationLength/(this.options.animationFrames+1);
    return intervalLength;
  },

  createFilteredImages: function(image){
    if(this.isStopped){return false;}
    var filteredArray = [];

    for(var i=0; i< this.options.animationFrames; i++) {
      var filters = (i === 0) ? ['unfiltered'] : this.options.filters;
      filteredArray[i] = this.filterImage(image, filters);
    }

    if(this.firstRun){
      this.applyDataToCanvas(filteredArray[0]);
      this.firstRun = false;
    }
    this.lastArray = this.filteredArray || filteredArray;
    this.filteredArray = filteredArray;
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
      this.applyDataToCanvas(images[0]);
      this.drawImage();
    }
  },

  wait: function(cb){
    setTimeout(function(){cb(this.filteredArray);}.bind(this), 10000);
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
    //this.animate(this.filteredArray);
  },

  filterImage: function(image, filters){
    var glitch = new Filter(image);
    return glitch.applyFilters(filters);
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
    var win = (window.pageYOffset+window.innerHeight);
    var top = this.offsetTop(el);
    return (win - top);
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
