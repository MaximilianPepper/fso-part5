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
