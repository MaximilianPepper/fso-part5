import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "test name",
    author: "max",
    likes: 14,
    user: {
      name: "Superuser",
    },
  };
  // PropTypes causes error without functions
  const mockIncreaseLikes = vi.fn();
  const mockDeleteBlog = vi.fn();

  render(
    <Blog
      blog={blog}
      increaseLikes={mockIncreaseLikes}
      deleteBlog={mockDeleteBlog}
    />
  );

  const element = screen.getByText("test name");
  const element1 = screen.getByText("max");
  expect(element).toBeDefined();
  expect(element1).toBeDefined();
  const likes = screen.queryByText("14");
  const user = screen.queryByText("Superuser");
  expect(likes).not.toBeInTheDocument();
  expect(user).not.toBeInTheDocument();
  // screen.debug();
});

test("clicking the button calls event handler once", async () => {
  const blog = {
    title: "test name",
    author: "max",
    likes: 14,
    user: {
      name: "Superuser",
    },
  };
  // PropTypes causes error without functions
  const mockIncreaseLikes = vi.fn();
  const mockDeleteBlog = vi.fn();

  render(
    <Blog
      blog={blog}
      increaseLikes={mockIncreaseLikes}
      deleteBlog={mockDeleteBlog}
    />
  );

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);
  screen.debug();
  // no need for mock function as its not a prop, clicking button makes likes and user visible
  //expect(mockHandler.mock.calls).toHaveLength(1);
  const likes = screen.getByText("likes: 14");
  const userName = screen.getByText("Superuser");
  expect(likes).toBeDefined();
  expect(userName).toBeDefined();
});
