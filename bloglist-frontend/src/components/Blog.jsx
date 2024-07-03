import { useState } from "react";

const Blog = ({ blog }) => {
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
          <button>like</button>
          {blog.user && <p>{blog.user.name} </p>}
          // some old data in the db doesnt have user info in blogs
        </>
      ) : null}
    </div>
  );
};

export default Blog;
