import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./app.css";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Toggable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  const blogRef = useRef();
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

  const createBlog = async (blog) => {
    const newBlog = await blogService.create(blog);
    setBlogs([...blogs, newBlog]);
    setNotificationMessage(`a new blog ${newBlog.title} by ${newBlog.author}`);
    blogRef.current.toggleVisibility();
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const increaseLikes = async (blog) => {
    const updatedBlog = await blogService.likeBlog(blog);
    setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
  };

  const loggedIn = () => (
    <>
      <p>{user.username} logged in </p>
      <button onClick={() => logout()}>logout</button>
      <Togglable buttonName="new blog" ref={blogRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} increaseLikes={increaseLikes} />
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
