var Glitch = function(el, images, options) {
  this.options = JS.merge({
    animationLength: 500,
    animationFrames: 30,
    delay: 10000,
    filters: ['scanlines', 'glitch', 'brightness']
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
    this.isStopped = false;
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
    var intervalLength = (!this.reverseImages && this.currentImageIndex === 0) ? Math.floor(Math.random()*this.options.delay) : this.options.animationLength/(this.options.animationFrames+1) ;
    return intervalLength;
  },

  createFilteredImages: function(image){
    var filteredArray = [];

    for(var i=0; i< this.options.animationFrames; i++) {
      var filters = (i === 0) ? ['unfiltered'] : this.options.filters;
      filteredArray[i] = this.filterImage(image, filters, i);
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
    if(this.isStopped){return false;}
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

  slide: function(current, previous, left){
    this.applyDataToCanvas(current, left);
    this.applyDataToCanvas(previous, (left-previous.width));
  },

  stop: function(){
    this.isStopped = true;
  },

  start: function(){
    this.drawImage();
  },

  filterImage: function(image, filters, index){
    var glitch = new Filter(image, index);
    return glitch.applyFilters(filters, index);
  },
  
  grayscaleImage: function(){
    var glitch = new Filter(this.filteredArray[0]);
    this.applyDataToCanvas(glitch.filters.grayscale(glitch.image, glitch.canvas, 0));
  },
  
  rollDice: function(odds){
    return (Math.floor(Math.random()*odds) === 0);
  }
};
