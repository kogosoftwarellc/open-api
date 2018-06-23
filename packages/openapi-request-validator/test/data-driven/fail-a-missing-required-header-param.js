module.exports = {
  "validateArgs": {
    "parameters": [
      {
        "in": "header",
        "name": "foo",
        "type": "string",
        "required": true
      }
    ],
    "schemas": null
  },
  "request": {},
  "expectedError": {
    "status": 400,
    "errors": [
      {
        "path": "foo",
        "errorCode": "required.openapi.validation",
        "message": "instance requires property \"foo\"",
        "location": "headers"
      }
    ]
  }
};