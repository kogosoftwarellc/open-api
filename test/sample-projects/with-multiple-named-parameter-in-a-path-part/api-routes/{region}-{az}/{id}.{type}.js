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
    },
    {
      name: 'type',
      in: 'path',
      type: 'string',
      required: true,
      description: 'icon file type(extension)'
    }
  ],
  // method handlers may just be the method handler...
  get: get
};

function get(req, res) {
  res.status(404).json({
    message: 'file not found',
    id: req.params.id,
    region: req.params.region,
    az: req.params.az,
    type: req.params.type
  });
}

get.apiDoc = {
  description: 'Retrieve a VM icon.',
  operationId: 'getVmIcon',
  tags: ['vm'],
  responses: {
    200: {
      $ref: '#/definitions/Vm'
    },

    default: {
      $ref: '#/definitions/Error'
    }
  }
};
