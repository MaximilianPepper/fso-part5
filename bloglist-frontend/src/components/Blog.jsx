import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, increaseLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleClick = () => {
    let res = !visible;
    setVisible(res);
  };

  return (
    <div style={blogStyle}>
      <div className="blog">
        <p>{blog.title}</p> <p>{blog.author}</p>{" "}
        <button onClick={handleClick}>view</button>
      </div>
      {visible ? (
        <>
          <p>{blog.url}</p>
          <p>likes: {blog.likes}</p>
          <button onClick={() => increaseLikes(blog)}>like</button>
          {blog.user && <p>{blog.user.name} </p>}
          <button onClick={() => deleteBlog(blog)}>remove</button>
        </>
      ) : null}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  increaseLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
