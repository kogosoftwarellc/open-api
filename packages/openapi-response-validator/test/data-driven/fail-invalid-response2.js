module.exports = {
  constructorArgs: {
    definitions: {
      // create a base class with a single required attribute "name"
      "BaseClass": {
        "type": "object",
        "properties": {
          "name": {
            "description": "The name of an object",
            "type": "string",
            "minLength": 1,
            "maxLength": 256
          },
          "description": {
            "description": "A description of an object",
            "type": "string",
            "maxLength": 1024
          },
          "labels": {
            "description": "A list of labels.",
            "type": "array",
            "minItems": 0,
            "maxItems": 100,
            "items": {
              "type": "string",
              "maxLength": 1024
            }
          }
        },
        "required": [
          "name"
        ]
      },

      // create a derived class with optional attribute "derivedProp"
      "DerivedClass": {
        "allOf": [
          {
            "$ref": "#/definitions/NamedObject"
          },
          {
            "type": "object",
            "properties": {
              "derivedProp": {
                "description": "A derived prop",
                "type": "string",
                "default": " "
              }
            }
          }
        ]
      }
    },

    // only "name" is required
    responses: {
      200: {
        schema: {
          "$ref": "#/definitions/DerivedClass"
        }
      }
    }
  },

  inputStatusCode: 200,
  inputResponseBody: { name: 'name' },

  // seems to fail validation, requiring "description" and "labels" to be "string" and "array"
  expectedValidationError: void 0
};
