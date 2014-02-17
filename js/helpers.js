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