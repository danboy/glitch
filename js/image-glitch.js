var ImageGlitch = function(el, options){
  this.options = JS.merge({
    filters: ['glitch', 'red'],
    framerate: 100,
    delay: 20000
  }, options);
  this.currentImageIndex = 0;
  this.el = document.querySelectorAll(el)[0];
  var image = this.image = new Image();
  image.src = this.el.src;
  image.onload = function(){this.init(image);}.bind(this);
};

ImageGlitch.prototype = {
  init: function(image){
    this.canvas = document.createElement('canvas');
    this.el.style.visibility = 'hidden';
    this.el.parentNode.insertBefore(this.canvas, this.el);
    this.canvas.className = this.el.className;
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.drawImage(image, 0, 0);
    this.glitch(image);
  },
  glitch: function(image){
    var filteredArray = [];
    for(var i=0; i < 10; i++){
      filteredArray[i] = this.filterImage(this.el, this.options.filters);
    }
    this.animate(filteredArray);
  },
  animate: function(images){
    var i = this.currentImageIndex;
    if (i<images.length){
      setTimeout(function(){
        var image = images[i];
        this.currentImageIndex++;
        this.updateSrc(image);
        this.animate(images);
      }.bind(this), this.options.framerate);
    } else {
      this.canvas.width = this.el.width;
      this.currentImageIndex = 0;
      this.updateSrc(this.el);
      setTimeout(function(){
        this.animate(images);
      }.bind(this), Math.floor(Math.random()*this.options.delay));
    }
  },
  filterImage: function(image, filters){
    var glitch = new Filter(image, {scale: {w: image.width, h: image.height}});
    return glitch.applyFilters(filters);
  },
  updateSrc: function(canvas){
    this.ctx.drawImage(canvas, 0, 0);
  }
};
