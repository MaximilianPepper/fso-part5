import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
      likes: 0,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };
  const changeAuthor = (e) => {
    setAuthor(e.target.value);
  };
  const changeUrl = (e) => {
    setUrl(e.target.value);
  };
  return (
    <form onSubmit={addBlog}>
      <div>
        title
        <input value={title} onChange={changeTitle} />
      </div>
      <div>
        author
        <input value={author} onChange={changeAuthor} />
      </div>
      <div>
        url
        <input value={url} onChange={changeUrl} />
      </div>
      <button type="submit">save</button>
    </form>
  );
};

export default BlogForm;
