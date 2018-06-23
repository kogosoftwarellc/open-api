module.exports = {
  "validateArgs": {
    "parameters": [
      {
        "in": "body",
        "name": "foo",
        "required": true,
        "schema": {
          "$ref": "#/definitions/TestBody"
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
        "message": "no such schema #/definitions/TestBody located in </>",
        "schema": {
          "$ref": "#/definitions/TestBody"
        },
        "location": "body"
      }
    ]
  }
};