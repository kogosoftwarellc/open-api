module.exports = {
  // it should handle empty constructorArgs and default to version 2
  constructorArgs: null,

  apiDoc: {
    swagger: '2.0',
    info: {
      title: 'Some valid API document',
      version: '1.0.0',
    },
    definitions: {
      User: {
        properties: {
          name: {
            type: 'string',
          },
        },
      },
    },
    paths: {
      '/foo': {
        get: {
          summary: 'Form file upload. Accepts a form file upload named "file".',
          operationId: 'FormDraftFileUpload',

          tags: ['Drafts'],
          consumes: ['multipart/form-data'],
          parameters: [
            {
              name: 'process_intel',
              in: 'formData',
              description: 'Whether or not to transform intel files.',
              type: 'boolean',
              default: false,
            },
            {
              name: 'overwrite',
              in: 'formData',
              description: 'Whether or not to replace an existing file.',
              type: 'boolean',
              default: true,
            },
            {
              name: 'basepath',
              in: 'formData',
              description: 'Root directory to place files.',
              type: 'string',
              default: '',
            },
            {
              name: 'file',
              in: 'formData',
              description: 'The file to upload',
              type: 'file',
            },
          ],
          responses: {
            200: {
              description: 'OK',
            },
            400: {
              description: 'BAD',
            },
          },
        },
      },
    },
  },

  errors: [],
};
