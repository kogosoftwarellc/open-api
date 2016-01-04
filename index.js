var loggingKey = require('./package.json').name;

module.exports = coerce;

function coerce(args) {
  if (!args) {
    throw new Error(loggingKey + ': missing args argument');
  }

  if (!Array.isArray(args.parameters)) {
    throw new Error(loggingKey + ': args.parameters must be an Array');
  }

  var coerceHeaders = buildCoercer(args.parameters.filter(byLocation('header')),
      true);
  var coerceParams = buildCoercer(args.parameters.filter(byLocation('path')));
  var coerceQuery = buildCoercer(args.parameters.filter(byLocation('query')));

  return function(req, res, next) {
    if (req.headers && coerceHeaders) {
      coerceHeaders(req.headers);
    }

    if (req.params && coerceParams) {
      coerceParams(req.params);
    }

    if (req.query && coerceQuery) {
      coerceQuery(req.query);
    }

    next();
  };
}

var COERCION_STRATEGIES = {
  array: function(itemCoercer, input) {
    if (Array.isArray(input)) {
      input.forEach(function(v, i) {
        input[i] = itemCoercer(v);
      });

      return input;
    } else {
      return [itemCoercer(input)];
    }
  },

  boolean: function(input) {
    if (input === 'false') {
      return false;
    } else {
      return true;
    }
  },

  integer: function(input) {
    return Math.floor(Number(input));
  },

  number: function(input) {
    return Number(input);
  },

  string: function(input) {
    return String(input);
  }
};

function buildCoercer(params, isHeaders) {
  var coercion;
  var l = isHeaders ?
      function(name) {
        return name.toLowerCase();
      } :
      function(name) {
        return name;
      };

  if (params.length) {
    var coercers = {};

    params.forEach(function(param) {
      var name = param.name;
      var coercer;
      var itemCoercer;
      var type = param.type;

      if (type === 'array') {
        if (!param.items) {
          throw new Error(loggingKey + ': items is a required property with type array');
        }

        if (param.items.type === 'array') {
          throw new Error(loggingKey + ': nested arrays are not allowed (items was of type array)');
        }

        itemCoercer = getCoercer(param.items.type);

        coercer = COERCION_STRATEGIES.array.bind(null, itemCoercer);
      } else {
        coercer = getCoercer(param.type);
      }

      if (coercer) {
        coercers[l(name)] = coercer;
      }
    });

    coercion = function(obj) {
      for (var paramName in obj) {
        if (paramName in coercers) {
          obj[paramName] = coercers[paramName](obj[paramName]);
        }
      }
    };
  }

  return coercion;
}

function byLocation(location) {
  return function(param) {
    return param.in === location;
  };
}

function getCoercer(type) {
  return COERCION_STRATEGIES[type];
}
