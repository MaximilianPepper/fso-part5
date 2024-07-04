import { useState } from "react";

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
      <div>
        {blog.title} {blog.author} <button onClick={handleClick}>view</button>
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

export default Blog;
