var IV = function(selector, cb){
  this.cb = cb;
  this.elements = Sizzle(selector);
  this.init();
};

IV.prototype = {
  init: function(){
    window.onscroll = function(){
      this.elements.forEach(function(el){
        var result = (this.inView(el)) ? this.percentInView(el): false;
        this.cb(result, el);
      }.bind(this));
    }.bind(this);
  },
  inView: function(el){
    var top = el.offsetTop;
    var height = el.offsetHeight;

    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
    }

    return (
      top < (window.pageYOffset + window.innerHeight) &&
      (top + height) > window.pageYOffset
    );
  },
  percentInView: function(el){
    return el.offsetTop; 
  }
};
