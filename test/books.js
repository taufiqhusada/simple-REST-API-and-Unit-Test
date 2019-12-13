//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Book = require('../models/book');

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();


chai.use(chaiHttp);

describe('Books', () => {
    //Before each test we empty the database
    beforeEach((done) => { 
        Book.deleteMany({}, (err) => { 
           done();           
        });        
    });

    // Test the /GET route
    describe('/GET book', () => {
        it('it should GET all the books', (done) => {
            chai.request(app)
                .get('/books')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                done();
                });
        });
    });
    
    // Test the /GET/:id route
    describe('/GET/:id book', () => {
        it('it should GET a book by the given id', (done) => {
            let book = new Book({
                "id": 123456789, // number
                "title": "The Title", // string
                "author": "The Author", // string
                "isbn": "ISBN Code", // string
                "publishedOn": 2019, // number
                "numberOfPages": 188 // number
            });
            book.save((err, book) => {
                chai.request(app)
                .get('/books/' + book.id)
                .send(book)
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('id').eql(book.id);
                        res.body.should.have.property('title');
                        res.body.should.have.property('author');
                        res.body.should.have.property('isbn');
                        res.body.should.have.property('publishedOn');
                        res.body.should.have.property('numberOfPages');
                    done();
                });
            });

        });
    });

    // Test the /POST route
    describe('/POST book', () => {
        it('it should not POST a book without id, title, isbn, and number of pages field', (done) => {
            let book = {
                "author": "The Author", 
                "publishedOn": 2019, 
            }
            chai.request(app)
                .post('/books')
                .send(book)
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.errors.should.have.property('id');
                        res.body.errors.id.should.have.property('kind').eql('required');
                        res.body.errors.should.have.property('title');
                        res.body.errors.title.should.have.property('kind').eql('required');
                        res.body.errors.should.have.property('isbn');
                        res.body.errors.isbn.should.have.property('kind').eql('required');
                        res.body.errors.should.have.property('numberOfPages');
                        res.body.errors.numberOfPages.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('it should POST a book ', (done) => {
            let book = {
                "id": 123456789, // number
                "title": "The Title", // string
                "author": "The Author", // string
                "isbn": "ISBN Code", // string
                "publishedOn": 2019, // number
                "numberOfPages": 188 // number
            }
            chai.request(app)
                .post('/books')
                .send(book)
                .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('id');
                        res.body.should.have.property('title');
                        res.body.should.have.property('author');
                        res.body.should.have.property('isbn');
                        res.body.should.have.property('publishedOn');
                        res.body.should.have.property('numberOfPages');
                    done();
                });
        });
    });
    
    // Test the /PUT/:id route
    describe('/PUT/:id book', () => {
        it('it should UPDATE a book given the id', (done) => {
            let book = new Book({
                "id": 123456789, // number
                "title": "The Title", // string
                "author": "The Author", // string
                "isbn": "ISBN Code", // string
                "publishedOn": 2019, // number
                "numberOfPages": 188 // number
            });
            book.save((err, book) => {
                  chai.request(app)
                  .put('/books/' + book.id)
                  .send({
                    "id": 123456789, // number
                    "title": "The Title edited", // string
                    "author": "The Author edited", // string
                    "isbn": "ISBN Code", // string
                    "publishedOn": 2019, // number
                    "numberOfPages": 188 // number
                })
                  .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title').eql("The Title edited");
                        res.body.should.have.property('author').eql("The Author edited");
                    done();
                  });
            });
        });
    });

    // Test the /DELETE route
    describe('/DELETE/:id book', () => {
        it('it should DELETE a book given the id', (done) => {
            let book = new Book({
                "id": 123456789, // number
                "title": "The Title", // string
                "author": "The Author", // string
                "isbn": "ISBN Code", // string
                "publishedOn": 2019, // number
                "numberOfPages": 188 // number
            });
            book.save((err, book) => {
                  chai.request(app)
                  .delete('/books/' + book.id)
                  .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                    done();
                  });
            });
        });
    });
});
