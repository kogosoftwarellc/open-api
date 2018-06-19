function OpenapiRequestCoercer(args) {
  var loggingKey = args && args.loggingKey ? args.loggingKey + ': ' : '';
  var extensionBase = args && args.extensionBase ? args.extensionBase : 'x-openapi-coercion';
  var strictExtension = extensionBase + '-strict';
  if (!args) {
    throw new Error(loggingKey + 'missing args argument');
  }

  if (!Array.isArray(args.parameters)) {
    throw new Error(loggingKey + 'args.parameters must be an Array');
  }

  this.coerceHeaders = buildCoercer(args.parameters.filter(byLocation('header')),
      true, loggingKey, strictExtension);
  this.coerceParams = buildCoercer(args.parameters.filter(byLocation('path')), false, loggingKey, strictExtension);
  this.coerceQuery = buildCoercer(args.parameters.filter(byLocation('query')), false, loggingKey, strictExtension);
  this.coerceFormData = buildCoercer(args.parameters.filter(byLocation('formData')), false, loggingKey, strictExtension);
}

OpenapiRequestCoercer.prototype.coerce = function(request) {
  if (request.headers && this.coerceHeaders) {
    this.coerceHeaders(request.headers);
  }

  if (request.params && this.coerceParams) {
    this.coerceParams(request.params);
  }

  if (request.query && this.coerceQuery) {
    this.coerceQuery(request.query);
  }

  if (request.body && this.coerceFormData) {
    this.coerceFormData(request.body);
  }
};

var COERCION_STRATEGIES = {
  array: function(itemCoercer, collectionFormat, input) {
    if (!Array.isArray(input)) {
      var sep = pathsep(collectionFormat || 'csv');
      input = input.split(sep);
    }

    input.forEach(function(v, i) {
      input[i] = itemCoercer(v);
    });

    return input;
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

function buildCoercer(params, isHeaders, loggingKey, strictExtensionName) {
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

      var strict = !!param[strictExtensionName];

      if (type === 'array') {
        if (!param.items) {
          throw new Error(loggingKey + 'items is a required property with type array');
        }

        if (param.items.type === 'array') {
          throw new Error(loggingKey + 'nested arrays are not allowed (items was of type array)');
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
  var strategy;
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

module.exports = OpenapiRequestCoercer;
