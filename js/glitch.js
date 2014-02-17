var ImageLoader = function(el, images) {
  this.el = document.querySelectorAll(el)[0];
  this.canvas = document.createElement('canvas');
  this.images = images;
  this.context = this.canvas.getContext('2d');
  this.animationLength = 1000;
  this.animationFrames = 10;
  this.currentImageIndex = 0;
  this.reverseImages = false;
};

ImageLoader.prototype = {
  init: function(){
    this.appendCanvas();
    this.drawImage();
  },

  appendCanvas: function() {
    return this.el.appendChild(this.canvas);
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

  applyImageToCanvas: function(image){
    this.canvas.setAttribute('width', image.width);
    this.canvas.setAttribute('height', image.height);

    this.context.putImageData(image, 0, 0);
  },

  intervalLength:function(){
    return this.animationLength/(this.animationFrames+1);
  },

  createFilteredImages: function(image){
    var filteredArray = [];

    for(var i=0; i< this.animationFrames; i++) {
      var filter = (i == 0) ? 'unfiltered' : 'pixelate';
      filteredArray[i] = this.filterImage(image, filter);
    };

    this.animateImages(filteredArray);
  },

  animateImages: function(images){
    if (this.isStopped) {return};

    var i = this.currentImageIndex;

    if(this.reverseImages){
      this.reverseImages = false;
      var images = images.reverse();
    } else {
      this.reverseImages = true;
      var images = images;
    }

    if (i<images.length){
      setTimeout(function(){
        this.applyImageToCanvas(images[i]);
        this.currentImageIndex++;
        this.animateImages(images);
      }.bind(this), this.intervalLength());
    } else {
      this.currentImageIndex = 0;
      this.drawImage();
    }
  },

  stopAnimate: function(){
    this.isStopped = true;
  },

  filterImage: function(image, filter){
    var glitch = new Filter(image);
    return glitch.applyFilter(filter);
  }
};


var myIL = new ImageLoader('.image',['/images/one.jpg','/images/two.jpg','/images/three.jpg']);
myIL.init();