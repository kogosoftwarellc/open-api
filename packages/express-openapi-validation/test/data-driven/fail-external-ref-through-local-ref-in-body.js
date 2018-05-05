module.exports = {
    validateArgs: {
        parameters: [
            {
                in: 'body',
                name: 'foo',
                required: true,
                schema: {
                    properties: {
                        test1: {
                            $ref: '#/definitions/Test1'
                        },
                        test2: {
                            $ref: '#/definitions/Test2'
                        }
                    },
                    required: ['test1', 'test2']
                }
            }
        ],

        schemas: {
            Test1: {
                $ref: 'http://example.com/schema1'
            },

            Test2: {
                $ref: 'http://example.com/schema2#/definitions/Test'
            }
        },
        externalSchemas: {
            'http://example.com/schema1': {
                properties: {
                    foo: {
                        type: 'string'
                    }
                },
                required: ['foo']
            },

            'http://example.com/schema2': {
                definitions: {
                    Test: {
                        properties: {
                            boo: {
                                type: 'string'
                            }
                        },
                        required: ['boo']
                    }
                }
            }
        }
    },

    requestMethod: 'post',

    requestBody: {},

    path: '',

    statusCode: 400,

    responseBody: JSON.stringify({
        status: 400,
        errors: [
            {
                path: 'test1',
                errorCode: 'required.openapi.validation',
                message: 'instance requires property "test1"',
                location: 'body'
            },
            {
                path: 'test2',
                errorCode: 'required.openapi.validation',
                message: 'instance requires property "test2"',
                location: 'body'
            }
        ]
    })
};
