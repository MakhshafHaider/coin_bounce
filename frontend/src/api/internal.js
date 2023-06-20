import axios from "axios";

const api  = axios.create({
    baseURL: process.env.REACT_APP_INTERNAL_API,
    withCredentials: true,
    headers:{
        "Content-Type" : "application/json"
    },
});

export const login = async (data) => {
    let response;

    try {
        response = await api.post('/login', data);
    } catch (error) {
        return error;
    }
    return response;
}

export const signup = async (data) => {
    let response;

    try {
        response = await api.post('/register', data);
    } catch (error) {
        return error;
    }

    return response;
}

export const signout = async () =>{
    let response;

    try {
        response = await api.post('/logout');
    } catch (error) {
        return error;
    }

    return response;
}

export const getBlogs = async () => {
    let response;

    try {
        response = await api.get('/blogs/all')
    } catch (error) {
        console.log(error);
    }
    return response;
}

export const submitBlog = async (data) => {
    let response ;

    try {
        response = await api.post('/blog', data);
    } catch (error) {
        console.log(error)
    }

    return response;
}

export const getBlogById = async (id) => {
    let response;

    try {
        response = await api.get(`/blog/${id}`);
    } catch (error) {
        console.log(error);
    }

    return response;
}

export const getCommentById = async (id) => {
    let response;

    try {
        response = await api.get(`/comment/${id}`, {
            validateStatus: false
        });
    } catch (error) {
        console.log(error);
    }

    return response;
}

export const postComment = async (data) => {
    let response;
    try {
        response = api.post(`/comment`, data);
    } catch (error) {
        console.log(error);
    }

    return response;
}

export const deleteBlog = async(id) => {
    let response;

    try {
        response = await api.delete(`/blog/${id}`);
    } catch (error) {
        console.log(error);
    }

    return response;
}

export const updateBlog = async( data) => {
    let response;

    try {
        response = await api.put(`/blog`, data);
    } catch (error) {
        console.log(error);
    }

    return response;
}