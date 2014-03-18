var Filter = function(image, options) {
  this.options = JS.merge({
    scale: {w: 800, h: 400}
  }, options);
  var filters = this.options.filters || {};
  this.options.filters = JS.merge({
      threshold: {
        amount: 99
      },
      brightness: {
        adjustment: 100
      }
  }, filters);
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.image = image;
};

Filter.prototype = {
  imageData: function() {
    var width = this.image.width;
    var height = this.image.height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.drawImage(this.image, 0, 0, this.options.scale.w, this.options.scale.h);
    this.context.drawImage(this.canvas, 0, 0, this.options.scale.w, this.options.scale.h, 0, 0, width, height);
    return this.context.getImageData(0,0, width, height);
  },
  applyFilters: function(filters) {
    this.imageData = this.imageData();
    for (var i=filters.length-1; i >= 0; i-=1){
      var filter = filters[i];
      this.filters[filter](this.imageData, this.canvas, this.options.filters[filter]);
    }
    return this.canvas;
  },

  filters: {
    unfiltered: function() {
      return;
    },
    grayscale: function(pixels, canvas) {
      var d = pixels.data;
      for (var i=0; i<d.length; i+=4) {
      var r = d[i];
      var g = d[i+1];
      var b = d[i+2];
      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      var v = 0.2126*r + 0.7152*g + 0.0722*b;
      d[i] = d[i+1] = d[i+2] = v;
      }
      canvas.getContext('2d').putImageData(pixels, 0, 0);
      return pixels;
    },
    brightness: function(pixels, canvas, options) {
      var adjustment = options.adjustment;
      var d = pixels.data;
      for (var i=0; i<d.length; i+=4) {
        d[i] += adjustment;
        d[i+1] += adjustment;
        d[i+2] += adjustment;
      }
      canvas.getContext('2d').putImageData(pixels, 0, 0);
      return pixels;
    },
    threshold: function(pixels, canvas, options){
      var d = pixels.data;
      for (var i=0; i<d.length; i+=4) {
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];
        var v = (0.2126*r + 0.7152*g + 0.0722*b >= options.amount) ? 255 : 0;
        d[i] = d[i+1] = d[i+2] = v;
      }
      canvas.getContext('2d').putImageData(pixels, 0, 0);
      return pixels;
    },
    noise: function(pixels, canvas){
      var d = pixels.data;
      for(var i=0;i<d.length;i=i+1){
        var end = d[Math.floor(Math.random()*d.length)];
        var start = d[Math.floor(Math.random()*end)];
        d[Math.floor(Math.random()*d.length)] = d[start];
      }
      canvas.getContext('2d').putImageData(pixels, 0, 0);
      return pixels;
    },
    redNoise: function(pixels, canvas){
      var d = pixels.data;
      var dataLength = d.length;
      for(var i=0;i<dataLength;i+=4){
        var end = Math.floor(Math.random()*i);
        var start = Math.floor(Math.random()*end);
        d[i] = d[start];
      }
      canvas.getContext('2d').putImageData(pixels, 0, 0);
      return pixels;
    },
    red: function (pixels, canvas) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      d[i] = (r+g+b)/3;
      d[i + 1] = d[i + 2] = 0;
    }
    canvas.getContext('2d').putImageData(pixels, 0, 0);
    return pixels;
  },
  glitch: function(pixels, img){
      var glitchAmount = 250;
      var data = pixels.data;
      var imgHeight = img.height;
      var imgWidth = img.width;
      var randomNum = Math.floor(Math.random()*glitchAmount);
      for (var i=0;i<2;i++) {
        var mx = randomNum*i, my = randomNum*i;
        for (var y=0; y<imgHeight; y++) {
          for (var x=0; x<imgWidth; x++) {
            var red = data[((imgWidth * y) + x) * 4];
            var green = data[((imgWidth * y) + x) * 4 + 1];
            var blue = data[((imgWidth * y) + x) * 4 + 2];
            data[((imgWidth * y) + x) * 4] = red;
            data[((imgWidth * y) + x) * 4 + mx] = green;
            data[((imgWidth * y) + x) * 4 + my] = blue;
          }
        }
      }
      img.getContext('2d').putImageData(pixels, 0, 0);
      return img;
    },
    pixelate: function(pixels, img){
      var ctx = img.getContext('2d');
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;

      var size = Math.floor(Math.random()*50)*0.001;
      if(size <=0){size = 0.4;}
      var h = img.height * size;
      var w = img.width * size;
      try {
        ctx.drawImage(img, 0, 0, w, h);
      } catch(e){
        console.log('ERROR',e);
        return;
      }

      var data = ctx.getImageData(0,0, w, h);
      ctx.drawImage(img, 0, 0, w, h, 0, 0, img.width, img.height);
    },
    scanlines: function(pixels, img){
      var ctx = img.getContext('2d');
      ctx.putImageData(pixels, 0, 0);
      ctx.fillStyle = "rgba(0,0,0, .2)";
      for (i = 0; i < img.height; i += 3) {
        ctx.fillRect(0, i, img.width, 1);
      }
      var data = ctx.getImageData(0,0,img.width,img.height);
      return data;
    }/*,
    blur: function(pixels){
      return this.convolution(pixels,[ 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9 ]);
    },
    convolution: function(pixels, weights, opaque) {
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side/2);
      var src = pixels.data;
      var sw = pixels.width;
      var sh = pixels.height;
      // pad output by the convolution matrix
      var w = sw;
      var h = sh;
      var ctx = document.createElement('canvas').getContext('2d');
      var output = ctx.createImageData(w, h);
      var dst = output.data;
      var alphaFac = opaque ? 1 : 0;
      for (var y=0; y<h; y++) {
        for (var x=0; x<w; x++) {
          var sy = y;
          var sx = x;
          var dstOff = (y*w+x)*4;
          // calculate the weighed sum of the source image pixels that
          // fall under the convolution matrix
          var r=0, g=0, b=0, a=0;
          for (var cy=0; cy<side; cy++) {
            for (var cx=0; cx<side; cx++) {
              var scy = sy + cy - halfSide;
              var scx = sx + cx - halfSide;
              if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                var srcOff = (scy*sw+scx)*4;
                var wt = weights[cy*side+cx];
                r += src[srcOff] * wt;
                g += src[srcOff+1] * wt;
                b += src[srcOff+2] * wt;
                a += src[srcOff+3] * wt;
              }
            }
          }
          dst[dstOff] = r;
          dst[dstOff+1] = g;
          dst[dstOff+2] = b;
          dst[dstOff+3] = a + alphaFac*(255-a);
        }
      }
      return output;
      }*/
    }
};
