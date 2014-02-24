Glitch
======

A simple JS library to transition images through canvas filters.

```JavaScript
var arrayOfImages = ['/images/imageOne.jpg', '/images/imageTwo.jpg'];
var options = {
    animationLength: 500,
    animationFrames: 10,
    delay: 10000,
    filters: ['scanlines', 'glitch', 'brightness']
};
var glitch = new ImageLoader('.myClass', arrayOfImages, options);
```

## Available Filters

* unfiltered
* grayscale
* brightness
* threshold
* noise
* redNoise
* red
* glitch
* blur

## coming soon

* pixelate
* scanlines
* and much more...

## To Do's

* break filters into standalone files
* fix pixelate and scanlines
* refactor image import

