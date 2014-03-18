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
      if (obj.hasOwnProperty(key)){size++;}
    }
    return size;
  },
  addClass: function(object, className){
    classNames = className.split(' ');
    try{
    classNames.forEach(function(name){
      if(!object.classList.contains(name)){
        object.className += ' '+name;
      }
    });
    }catch(e){
      for (i = 0; i < classNames.length; i++) {
        if(object.className.indexOf(classNames[i]) === -1){
          object.className += ' '+classNames[i];
        }
      }
    }
  },
  removeClass: function(object, className){
    classNames = className.split(' ');
    classNames.forEach(function(name){
      regex = new RegExp("(?:^|\\s)" + name + "(?!\\S)", "g");
      object.className = object.className.replace(regex , '' );
    });
  },
  canHasStorage: function(){
    try {
      return 'localStorage' in window && window.localStorage !== null;
    } catch (e) {
      return false;
    }
  }
};

// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};
