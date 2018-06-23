module.exports = {
  "validateArgs": {
    "parameters": [
      {
        "in": "body",
        "name": "foo",
        "required": true,
        "schema": {
          "$ref": "#/definitions/Test1"
        }
      }
    ],
    "schemas": {
      "Test1": {
        "properties": {
          "foo": {
            "type": "string"
          }
        },
        "required": [
          "foo"
        ]
      }
    }
  },

  "request": {
    "body": {}
  },

  expectedError: {
    'status': 400,
    'errors': [
      {
        'path': 'foo',
        'errorCode': 'required.openapi.validation',
        'message': 'instance requires property "foo"',
        'location': 'body'
      }
    ]
  }

};
