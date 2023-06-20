import React, { useState, useEffect } from "react";
import styles from "./BlogDetails.module.css";
import {
  getBlogById,
  getCommentById,
  postComment,
  deleteBlog,
} from "../../api/internal";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import CommentList from "../../components/CommentList/CommentList";

export default function BlogDetails() {
  const [blog, setBlog] = useState([]);
  const [comments, setComments] = useState([]);
  const [ownsBlog, setOwnsBlog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id;

  const userName = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user._id);

  useEffect(() => {
   (async function getBlogDetails(){
       const commentResponse = await getCommentById(blogId);
       if(commentResponse.status === 201){
        setComments(commentResponse.data.data);
       }

       const blogResponse = await getBlogById(blogId);

       if(blogResponse.status === 200){
        setOwnsBlog(userName === blogResponse.data.blog.authorUsername )
        setBlog(blogResponse.data.blog)
       }
   })()
  }, [reload, blogId, userName]);

  const postCommentHandler = async () => {
    const data = {
      author: userId,
      blog: blogId,
      content: newComment,
    };

    const response = await postComment(data);

    if (response.status === 201) {
      setNewComment("");
      setReload(!reload);
    }
  };

  const deleteBlogHandler = async () => {
    const response = await deleteBlog(blogId);

    if (response.status === 200) {
      navigate("/");
    }
  };

  if(blog.length === 0){
    return <Loader text='bog details' />
  }

  return (
    <div className={styles.detailsWrapper}>
      <div className={styles.left}>
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.meta}>
          <p>
            {" "}
            @{blog.authorUsername + " on " + new Date(blog.createdAt).toDateString()}
          </p>
        </div>
        <div className={styles.photo}>
          <img src={blog.photo} alt="" width={250} height={250} />
        </div>
        <p className={styles.content}>{blog.content}</p>
        {ownsBlog && (
          <div className={styles.controls}>
            <button className={styles.editButton} onClick={() => navigate(`/blog-update/${blog._id}`)}>
              Edit
            </button>
            <button className={styles.deleteButton} onClick={deleteBlogHandler}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.commenstWrapper}>
          <CommentList comments={comments} />
          <div className={styles.postComment}>
            <input
              className={styles.input}
              placeholder="comments goes here"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className={styles.postCommentButton}
              onClick={postCommentHandler}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
