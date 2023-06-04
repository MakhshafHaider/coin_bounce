const Joi = require("joi");
const CommentSchema = require('../models/comment');
const CommentDTO = require('../dto/comment');

const authorIdPattern = /^[0-9a-fA-F]{24}$/;

const commentContoller = {
  async create(req,res,next) {
    const createCommnetSchema = Joi.object({
      content: Joi.string().required(),
      author: Joi.string().regex(authorIdPattern).required(),
      blog: Joi.string().regex(authorIdPattern).required(),
    });

    const { error } = createCommnetSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { content, author, blog } = req.body;

    let comment;
    try {
        comment = new CommentSchema({
            content,
            author, 
            blog
        })
        await comment.save();
    } catch (error) {
        return next(error);
    }

    return res.status(201).json({ message: "you have commented"});
  },
  async getById(req,res,next) {
    const getByIdSchema = Joi.object({
        id: Joi.string().regex(authorIdPattern).required()
    });

    const { error } = getByIdSchema.validate(req.params);

    if(error){
       return next(error);
    }

    const { id } = req.params;

    let comments;
    try {
        comments = await CommentSchema.find({ blog: id}).populate('author');
    } catch (error) {
        return next(error);
    }

    let commentdto =[];

    for(let i =0; i< comments.length; i++){
        let obj =  new CommentDTO(comments[i]);
        commentdto.push(obj);
    }


    return res.status(200).json({comments: commentdto});
  }
};

module.exports = commentContoller;
