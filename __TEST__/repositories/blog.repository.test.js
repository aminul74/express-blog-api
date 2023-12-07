const Blog = require("../../models/blog.model");
const {
  createBlog,
  findBlogsById,
  countBlogs,
  findAllBlogs,
  findBlogById,
  deleteBlogById,
  findBlogByUUId,
  findBlogByAuthUser,
  updateBlogById,
} = require("../../repositories/blog.repository");

jest.mock("../../models/blog.model");

describe("Blog Repositories", () => {
  describe("createBlog", () => {
    it("Test Case 1: Blog Create Success!", async () => {
      // Arrange
      const mockedBlog = {
        id: "blog_id",
        authorId: "fake_userId",
        title: "test 1",
        content: "hello World",
      };
      Blog.create.mockResolvedValue(mockedBlog);

      // Act
      const result = await createBlog("fake_userId", "test 1", "hello world");

      // Assert
      expect(Blog.create).toHaveBeenCalledWith({
        authorId: "fake_userId",
        title: "test 1",
        content: "hello world",
      });
      expect(result).toEqual(mockedBlog);
    });

    it("Test Case 2: Blog Create Failure!", async () => {
      // Arrange
      const errorMessage = "Error creating blog";
      Blog.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(
        createBlog("fake_userId", "Test 1", "Hello World")
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("findBlogsById", () => {
    it("Test Case 1: Get BlogbyId Success!", async () => {
      //Arrange
      const authorId = "fake-id";
      const expectedBlogs = [
        { id: 1, title: "blog 1", content: "content 1" },
        { id: 2, title: "blog 2", content: "content 2" },
      ];
      //Moc
      Blog.findAll.mockResolvedValue(expectedBlogs);
      //Act
      const result = await findBlogsById(authorId);
      // console.log("XXX", result);
      //Assert
      expect(Blog.findAll).toHaveBeenCalledWith({
        where: { authorId },
        attributes: ["id", "title", "content"],
      });
      expect(result).toEqual(expectedBlogs);
    });

    it("Test Case 2: Get BlogbyId Failure!", async () => {
      //Arrange
      const authorId = false;
      //Act and Assert
      Blog.findAll.mockResolvedValue(null);
      const result = await findBlogsById(authorId);

      expect(Blog.findAll).toHaveBeenCalledWith({
        where: { authorId },
        attributes: ["id", "title", "content"],
      });

      expect(result).toBe(null);
    });
  });

  describe("countBlogs", () => {
    it("Test Case 1: Blog Count Success!", async () => {
      //Arrange
      const expectedCount = 5;

      //Moc
      Blog.count.mockResolvedValue(expectedCount);

      //Assert
      const result = await countBlogs();
      expect(Blog.count).toHaveBeenCalled();
      expect(result).toEqual(expectedCount);
    });
  });

  describe("findAllBlogs", () => {
    it("Test Case 1: Find allBlogs Success!", async () => {
      //Arrange
      const size = 10;
      const page = 0;
      const expectedBlogs = [
        { id: 1, title: "blog 1", content: "content 1" },
        { id: 2, title: "blog 2", content: "content 2" },
      ];
      //Moc
      Blog.findAll.mockResolvedValue(expectedBlogs);

      //Act
      const result = await findAllBlogs(page, size);
      //Assert
      expect(Blog.findAll).toHaveBeenCalledWith({
        limit: size,
        offset: page * size,
      });
      expect(result).toBe(expectedBlogs);
    });

    it("Test Case 2: Find AllBlogs Failure", async () => {
      //Arrange
      const size = 10;
      const page = 0;
      //Moc
      Blog.findAll.mockResolvedValueOnce(false);

      //Act
      const result = await findAllBlogs(page, size);
      //Assert
      expect(Blog.findAll).toHaveBeenCalledWith({
        limit: size,
        offset: page * size,
      });
      expect(result).toEqual(false);
    });
  });

  describe("findBlogById", () => {
    it("Test Case 1: Find BlogById Success!", async () => {
      // Arrange
      const blogId = 1;
      const expectedBlog = {
        id: 1,
        title: "blog 1",
        content: "content 1",
      };

      // Mock
      Blog.findByPk.mockResolvedValue(expectedBlog);

      // Act
      const result = await findBlogById(blogId);

      // Assert
      expect(Blog.findByPk).toHaveBeenCalledWith(blogId);
      expect(result).toEqual(expectedBlog);
    });

    it("Test Case 2: Find BlogById Failure!", async () => {
      // Arrange
      const invalidBlogId = "invalid-id";

      // Mock
      Blog.findByPk.mockResolvedValue(null);

      // Act and Assert
      const result = await findBlogById(invalidBlogId);
      expect(Blog.findByPk).toHaveBeenCalledWith(invalidBlogId);
      expect(result).toEqual(null);
    });
  });

  describe("deleteBlogById", () => {
    it("Test Case 1: Delete BlogById Success!", async () => {
      //Arrange
      const id = "id-123";
      const blogUUID = "uuid-123";

      //Moc
      Blog.destroy.mockResolvedValue(true);

      //Act
      const result = await deleteBlogById(id, blogUUID);

      //Assert
      expect(Blog.destroy).toHaveBeenCalledWith({
        where: { id: blogUUID, authorId: id },
      });
      expect(result).toEqual(true);
    });

    it("Test Case 2: Delete BlogById Failure!", async () => {
      //Arrange
      const id = "id-123";
      const blogUUID = "uuid-123";

      //Moc
      Blog.destroy.mockResolvedValue(false);

      //Act
      const result = await deleteBlogById(id, blogUUID);

      //Assert
      expect(Blog.destroy).toHaveBeenCalledWith({
        where: { id: blogUUID, authorId: id },
      });
      expect(result).toEqual(false);
    });
  });

  describe("findBlogByUUId", () => {
    it("Test Case 1: Find BlogByUUId Success!", async () => {
      // Arrange
      const blogUUID = "uuid-123";
      const expectedBlog = {
        id: "uuid-123",
        title: "Test 1",
        content: "Hello World",
        authorId: "auth-123",
      };

      // Mock
      Blog.findOne.mockResolvedValue(expectedBlog);

      // Act
      const result = await findBlogByUUId(blogUUID);

      // Assert
      expect(Blog.findOne).toHaveBeenCalledWith({
        where: { id: blogUUID },
        attributes: ["id", "title", "content"],
      });
      expect(result).toEqual(expectedBlog);
    });

    it("Test Case 2: Find BlogByUUId Failure!", async () => {
      // Arrange
      const invalidUUID = "uuid-321";

      // Mock
      Blog.findOne.mockResolvedValue(null);

      // Act
      const result = await findBlogByUUId(invalidUUID);

      // Assert
      expect(Blog.findOne).toHaveBeenCalledWith({
        where: { id: invalidUUID },
        attributes: ["id", "title", "content"],
      });
      expect(result).toBeNull();
    });
  });

  describe("findBlogByAuthUser", () => {
    it("Test Case 1: Find BlogByAuthUser Success!", async () => {
      //Arrange
      const id = "id-123";
      const blogUUID = "uuid-123";

      const expectedBlog = {
        id: "blog-id",
        title: "blog-title",
        content: "blog-content",
      };
      //Moc
      Blog.findOne.mockResolvedValue(expectedBlog);

      //Act
      const result = await findBlogByAuthUser(id, blogUUID);

      //Assert
      expect(Blog.findOne).toHaveBeenCalledWith({
        where: { id: blogUUID, authorId: id },
        attributes: ["id", "title", "content"],
      });

      expect(result).toEqual(expectedBlog);
    });

    it("Test Case 2: Find BlogByAuthUser Failure!", async () => {
      //Arrange
      const invalidID = "id-123";
      const blogUUID = "uuid-123";

      const expectedBlog = {
        id: "blog-id",
        title: "blog-title",
        content: "blog-content",
      };
      //Moc
      Blog.findOne.mockResolvedValue(false);

      //Act
      const result = await findBlogByAuthUser(invalidID, blogUUID);

      //Assert
      expect(Blog.findOne).toHaveBeenCalledWith({
        where: { id: blogUUID, authorId: invalidID },
        attributes: ["id", "title", "content"],
      });

      expect(result).not.toEqual(expectedBlog);
    });
  });

  describe("updateBlogById", () => {
    it("Test Case 1: Blog Update Success!", async () => {
      //Arrange
      const blogUUID = "uuid-123";
      const title = "blog-title";
      const content = "blog-content";

      const expectedBlog = {
        title: "blog-updateTitle",
        content: "blog-updateContent",
      };
      //Moc
      Blog.update.mockResolvedValue(expectedBlog);

      //Act
      const result = await updateBlogById(blogUUID, title, content);

      //Assert
      expect(Blog.update).toHaveBeenCalledWith(
        { title, content },
        { where: { id: blogUUID } }
      );

      expect(result).toEqual(expectedBlog);
    });

    it("Test Case 2: Blog Update Failure!", async () => {
      //Arrange
      const invalidUUID = "uuid-123";
      const title = "blog-title";
      const content = "blog-content";

      const expectedBlog = {
        title: "blog-updateTitle",
        content: "blog-updateContent",
      };
      //Moc
      Blog.update.mockResolvedValue(false);

      //Act
      const result = await updateBlogById(invalidUUID, title, content);

      //Assert
      expect(Blog.update).toHaveBeenCalledWith(
        { title, content },
        { where: { id: invalidUUID } }
      );

      expect(result).not.toEqual(expectedBlog);
    });
  });
});
