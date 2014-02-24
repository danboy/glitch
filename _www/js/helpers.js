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
  },
  addClass: function(object, className){
    classNames = className.split(' ');
    classNames.forEach(function(name){
      if(!object.classList.contains(name)){
        object.className += ' '+name
      }
    });
  },
  removeClass: function(object, className){
    classNames = className.split(' ');
    classNames.forEach(function(name){
      regex = RegExp("(?:^|\\s)" + name + "(?!\\S)", "g");
      object.className = object.className.replace(regex , '' );
    })
  }
};
