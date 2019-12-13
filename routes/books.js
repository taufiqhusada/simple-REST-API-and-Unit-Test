const BookModel = require('../models/book')
const express = require('express')
const router = express.Router()
const Joi = require('joi');

const inputDataSchema = Joi.object().keys({
    // id is required and must be number > 0
    id: Joi.number().integer().min(0).required(),

    // title is required and can be any string
    title: Joi.string().required(),

    // author is string with only alphabet and space
    author: Joi.string().regex(/^[a-zA-Z ]*$/).optional(),

    // isbn is reqired and must be in format ISBN 90-70002-34-5 
    isbn: Joi.string().regex(/^ISBN\s(?=[-0-9xX ]{13}$)(?:[0-9]+[- ]){3}[0-9]*[xX0-9]$/).required(),

    // published on is optional and must a number > 0
    publishedOn: Joi.number().integer().min(0).optional(),

    // number of pages is required and must number > 0
    numberOfPages: Joi.number().integer().min(0).required(),

});

// GET
router.get('/', (req, res, next) => {
    BookModel.find((err,books) => {
        if (err) return next(new Error(err));
        else res.json(books);
    })
})

// GET book from specific id
router.get('/:id', (req,res,next)=> {
    BookModel.findOne({id:req.params.id},(err,book) => {
        if (err) return next(new Error(err));
        else res.json(book);
    })
})

// POST
router.post('/', (req, res) => {
    var newBook = new BookModel(req.body);
    const {book, error} = Joi.validate(req.body, inputDataSchema);
    if (error){
        return res.status(400).json(error);
    }
    else{
        newBook.save((err,book) => {
            if(err) {
                res.send(err);
            }
            else { //If no errors, send it back to the client
                res.json(book);
            }
        });
    }
})


// UPDATE
router.put('/:id', (req, res, next) => {
    // validating if the id in request parameter and in request body same or not, if not then it is an error
    if (req.params.id!=req.body.id){
        return res.status(500).json("Error, id in parameter and in body are not same");
    }
    else{
        const {book, error} = Joi.validate(req.body, inputDataSchema);
        if (error){
            return res.status(400).json(error);
        }
        else{
            BookModel.findOneAndUpdate({id:req.params.id}, {$set: req.body}, {new: true}, (err,book)=>{
                if (err) {        
                    return next(new Error('book was not found'))
                }
                else{
                    res.json(book)
                }
            })
        }
    }    
})

// DELETE
router.delete('/:id', (req, res) => {
    BookModel.findOneAndRemove({
        id: req.params.id
    },(err,book)=>{
        res.json(book);
    })
})

module.exports = router