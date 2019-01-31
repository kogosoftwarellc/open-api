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
      .attach('file', Buffer.from('Some test text', 'utf-8'), 'file_a.txt')
      .expect(
        200,
        {
          body: {
            file: ''
          },
          files: { file: [{ originalname: 'file_a.txt' }] }
        },
        done
      );
  });

  it('should work with multiple attachments', function(done) {
    request(app)
      .post('/v3/multiple-attachments')
      .attach('files', Buffer.from('Some test text', 'utf-8'), 'file_a.txt')
      .attach('files', Buffer.from('Some test text', 'utf-8'), 'file_b.txt')
      .expect(
        200,
        {
          files: {
            files: [
              { originalname: 'file_a.txt' },
              { originalname: 'file_b.txt' }
            ]
          },
          body: { files: ['', ''] }
        },
        done
      );
  });

  it('should work with multiple attachments in spec with single attachment passed', function(done) {
    request(app)
      .post('/v3/multiple-attachments')
      .attach('files', Buffer.from('Some test text', 'utf-8'), 'file_a.txt')
      .expect(
        200,
        {
          files: {
            files: [{ originalname: 'file_a.txt' }]
          },
          body: { files: [''] }
        },
        done
      );
  });

  it('should work with multiple attachments, single attachment and text fields', function(done) {
    const textFieldValue = 'Some string value';
    request(app)
      .post('/v3/multiple-single-and-text-fields')
      .attach(
        'multipleAttachments',
        Buffer.from('Some test text', 'utf-8'),
        'file_a.txt'
      )
      .attach(
        'singleAttachment',
        Buffer.from('Some test text', 'utf-8'),
        'file_b.txt'
      )
      .field('aTextField', textFieldValue)
      .expect(
        200,
        {
          files: {
            multipleAttachments: [{ originalname: 'file_a.txt' }],
            singleAttachment: [{ originalname: 'file_b.txt' }]
          },
          body: {
            multipleAttachments: [''],
            singleAttachment: '',
            aTextField: textFieldValue
          }
        },
        done
      );
  });
});
