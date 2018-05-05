module.exports = {
  // parameters for all operations in this path
  parameters: [
    {
      name: 'id',
      in: 'path',
      type: 'string',
      required: true,
      description: 'VM id'
    },
    {
      name: 'region',
      in: 'path',
      type: 'string',
      required: true,
      description: 'VM region'
    },
    {
      name: 'az',
      in: 'path',
      type: 'string',
      required: true,
      description: 'VM available zone'
    }
  ],
  // method handlers may just be the method handler...
  get: get
};

function get(req, res) {
  res.status(200).json({
    id: req.params.id,
    region: req.params.region,
    az: req.params.az
  });
}

get.apiDoc = {
  description: 'Retrieve a VM.',
  operationId: 'getVm',
  tags: ['vm'],
  responses: {
    200: {
      description: 'Requested VM',
      schema: {
        $ref: '#/definitions/Vm'
      }
    },

    default: {
      description: "Unexpected error",
      schema: {
        $ref: '#/definitions/Error'
      }
    }
  }
};
