// args.apiDoc needs to be a js object.  This file could be a json file, but we can't add
// comments in json files.
module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'test',
    version: '1.0'
  },
  paths: {
    '/single-attachment': {
      post: {
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Response',
            content: {
              'application/json': {
                schema: {
                  type: 'object'
                }
              }
            }
          }
        }
      }
    },
    '/multiple-attachments': {
      post: {
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['files'],
                properties: {
                  files: {
                    type: 'array',
                    items: {
                      type: 'string',
                      format: 'binary'
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Response',
            content: {
              'application/json': {
                schema: {
                  type: 'object'
                }
              }
            }
          }
        }
      }
    },
    '/with-text-fields': {
      post: {
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['files', 'aTextField'],
                properties: {
                  aTextField: {
                    type: 'string'
                  },
                  files: {
                    type: 'array',
                    items: {
                      type: 'string',
                      format: 'binary'
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Response',
            content: {
              'application/json': {
                schema: {
                  type: 'object'
                }
              }
            }
          }
        }
      }
    }
  },
  servers: [{ url: '/v3' }]
};
