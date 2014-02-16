var JS = {
  merge: function(obj1, obj2){
    for (var attrname in obj2){
      obj1[attrname] = obj2[attrname];
    }
    return obj1;
  },
  size: function(obj){
    var size = 0, key;
      for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }
};
var Glitch = function(element, images, options, cb){
  if(!this.canCanvas){return false;}
  this.options = JS.merge({
    increment: 30,
    canvasName: 'glitch',
    filters: ['glitch', 'red', 'pixelate'],
    delay: 10000,
    seed: 0,
    amount: 0,
    frames: 15,
    iterations: 1
  }, options);
  this.images = images;
  this.el = document.querySelectorAll(element)[0];
  this.createCanvas();
  this.start();
};

Glitch.prototype = {
  start: function(){
    this.selectImage();
  },
  animateIn: function(data){
    for(i=0;i<this.options.frames;i++){
      this.applyFilters(data);
    }
  },
  canCanvas: function(){
    return !!document.createElement('canvas').getContext;
  },
  createCanvas: function(){
    var el = this.el;
    var canvas = this.canvas = document.createElement('canvas');
    this.el.appendChild(canvas);
  },
  selectImage: function(cb){
    this.image = this.images[Math.floor(Math.random()*this.images.length)];
    this.getPixels(this.image, this.animateIn.bind(this));
  },
  getPixels: function(src, cb) {
    var img = new Image();
    img.src = src;
    img.onload = function(){
      var canvas = this.canvas;
      canvas.setAttribute('width', img.width);
      canvas.setAttribute('height', img.height);
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      cb(ctx.getImageData(0,0,img.width,img.height));
    }.bind(this);
  },
  applyFilters: function(data){
    var filters = this.options.filters;
    var length = JS.size(this.filters);
    for (i=0;i<this.options.iterations;i++){
      var filter = filters[Math.floor(Math.random()*filters.length)];
      console.log('filter', filter);
      data = this.filters[filter](data, this.canvas);
    }
    var ctx = this.canvas.getContext('2d');
    this.renderImage(data, ctx);
  },
  renderImage: function(data, ctx){
    ctx.putImageData(data, 0, 0);
  },
  filters: Filters
};

var myGlitch = new Glitch('.image',['/images/one.jpg','/images/two.jpg','/images/three.jpg'], {canvasName: 'bg', delay: 2000} );
