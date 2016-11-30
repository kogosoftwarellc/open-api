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
  var coerceFormData = buildCoercer(args.parameters.filter(byLocation('formData')));

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

    if (req.body && coerceFormData) {
      coerceFormData(req.body);
    }

    next();
  };
}

var COERCION_STRATEGIES = {
  array: function(itemCoercer, collectionFormat, input) {
    if (!Array.isArray(input)) {
      var sep = pathsep(collectionFormat || 'csv');
      input = input.split(sep);
    }

    if (Array.isArray(input)) {
      input.forEach(function(v, i) {
        input[i] = itemCoercer(v);
      });

      return input;
    }
  },

  boolean: function(input) {
    if (typeof input === 'boolean') {
      return input;
    }

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

var STRICT_COERCION_STRATEGIES = {
  boolean: function(input) {
    if (typeof input === 'boolean') {
      return input;
    }

    if (input.toLowerCase() === 'false') {
      return false;
    } else if (input.toLowerCase() === 'true') {
      return true;
    } else {
      return null;
    }
  },
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
	  
      var strict = param["x-express-openapi-coercion-strict"];

      if (type === 'array') {
        if (!param.items) {
          throw new Error(loggingKey + ': items is a required property with type array');
        }

        if (param.items.type === 'array') {
          throw new Error(loggingKey + ': nested arrays are not allowed (items was of type array)');
        }
		
        itemCoercer = getCoercer(param.items.type, strict);

        coercer = COERCION_STRATEGIES.array.bind(null, itemCoercer, param.collectionFormat);
      } else {
        coercer = getCoercer(param.type, strict);
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

function getCoercer(type, strict) {
  var strategy = undefined;
  if (strict) {
    strategy = STRICT_COERCION_STRATEGIES[type];
  }
  if (!strategy) {
    strategy = COERCION_STRATEGIES[type];
  }
  return strategy;
}

function pathsep(format) {
  switch (format) {
    case 'csv':
      return ',';
    case 'ssv':
      return ' ';
    case 'tsv':
      return '\t';
    case 'pipes':
      return '|';
  }
}
