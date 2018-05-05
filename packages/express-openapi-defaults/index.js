var loggingKey = require('./package.json').name;

module.exports = defaults;

function defaults(args) {
  if (!args) {
    throw new Error(loggingKey + ': missing args argument');
  }

  if (!Array.isArray(args.parameters)) {
    throw new Error(loggingKey + ': args.parameters must be an Array');
  }

  var headersDefaults = getDefaults('header', args.parameters);
  var queryDefaults = getDefaults('query', args.parameters);

  return function(req, res, next) {
    if (req.headers && headersDefaults) {
      setDefaults(req.headers, headersDefaults);
    }

    if (req.query && queryDefaults) {
      setDefaults(req.query, queryDefaults);
    }

    next();
  };
}

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
