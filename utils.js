function Utils() {}

Utils.getValue = function(key, defaultValue) {
  var value = window.localStorage.getItem(key)
  return value === null || value === undefined ? defaultValue : value;
};

Utils.getBooleanValue = function(key, defaultValue) {
  var value = Utils.getValue(key, defaultValue);
  return typeof(value) == 'boolean' ? value :
      value == 'true' ? true :
          value == 'false' ? false :
              defaultValue;
};
