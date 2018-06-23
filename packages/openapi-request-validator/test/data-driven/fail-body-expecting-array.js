module.exports = {
  "validateArgs": {
    "parameters": [
      {
        "in": "body",
        "name": "foo",
        "required": true,
        "schema": {
          "type": "array"
        }
      }
    ]
  },
  "request": {
    "body": {}
  },
  "expectedError": {
    "status": 400,
    "errors": [
      {
        "errorCode": "type.openapi.validation",
        "message": "instance is not of a type(s) array",
        "location": "body"
      }
    ]
  }
};