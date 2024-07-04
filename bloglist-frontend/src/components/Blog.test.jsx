import { render, screen } from "@testing-library/react";
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
