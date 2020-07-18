module.exports = {
  post: function (req, res, next) {
    res.status(200).json({});
  },
};

module.exports.post.apiDoc = {
  summary: "Form file upload. Accepts a form file upload named 'file'.",
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
};
