function OpenapiDefaultSetter(args) {
  var loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
  if (!args) {
    throw new Error(loggingKey + 'missing args argument');
  }

  if (!Array.isArray(args.parameters)) {
    throw new Error(loggingKey + 'args.parameters must be an Array');
  }

  this.headersDefaults = getDefaults('header', args.parameters);
  this.queryDefaults = getDefaults('query', args.parameters);
}

OpenapiDefaultSetter.prototype.handle = function(request) {
  if (request.headers && this.headersDefaults) {
    setDefaults(request.headers, this.headersDefaults);
  }

  if (request.query && this.queryDefaults) {
    setDefaults(request.query, this.queryDefaults);
  }
};

function byDefault(param) {
  return 'default' in param;
}

function byLocation(location) {
  return function(param) {
    return param.in === location;
  };
}

function getDefaults(location, parameters) {
  var defaults;

  parameters
      .filter(byDefault)
      .filter(byLocation(location))
      .forEach(function(param) {
        var name = param.name;

        if (location === 'header') {
          name = name.toLowerCase();
        }

        if (!defaults) {
          defaults = {};
        }

        defaults[name] = param.default;
      });

  return defaults;
}

function setDefaults(obj, defaults) {
  for (var name in defaults) {
    if (!(name in obj)) {
      obj[name] = defaults[name];
    }
  }
}

module.exports = OpenapiDefaultSetter;
