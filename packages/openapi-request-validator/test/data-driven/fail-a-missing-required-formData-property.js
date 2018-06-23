module.exports = {
  "validateArgs": {
    "parameters": [
      {
        "in": "formData",
        "name": "foo",
        "type": "string",
        "required": true
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
        "path": "foo",
        "errorCode": "required.openapi.validation",
        "message": "instance requires property \"foo\"",
        "location": "formData"
      }
    ]
  }
};