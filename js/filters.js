var Filters = {
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
    for(i=0;i<d.length;i=i+1){
      var end = d[Math.floor(Math.random()*d.length)];
      var start = d[Math.floor(Math.random()*end)];
      d[Math.floor(Math.random()*d.length)] = d[start];
    }
    return pixels;
  }
, redNoise: function(pixels){
    var d = pixels.data;
    for(i=0;i<d.length;i+=4){
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
    for (i=0;i<4;i++) {
      var mx = Math.floor(Math.random()*250)*i, my = Math.floor(Math.random()*250)*i; 
      for (y=0; y<img.height; y++) { 
        for (x=0; x<img.width; x++) { 
          var red = data[((img.width * y) + x) * 4]; 
          var green = data[((img.width * y) + x) * 4 + 1]; 
          var blue = data[((img.width * y) + x) * 4 + 2];
          data[((img.width * y) + x) * 4] = red  
          data[((img.width * y) + x) * 4 + mx] = green
          data[((img.width * y) + x) * 4 + my] = blue
        }
      }
    }
    return pixels;
  }
, pixelate: function(pixels, img){
    var res = res || 20;
    var pixels = pixels.data;
    ctx = img.getContext('2d');
    for (x=0; x<img.height; x++ ) {
      Y = ( x - 0.5 ) * res;
      pxlY = Math.max( Math.min( Y, img.height), 0);
      for (y=0; y<img.width ; y++ ) {
        X = ( y - 0.5 ) * res;
        pxlX = Math.max( Math.min( X, img.width), 0);
        pixelIndex = ( pxlX + pxlY * img.width ) * 4;
        red   = pixels[ pixelIndex + 0 ];
        green = pixels[ pixelIndex + 1 ];
        blue  = pixels[ pixelIndex + 2 ];
        ctx.fillStyle = 'rgb(' + red +','+ green +','+ blue+')';
        ctx.fillRect( X, Y, res, res );
      }
    }
    var pixelated = ctx.getImageData(0,0,img.width,img.height);
    return pixelated.data;
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
