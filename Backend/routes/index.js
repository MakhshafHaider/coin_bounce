const express = require('express');
const authController = require('../controllers/authController');
const blogController = require('../controllers/blogController');
const router = express.Router();
const auth = require('../middlewares/auth');
const commentContoller = require('../controllers/commentController');

//auth routes

//Register route
router.post('/register', authController.register);
// Login Route
router.post('/login', authController.login);
//Logout Route
router.post('/logout', auth, authController.logout);
//refresh Route
router.get('/refresh', authController.refresh)

///blog routes

//create 
router.post('/blog', auth, blogController.create);
//get all
router.get('/blogs/all', auth, blogController.getall);
//get by id
router.get('/blog/:id', auth, blogController.getById);
//update
router.put('/blog', auth, blogController.updateBlog);
//delete
router.delete('/blog/:id', auth, blogController.deleteBlog);


// commnets route

//create
router.post('/comment', auth, commentContoller.create)
//get by id 
router.get('/comment/:id', auth, commentContoller.getById);

module.exports = router;