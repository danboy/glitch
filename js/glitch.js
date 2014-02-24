var ImageLoader = function(el, images) {
  this.el = document.querySelectorAll(el)[0];
  JS.addClass(this.el, 'glitch');
  this.canvas = document.createElement('canvas');
  JS.addClass(this.canvas, 'glitch-canvas');
  this.images = images;
  this.context = this.canvas.getContext('2d');
  this.animationLength = 500;
  this.animationFrames = 10;
  this.currentImageIndex = 0;
  this.firstRun = true;
  this.reverseImages = false;
  this.maxTimeout = 10000;
  this.filters = ['scanlines', 'glitch', 'brightness'];
};

ImageLoader.prototype = {
  init: function(){
    this.appendCanvas();
    this.drawImage();
  },

  appendCanvas: function() {
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

  applyImageToCanvas: function(image){
    this.setCanvasClass(image);
    this.canvas.setAttribute('width', image.width);
    this.canvas.setAttribute('height', image.height);
    this.context.putImageData(image, 0, 0);
  },

  setCanvasClass: function(img){
    return (img.height < img.width) ? this.canvas.setAttribute('class', 'glitch-wide glitch-canvas') : this.canvas.setAttribute('class', 'glitch-tall glitch-canvas') ;
  },

  intervalLength:function(){
    var intervalLength = (!this.reverseImages && this.currentImageIndex === 0) ? Math.floor(Math.random()*this.maxTimeout) : this.animationLength/(this.animationFrames+1) ;
    return intervalLength;
  },

  createFilteredImages: function(image){
    var filteredArray = [];

    for(var i=0; i< this.animationFrames; i++) {
      var filters = (i == 0) ? ['unfiltered'] : this.filters;
      filteredArray[i] = this.filterImage(image, filters);
    };

    if(this.firstRun){
      this.applyImageToCanvas(filteredArray[0]);
      this.firstRun = false;
    }
    this.animateImages(filteredArray);
  },

  animateImages: function(images){
    var intervalLength = this.intervalLength();

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
      }.bind(this), intervalLength);
    } else {
      this.currentImageIndex = 0;
      this.drawImage();
    }
  },

  stopAnimate: function(){
    this.isStopped = true;
  },

  filterImage: function(image, filters){
    var glitch = new Filter(image);
    return glitch.applyFilters(filters);
  }
};

var images = ['images/FFF_www_ACOW_BW.jpg','images/FFF_www_BLACKHEART_BW.jpg','images/FFF_www_DEESKO_BW.jpg','images/FFF_www_GUMBALL_BW.jpg','images/FFF_www_PANZERWOLF_BW.jpg','images/FFF_www_TOPLESSWYTCH_BW.jpg','images/FFF_www_ACOW_COL.jpg','images/FFF_www_BLACKHEART_COL.jpg','images/FFF_www_DEESKO_COL.jpg','images/FFF_www_GUMBALL_COL.jpg','images/FFF_www_PANZERWOLF_COL.jpg','images/FFF_www_TOPLESSWYTCH_COL.jpg','images/FFF_www_ALPHAKING_BW.jpg','images/FFF_www_BLACKSUN_BW.jpg','images/FFF_www_DREADDOUBLE_BW.jpg','images/FFF_www_HBI_BW.jpg','images/FFF_www_POPSKULL_BW.jpg','images/FFF_www_WARMULLET_BW.jpg','images/FFF_www_ALPHAKING_COL.jpg','images/FFF_www_BLACKSUN_COL.jpg','images/FFF_www_DREADDOUBLE_COL.jpg','images/FFF_www_HBI_COL.jpg','images/FFF_www_POPSKULL_COL.jpg','images/FFF_www_WARMULLET_COL.jpg','images/FFF_www_ALPHAKONG_BW.jpg','images/FFF_www_BOOGOOP_BW.jpg','images/FFF_www_DREADNAUGHT_BW.jpg','images/FFF_www_JINX_BW.jpg','images/FFF_www_RABBID_BW.jpg','images/FFF_www_ZESZESZES_BW.jpg','images/FFF_www_ALPHAKONG_COL.jpg','images/FFF_www_BOOGOOP_COL.jpg','images/FFF_www_DREADNAUGHT_COL.jpg','images/FFF_www_JINX_COL.jpg','images/FFF_www_RABBID_COL.jpg','images/FFF_www_ZESZESZES_COL.jpg','images/FFF_www_AMONAMARTH_BW.jpg','images/FFF_www_CALQUEEN_BW.jpg','images/FFF_www_DRUNKMONK_BW.jpg','images/FFF_www_LASTSUPPER_BW.jpg','images/FFF_www_RISGOOP_BW.jpg','images/FFF_www_ZOMBIEDUST_BW.jpg','images/FFF_www_AMONAMARTH_COL.jpg','images/FFF_www_CALQUEEN_COL.jpg','images/FFF_www_DRUNKMONK_COL.jpg','images/FFF_www_LASTSUPPER_COL.jpg','images/FFF_www_RISGOOP_COL.jpg','images/FFF_www_ZOMBIEDUST_COL.jpg','images/FFF_www_ANNICA_BW.jpg','images/FFF_www_CREEPER_BW.jpg','images/FFF_www_DUSK_BW.jpg','images/FFF_www_MOLOKO_BW.jpg','images/FFF_www_RYELIGHTNG_BW.jpg','images/one.jpg','images/FFF_www_ANNICA_COL.jpg','images/FFF_www_CREEPER_COL.jpg','images/FFF_www_DUSK_COL.jpg','images/FFF_www_MOLOKO_COL.jpg','images/FFF_www_RYELIGHTNG_COL.jpg','images/three.jpg','images/FFF_www_BACKMASKING_BW.jpg','images/FFF_www_CSB_BW.jpg','images/FFF_www_EYEHATE_BW.jpg','images/FFF_www_MUTINY_BW.jpg','images/FFF_www_RYETIGER_BW.jpg','images/two.jpg','images/FFF_www_BACKMASKING_COL.jpg','images/FFF_www_CSB_COL.jpg','images/FFF_www_EYEHATE_COL.jpg','images/FFF_www_MUTINY_COL.jpg','images/FFF_www_RYETIGER_COL.jpg','images/FFF_www_BATTLECHARRO_BW.jpg','images/FFF_www_DARKLORD_BW.jpg','images/FFF_www_GORCH_BW.jpg','images/FFF_www_NELSON_BW.jpg','images/FFF_www_TIBERIAN_BW.jpg','images/FFF_www_BATTLECHARRO_COL.jpg','images/FFF_www_DARKLORD_COL.jpg','images/FFF_www_GORCH_COL.jpg','images/FFF_www_NELSON_COL.jpg','images/FFF_www_TIBERIAN_COL.jpg'];

var myIL = new ImageLoader('.image', images);
myIL.init();
