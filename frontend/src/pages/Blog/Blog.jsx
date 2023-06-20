import React, { useState, useEffect} from 'react'
import styles from './Blog.module.css';
import { getBlogs } from '../../api/internal';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
export default function Blog() {
    const [ blogs, setblogs ] = useState([]);
    const navigate = useNavigate();

    useEffect(() =>{
        ( async function getBlogsApi(){
            const response = await getBlogs();
            if(response.status === 200){
                setblogs(response.data.blogs);
            }
        })();

        //cleanup function
        setblogs([]);
    }, []);

    if(blogs.length === 0){
        return <Loader text='blogs'/>
    }
  return (
    <div className={styles.blogsWrapper}>
        {
            blogs.map((blog) =>  (
                <div id={blog._id} className={styles.blog} onClick={() => navigate(`/blog/${blog._id}`)}>
                    <h1>{blog.title}</h1>
                    <img src={blog.photo} alt='blogs'/>
                    <p>{blog.content}</p>
                </div>
            ))
        }
    </div>
  )
}
