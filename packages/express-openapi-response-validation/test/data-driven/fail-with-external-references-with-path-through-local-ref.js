module.exports = {
    constructorArgs: {
        responses: {
            200: {
                schema: {
                    type: 'object',
                    properties: {
                        foo: {
                            $ref: '#/definitions/foo'
                        }
                    }
                }
            }
        },

        definitions: {
            foo: {
                $ref: 'http://example.com/schema#/definitions/foo'
            }
        },

        externalSchemas: {
            'http://example.com/schema': {
                definitions: {
                    foo: {
                        type: 'string'
                    }
                }
            }
        }
    },

    inputStatusCode: 200,
    inputResponseBody: {foo: 2345},

    expectedValidationError: {
        status: 500,
        message: 'The response was not valid.',
        errors: [
            {
                path: 'foo',
                errorCode: 'type.openapi.responseValidation',
                message: 'foo is not of a type(s) string'
            }
        ]
    }
};

