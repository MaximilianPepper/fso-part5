const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Massi",
        username: "max",
        password: "password",
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("login to application")).toBeVisible();
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });
  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("textbox").first().fill("max");
      await page.getByRole("textbox").last().fill("password");

      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Massi logged in")).toBeVisible();
    });
    test("login fails with wrong password", async ({ page }) => {
      await page.getByRole("textbox").first().fill("max");
      await page.getByRole("textbox").last().fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });
  });
});

describe("When logged in", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Massi",
        username: "max",
        password: "password",
      },
    });
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "User",
        username: "newuser",
        password: "password",
      },
    });
    await page.goto("http://localhost:5173");
    await page.getByRole("textbox").first().fill("max");
    await page.getByRole("textbox").last().fill("password");

    await page.getByRole("button", { name: "login" }).click();
  });

  test("a new blog can be created", async ({ page }) => {
    await page.getByRole("button", { name: "new blog" }).click();
    const textboxes = await page.getByRole("textbox").all();
    await textboxes[0].fill("A new Blog");
    await textboxes[1].fill("Tolkien");
    await textboxes[2].fill("www.lordoftherings.com");
    await page.getByRole("button", { name: "save" }).click();
    await expect(page.getByText("A new Blog", { exact: true })).toBeVisible();
    await expect(page.getByText("Tolkien", { exact: true })).toBeVisible();
    await expect(page.getByText("www.lordoftherings.com")).not.toBeVisible();
  });
  test("a new blog can be liked", async ({ page }) => {
    await page.getByRole("button", { name: "new blog" }).click();
    const textboxes = await page.getByRole("textbox").all();
    await textboxes[0].fill("A new Blog");
    await textboxes[1].fill("Tolkien");
    await textboxes[2].fill("www.lordoftherings.com");
    await page.getByRole("button", { name: "save" }).click();
    await page.getByRole("button", { name: "view" }).click();

    await expect(page.getByText("likes: 0")).toBeVisible();
    await page.getByRole("button", { name: "like" }).click();
    await expect(page.getByText("likes: 1", { exact: true })).toBeVisible();
  });
  test("a new blog can be deleted", async ({ page }) => {
    await page.getByRole("button", { name: "new blog" }).click();
    const textboxes = await page.getByRole("textbox").all();
    await textboxes[0].fill("A new Blog");
    await textboxes[1].fill("Tolkien");
    await textboxes[2].fill("www.lordoftherings.com");
    await page.getByRole("button", { name: "save" }).click();
    await page.getByRole("button", { name: "view" }).click();

    await page.getByRole("button", { name: "remove" }).click();
    await expect(
      page.getByText("A new Blog", { exact: true })
    ).not.toBeVisible();
    await expect(page.getByText("Tolkien", { exact: true })).not.toBeVisible();
    await expect(page.getByText("www.lordoftherings.com")).not.toBeVisible();
  });
  test.only("a new blog can be deleted only by the user who made it", async ({
    page,
  }) => {
    //create blog then log in with another account and make sure the blog is still visible
    await page.getByRole("button", { name: "new blog" }).click();
    const textboxes = await page.getByRole("textbox").all();
    await textboxes[0].fill("A new Blog");
    await textboxes[1].fill("Tolkien");
    await textboxes[2].fill("www.lordoftherings.com");
    await page.getByRole("button", { name: "save" }).click();

    await page.getByRole("button", { name: "logout" }).click();
    await page.getByRole("textbox").first().fill("newuser");
    await page.getByRole("textbox").last().fill("password");
    await page.getByRole("button", { name: "login" }).click();
    await page.getByRole("button", { name: "view" }).click();
    await expect(page.getByText("remove", { exact: true })).not.toBeVisible();
  });
});
