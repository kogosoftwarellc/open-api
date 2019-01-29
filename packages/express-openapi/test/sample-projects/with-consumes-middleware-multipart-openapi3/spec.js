var app;
var expect = require('chai').expect;
var request = require('supertest');

before(function() {
  app = require('./app.js');
});

describe('with openapi3 multipart form consumes middleware', function() {
  it('should work with single attachment', function(done) {
    request(app)
      .post('/v3/single-attachment')
      .attach('file', new Buffer('Some test text', 'utf-8'), 'file_a.txt')
      .expect(
        200,
        {
          body: {
            file: ''
          },
          files: [{ fieldname: 'file', originalname: 'file_a.txt' }]
        },
        done
      );
  });

  it('should work with multiple attachments', function(done) {
    request(app)
      .post('/v3/multiple-attachments')
      .attach('files', new Buffer('Some test text', 'utf-8'), 'file_a.txt')
      .attach('files', new Buffer('Some test text', 'utf-8'), 'file_b.txt')
      .expect(
        200,
        {
          files: [
            { fieldname: 'files', originalname: 'file_a.txt' },
            { fieldname: 'files', originalname: 'file_b.txt' }
          ],
          body: { files: ['', ''] }
        },
        done
      );
  });

  it('should work with text fields', function(done) {
    const textFieldValue = 'Some string value';
    request(app)
      .post('/v3/with-text-fields')
      .attach('files', new Buffer('Some test text', 'utf-8'), 'file_a.txt')
      .attach('files', new Buffer('Some test text', 'utf-8'), 'file_b.txt')
      .field('aTextField', textFieldValue)
      .expect(
        200,
        {
          files: [
            { fieldname: 'files', originalname: 'file_a.txt' },
            { fieldname: 'files', originalname: 'file_b.txt' }
          ],
          body: { files: ['', ''], aTextField: textFieldValue }
        },
        done
      );
  });
});
