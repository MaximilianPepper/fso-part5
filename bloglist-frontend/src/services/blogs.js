import axios from "axios";

const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const likeBlog = (blog) => {
  const updatedBlog = {
    ...blog,
    likes: blog.likes + 1,
  };
  const request = axios.put(`${baseUrl}/${blog.id}`, updatedBlog);
  return request.then((response) => response.data);
};

const deleteBlog = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, setToken, create, likeBlog, deleteBlog };
