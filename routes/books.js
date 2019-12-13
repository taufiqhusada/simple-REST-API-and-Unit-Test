let BookModel = require('../models/book')
let express = require('express')
let router = express.Router()

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
    newBook.save((err,book) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json(book);
        }
    });
})


// UPDATE
router.put('/:id', (req, res, next) => {
    // validating if the id in request parameter and in request body same or not, if not then it is an error
    if (req.params.id!=req.body.id){
        return res.status(500).json("Error, id in parameter and in body are not same");
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