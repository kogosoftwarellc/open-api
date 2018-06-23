module.exports = {
  "validateArgs": {
    "parameters": [
      {
        "in": "path",
        "name": "path1",
        "type": "string",
        "pattern": "^a$",
        "required": true
      },
      {
        "in": "path",
        "name": "path2",
        "type": "string",
        "pattern": "^f$",
        "required": true
      }
    ],
    "schemas": null
  },
  "request": {
    "path": "/f/a",
    "params": {
      "path1": "f",
      "path2": "a"
    }
  },
  "expectedError": {
    "status": 400,
    "errors": [
      {
        "path": "path1",
        "errorCode": "pattern.openapi.validation",
        "message": "instance.path1 does not match pattern \"^a$\"",
        "location": "path"
      },
      {
        "path": "path2",
        "errorCode": "pattern.openapi.validation",
        "message": "instance.path2 does not match pattern \"^f$\"",
        "location": "path"
      }
    ]
  }
};