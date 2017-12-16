// Showing that you don't need to have apiDoc defined on methodHandlers.
module.exports = {
  DELETE: DELETE,
  GET: GET,
  POST: POST
};

function DELETE(req, res, next) {
  res.status(204).end();
}

function GET(req, res, next) {
  res.status(200).send('GET');
}

function POST(req, res, next) {
  res.status(200).send('POST');
}

DELETE.apiDoc = {
  description: 'Delete users.',
  operationId: 'deleteUsers',
  tags: ['users'],
  parameters: [],
  responses: {
    204: {
      description: 'Users were successfully deleted.'
      // 204 should not return a body so not defining a schema.  This adds an implicit
      // schema of {"type": "null"}.
    }
  }
};

GET.apiDoc = {
  description: 'Returns a user.',
  operationId: 'returnUser',
  tags: ['users', 'creating'],
  parameters: [],
  responses: {
    default: {
      description: "Unexpected error",
      schema: {
        $ref: '#/definitions/Error'
      }
    }
  }
};

POST.apiDoc = {
  description: 'Create a new user.',
  operationId: 'createUser',
  tags: ['users', 'creating'],
  parameters: [],
  responses: {
    default: {
      description: "Unexpected error",
      schema: {
        $ref: '#/definitions/Error'
      }
    }
  }
};
