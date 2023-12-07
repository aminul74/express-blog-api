const Blog = require("../../models/blog.model");
const { createBlog } = require("../../repositories/blog.repository");

jest.mock("../../models/blog.model");

describe("createBlog", () => {
  it("Test Case 1: Blog Create Success!", async () => {
    // Arrange
    const mockedBlog = {
      id: "blog_id",
      authorId: "fake_userId",
      title: "Test 1",
      content: "Hello World",
    };
    Blog.create.mockResolvedValue(mockedBlog);

    // Act
    const result = await createBlog("fake_userId", "Test 1", "Hello World");

    // Assert
    expect(Blog.create).toHaveBeenCalledWith({
      authorId: "fake_userId",
      title: "Test 1",
      content: "Hello World",
    });
    expect(result).toEqual(mockedBlog);
  });

  it("Test Case 2: Blog Create Failure!", async () => {
    // Arrange
    const errorMessage = "Error creating blog";
    Blog.create.mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    await expect(
      createBlog("someAuthorId", "Test Blog", "Test Content")
    ).rejects.toThrow(errorMessage);
  });
});
