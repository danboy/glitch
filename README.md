Glitch
======

A simple JS library to transition images through canvas filters.

```JavaScript
var arrayOfImages = ['/images/imageOne.jpg', '/images/imageTwo.jpg'];
var options = {
    filters: ['scanlines', 'glitch', 'brightness'],
    animationLength: 800,
    animationFrames: 10,
    filterCount: 5,
    filterOptions: {
      scale: {
        w: 800, h: 400
      },
      filters: {
        threshold: {
          amount: 99
        },
        brightness: {
          adjustment: 25
        }
      }
    },
    delay: 20000
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

