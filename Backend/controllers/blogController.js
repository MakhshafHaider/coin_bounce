const Joi = require("joi");
const fs = require("fs");
const blogSchema = require("../models/blog");
const { BACKEND_SERVER_PATH } = require("../config/index");
const BlogDTO = require("../dto/blog");
const BlogDetailDTO = require("../dto/blog_details");
const commentSchema = require('../models/comment');

const authorIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
  async create(req, res, next) {
    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(authorIdPattern).required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });

    const { error } = createBlogSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, author, content, photo } = req.body;
    
    // we take image as a base 64 encode data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII
    
    //read image as a buffer
    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    // give image a random name
    const imagePath = `${Date.now()}-${author}.png`;

    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }

    let newBlog;

    try {
      newBlog = new blogSchema({
        title,
        author,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      });

      await newBlog.save();
    } catch (error) {
      return next(error);
    }

    const blogDTO = new BlogDTO(newBlog);

    return res.status(201).json({ blog: blogDTO });
  },
  async getall(req, res, next) {
    try {
      const blogs = await blogSchema.find({});
      let blogsdto = [];

      for (let i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        blogsdto.push(dto);
      }
      
      return res.status(200).json({ blogs: blogsdto });
    } catch (error) {
        return next(error);
    }
  },

  async getById(req, res, next) {
    const getByIdSchema = Joi.object({
      id: Joi.string().regex(authorIdPattern).required(),
    });

    const { error } = getByIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { id } = req.params;
    let blog;
    try {
      blog = await blogSchema.findOne({ _id: id }).populate("author");
    } catch (error) {
      return next(error);
    }

    const blogDetaildto = new BlogDetailDTO(blog);
    return res.status(200).json({ blog: blogDetaildto });
  },
  async updateBlog(req, res, next) {
    const UpdateBlogSchema = Joi.object({
      title: Joi.string(),
      content: Joi.string(),
      author: Joi.string().regex(authorIdPattern).required(),
      blogId: Joi.string().regex(authorIdPattern).required(),
      photo: Joi.string(),
    });

    const { error } = UpdateBlogSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, content, author, blogId, photo } = req.body;

    let blog;
    try {
      blog = await blogSchema.findOne({ _id: blogId });
    } catch (error) {
      return next(error);
    }

    if (photo) {
      let previousPhoto = blog.photoPath;
      previousPhoto = previousPhoto.split("/").at(-1);


      fs.unlinkSync(`storage/${previousPhoto}`);

      //read image as a buffer
      const buffer = Buffer.from(
        photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      // give image a random name
      const imagePath = `${Date.now()}-${author}.png`;

      try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
      } catch (error) {
        return next(error);
      }

      await blogSchema.updateOne({ _id: blogId}, {
        title, content, photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`
      });

    }
    else{
        await blogSchema.updateOne({ _id: blogId}, {title, content});
    }

    await res.status(200).json({ message: "Blog Updated"});
  },
  async deleteBlog(req, res, next) {
    const deleteBlogSchema = Joi.object({
        id: Joi.string().regex(authorIdPattern).required()
       })

       const { error } = deleteBlogSchema.validate(req.params);

       if(error){
        return next(error);
       }
       const { id } = req.params;
       
       console.log("id", id);

       try {
        await blogSchema.deleteOne({ _id: id});
        
        await commentSchema.deleteMany({ blog: id});
       } catch (error) {
        return next(error);
       }

      return res.status(200).json({message: "Deleted blog"})
  },
};

module.exports = blogController;
