import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./app.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
      setNotificationMessage(`logged in as ${user.username}`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
  const logout = () => {
    setNotificationMessage(`logged out, take care ${user.username}`);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
    setUser(null);
    window.localStorage.clear();
  };

  const addBlog = async (event) => {
    event.preventDefault();
    console.log("Creating blog with:", { title, author, url }); //debug
    try {
      const newBlog = await blogService.create({
        title: title,
        author: author,
        url: url,
        likes: 0,
      });
      setBlogs([...blogs, newBlog]);
      setNotificationMessage(`a new blog ${title} by ${author}`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (exception) {
      setErrorMessage("Blog creation failed");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const newBlog = () => (
    <form onSubmit={addBlog}>
      <div>
        title
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        author
        <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <div>
        url
        <input value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <button type="submit">save</button>
    </form>
  );
  const loggedIn = () => (
    <>
      <p>{user.username} logged in </p>
      <button onClick={() => logout()}>logout</button>
      {newBlog()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
  return (
    <div>
      <h2>{user ? "blogs" : "login to application"}</h2>
      {errorMessage ? <div className="error">{errorMessage}</div> : null}
      {notificationMessage ? (
        <div className="notification">{notificationMessage}</div>
      ) : null}
      {user ? loggedIn() : loginForm()}
    </div>
  );
};

export default App;
