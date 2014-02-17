var Filter = function(image) {
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.image = image;
};

Filter.prototype = {
  imageData: function() {
    var width = this.image.width;
    var height = this.image.height;
    this.canvas.setAttribute('width', width);
    this.canvas.setAttribute('height', height);
    this.context.drawImage(this.image, 0, 0);

    return this.context.getImageData(0,0, width, height);
  },
  applyFilters: function(filters) {
    this.imageData = this.imageData();
    for (var i=filters.length-1; i >= 0; i-=1){
      this.filters[filters[i]](this.imageData, this.canvas);
    }
    return this.imageData;
  },

  filters: {
    unfiltered: function(pixels) {
      return pixels;
    },
    grayscale: function(pixels, args) {
      var d = pixels.data;
      for (var i=0; i<d.length; i+=4) {
      var r = d[i];
      var g = d[i+1];
      var b = d[i+2];
      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      var v = 0.2126*r + 0.7152*g + 0.0722*b;
      d[i] = d[i+1] = d[i+2] = v
      }
      return pixels;
    }
  , brightness: function(pixels, adjustment) {
      adjustment = adjustment || 95;
      var d = pixels.data;
      for (var i=0; i<d.length; i+=4) {
        d[i] += adjustment;
        d[i+1] += adjustment;
        d[i+2] += adjustment;
      }
      return pixels;
    }
  , threshold: function(pixels, threshold){
      threshold = threshold || 11;
      var d = pixels.data;
      for (var i=0; i<d.length; i+=4) {
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];
        var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
        d[i] = d[i+1] = d[i+2] = v
      }
      return pixels;
    }
  , noise: function(pixels){
      var d = pixels.data;
      for(var i=0;i<d.length;i=i+1){
        var end = d[Math.floor(Math.random()*d.length)];
        var start = d[Math.floor(Math.random()*end)];
        d[Math.floor(Math.random()*d.length)] = d[start];
      }
      return pixels;
    }
  , redNoise: function(pixels){
      var d = pixels.data;
      var dataLength = d.length;
      for(var i=0;i<dataLength;i+=4){
        var end = Math.floor(Math.random()*i);
        var start = Math.floor(Math.random()*end);
        d[i] = d[start];
      }
      return pixels;
    }
  , red: function (pixels, args) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      d[i] = (r+g+b)/3;
      d[i + 1] = d[i + 2] = 0;
    }
    return pixels;
  }
  , glitch: function(pixels, img){
      var data = pixels.data;
      var imgHeight = img.height;
      var imgWidth = img.width;
      var randomNum = Math.floor(Math.random()*250)
      for (var i=0;i<4;i++) {
        var mx = randomNum*i, my = randomNum*i;
        for (var y=0; y<imgHeight; y++) {
          for (var x=0; x<imgWidth; x++) {
            var red = data[((imgWidth * y) + x) * 4];
            var green = data[((imgWidth * y) + x) * 4 + 1];
            var blue = data[((imgWidth * y) + x) * 4 + 2];
            data[((imgWidth * y) + x) * 4] = red
            data[((imgWidth * y) + x) * 4 + mx] = green
            data[((imgWidth * y) + x) * 4 + my] = blue
          }
        }
      }
      return pixels;
    }
  , pixelate: function(pixels, img){
      var context = img.getContext('2d');
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.imageSmoothingEnabled = false;

      var size = Math.floor(Math.random()*50)*.01;
      var h = img.height * size;
      var w = img.width * size;
      try {
        context.drawImage(img, 0, 0, w, h, 0, 0, img.width, img.height);
      } catch(e){
        return;
      };

      var pixelated = context.getImageData(0,0,img.width,img.height);
      return pixelated;
    },
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
      }
    }
}