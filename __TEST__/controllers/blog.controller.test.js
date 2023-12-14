const blogService = require("../../services/blog.service");
const BlogDto = require("../../dto/blog.dto");
const userService = require("../../services/user.service");
const { blogsDB, usersDB } = require("../testDB");
const { getContentBasedOnNegotiation } = require("../../utils/responseType");
const {
  handleCreateBlogRequest,
  handleGetUserSelfBlogRequest,
  handleGetAllBlogsRequest,
  handleBlogDeletionRequest,
  handleBlogByIdRequest,
  handleUpdateBlogRequest,
} = require("../../controllers/blog.controller");

jest.mock("../../services/blog.service");
jest.mock("../../services/user.service");
jest.mock("../../dto/blog.dto.js");
jest.mock("../../utils/responseType");

describe("Blog Controllers", () => {
  describe("handleCreateBlogRequest", () => {
    it("Test Case 1: Blog Create Success!", async () => {
      // Arrange
      const req = {
        body: {
          title: "Test 1",
          content: "Hello world 1!",
        },
        accepts: jest.fn().mockReturnValue("json"),
        user: {
          id: "12345",
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };
      const next = jest.fn();

      const { title, content } = req.body;
      const userData = req.user;
      const blogDto = { title, content };
      const response = { ...blogsDB[1] };
      const isBlogCreated = {
        get: (_params) => blogsDB[1],
      };

      const newBlog = [isBlogCreated];
      const jsonBlogs = newBlog.map((blog) => blog.get({ plain: true }));

      const negotiate = req.accepts(["json", "text", "xml", "html"]);

      // Mock
      BlogDto.BlogCreateRequestDto.mockReturnValue(blogDto);
      blogService.processNewBlog.mockResolvedValue(isBlogCreated);
      getContentBasedOnNegotiation.mockResolvedValue(response);

      // Act
      await handleCreateBlogRequest(req, res, next);

      // Assert
      expect(BlogDto.BlogCreateRequestDto).toHaveBeenCalledWith(title, content);
      expect(blogService.processNewBlog).toHaveBeenCalledWith(
        userData,
        blogDto
      );

      expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(
        jsonBlogs,
        negotiate
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.type).toHaveBeenCalledWith(negotiate);
      expect(res.send).toHaveBeenCalledWith(response);
    });

    it("Test Case 1: Blog Create Failure!", async () => {
      // Arrange

      const req = {
        body: {
          title: "Test 1",
          content: "Hello world 1!",
        },
        accepts: jest.fn().mockReturnValue("json"),
        user: {
          id: "12345",
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };
      const next = jest.fn();

      const blogDto = {
        title: "Test 1",
        content: "Hello world 1!",
      };

      const userData = req.user;
      const { title, content } = req.body;
      //Moc
      BlogDto.BlogCreateRequestDto.mockReturnValue(blogDto);
      const error = new Error("Create Fail");
      blogService.processNewBlog.mockRejectedValue(error);

      // Act
      await handleCreateBlogRequest(req, res, next);

      //Assert
      expect(BlogDto.BlogCreateRequestDto).toHaveBeenCalledWith(title, content);
      expect(blogService.processNewBlog).toHaveBeenCalledWith(
        userData,
        blogDto
      );

      expect(res.status).not.toHaveBeenCalledWith();
      expect(res.type).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith(error);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("handleGetUserSelfBlogRequest", () => {
    it("Test Case 1: User Self Blog Get Success!", async () => {
      // Arrange
      const req = {
        body: {
          title: "Test 1",
          content: "Hello world 1!",
        },
        accepts: jest.fn().mockReturnValue("json"),
        user: {
          id: "12345",
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };

      const userData = req.user;
      const response = [blogsDB[1]];
      const isGetUserAllBlogs = [{ get: () => blogsDB[1] }];

      const jsonBlogs = isGetUserAllBlogs.map((blog) =>
        blog.get({ plain: true })
      );
      const negotiate = req.accepts(["json", "text", "xml", "html"]);
      const next = jest.fn();

      // Mock
      blogService.processSpecificUserBlog.mockResolvedValue(isGetUserAllBlogs);

      // Mock
      getContentBasedOnNegotiation.mockResolvedValue(response);

      await handleGetUserSelfBlogRequest(req, res, next);

      // Assert
      expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(
        jsonBlogs,
        negotiate
      );
      expect(blogService.processSpecificUserBlog).toHaveBeenCalledWith(
        userData
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.type).toHaveBeenCalledWith(negotiate);
      expect(res.send).toHaveBeenCalledWith(response);
      expect(next).not.toHaveBeenCalled();
    });

    it("Test Case 2: User Self Blog Get Failure!", async () => {
      // Arrange
      const req = {
        body: {
          title: "Test 1",
          content: "Hello world 1!",
        },
        accepts: jest.fn().mockReturnValue("json"),
        user: {
          id: "12345",
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };

      const isGetUserAllBlogs = [{ get: () => blogsDB[1] }];
      const userData = req.user;
      const next = jest.fn();

      //Moc
      const error = new Error("Create Fail");
      blogService.processSpecificUserBlog.mockRejectedValue(error);

      //Act
      await handleGetUserSelfBlogRequest(req, res, next);

      // Assert
      expect(blogService.processSpecificUserBlog).toHaveBeenCalledWith(
        userData
      );

      expect(res.status).not.toHaveBeenCalledWith();
      expect(res.type).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("handleGetAllBlogsRequest", () => {
    it("Test case 1: All Blog Get Success!", async () => {
      //Arrange
      const req = {
        query: { page: 0, size: 1 },
        accepts: jest.fn().mockReturnValue(["json", "text", "xml", "html"]),
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };

      const next = jest.fn();
      const { page, size } = req.query;
      const response = blogsDB[1];
      const isGetAllBlogs = [{ get: () => blogsDB[1] }];
      const jsonBlogs = isGetAllBlogs.map((blogs) =>
        blogs.get({ plain: true })
      );
      const negotiate = req.accepts(["json", "text", "xml", "html"]);
      //Mock
      blogService.processAllBlogs.mockResolvedValue(isGetAllBlogs);
      getContentBasedOnNegotiation.mockResolvedValue(response);

      //Act
      await handleGetAllBlogsRequest(req, res, next);

      //Assert
      expect(blogService.processAllBlogs).toHaveBeenCalledWith(page, size);
      expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(
        jsonBlogs,
        negotiate
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(req.accepts).toHaveBeenCalledWith(["json", "text", "xml", "html"]);
      expect(res.type).toHaveBeenCalledWith(negotiate);
      expect(res.send).toHaveBeenCalledWith(response);
    });

    it("Test case 2: All Blog Get Failure!", async () => {
      //Arrange
      const req = {
        query: { page: 0, size: 5 },
        accepts: jest.fn().mockReturnValue(["json", "text", "xml", "html"]),
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };
      const next = jest.fn();

      //Moc
      blogService.processAllBlogs.mockRejectedValue();

      //Act

      await handleGetAllBlogsRequest(req, res, next);

      //Assert

      expect(blogService.processAllBlogs).not.toHaveBeenCalledWith();
      expect(req.accepts).not.toHaveBeenCalledWith();
      expect(res.type).not.toHaveBeenCalledWith();
      expect(getContentBasedOnNegotiation).not.toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleBlogDeletionRequest", () => {
    it("Test Case 1: Blog Delete Success!", async () => {
      //Arrange
      const req = {
        params: {
          uuid: "uuid-123",
        },
        user: {
          id: "12345",
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const blogUUID = req.params.uuid;
      const userData = req.user;

      const next = jest.fn();
      //Moc

      blogService.processDeleteBlog.mockResolvedValue(true);

      // Act
      await handleBlogDeletionRequest(req, res, next);

      // Assert
      expect(blogService.processDeleteBlog).toHaveBeenCalledWith(
        userData,
        blogUUID
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Delete success!");
    });

    it("Test case 2: Unable to delete blog", async () => {
      //Arrange
      const req = {
        params: {
          uuid: "uuid-123",
        },
        user: {
          id: "12345",
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const blogUUID = req.params.uuid;
      const userData = req.user;

      const next = jest.fn();
      //Moc
      const error = new Error("Errorr");
      blogService.processDeleteBlog.mockRejectedValue(error);

      // Act
      await handleBlogDeletionRequest(req, res, next);

      // Assert
      expect(blogService.processDeleteBlog).toHaveBeenCalledWith(
        userData,
        blogUUID
      );
      expect(res.status).not.toHaveBeenCalledWith(200);
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("handleBlogByIdRequest", () => {
    it("Test case 1: Get Blog by Id Success", async () => {
      // Arrange
      const req = {
        params: {
          uuid: "uuid-123",
        },
        accepts: jest.fn().mockReturnValue("json"),
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };
      const next = jest.fn();
      const negotiate = req.accepts(["json", "text", "xml", "html"]);
      const response = blogsDB[1];
      const isGetBlogById = { get: () => blogsDB[1] };
      const getBlogById = [isGetBlogById];
      const jsonBlogs = getBlogById.map((blog) => blog.get({ plain: true }));
      const blogUUID = req.params.uuid;
      // Mock
      blogService.processBlogbyId.mockResolvedValue(isGetBlogById);
      getContentBasedOnNegotiation.mockReturnValue(response);

      // Act
      await handleBlogByIdRequest(req, res, next);

      // Assert
      expect(blogService.processBlogbyId).toHaveBeenCalledWith(blogUUID);
      expect(res.type).toHaveBeenCalledWith(negotiate);
      expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(
        jsonBlogs,
        negotiate
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(response);
    });

    it("Test case 2: Unable to get Blog by Id", async () => {
      // Arrange
      const req = {
        params: { uuid: "uuid-123" },
        accepts: jest.fn().mockReturnValue("json"),
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };

      const next = jest.fn();
      const blogUUID = req.params.uuid;
      const negotiate = req.accepts(["json", "text", "xml", "html"]);
      // Mock
      const error = new Error("errorr");
      blogService.processBlogbyId.mockResolvedValue(error);

      // Act
      await handleBlogByIdRequest(req, res, next);

      // Assert
      expect(blogService.processBlogbyId).toHaveBeenCalledWith(blogUUID);
      expect(req.accepts).not.toHaveBeenCalledWith(negotiate);
      expect(res.status).not.toHaveBeenCalledWith(404);
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("Test case 3: Not Acceptable", async () => {
      // Arrange
      const req = {
        params: { uuid: "uuid-123" },
        accepts: jest.fn().mockReturnValue(null),
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      // Act
      await handleBlogByIdRequest(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleUpdateBlogRequest", () => {
    it("Test case 1: Update Blog Success!", async () => {
      // Arrange
      const req = {
        params: { uuid: "uuid-123" },
        body: {
          title: "Test 1",
          content: "Hello world 1!",
        },
        accepts: jest.fn().mockReturnValue("json"),
        user: usersDB[1],
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };

      const { title, content } = req.body;
      const next = jest.fn();
      const response = blogsDB[1];
      const updateBlog = {
        get: (_params) => blogsDB[1],
      };

      const getBlogById = [updateBlog];
      const jsonBlogs = getBlogById.map((blog) => blog.get({ plain: true }));
      const userData = req.user;
      const blogUUID = req.params.uuid;
      const blogDto = {
        title: "Test 1",
        content: "Hello world 1!",
      };

      const negotiate = req.accepts(["json", "text", "xml", "html"]);

      // Mock

      BlogDto.BlogUpdateRequestDto.mockReturnValue(blogDto);
      blogService.processUpdateBlog.mockResolvedValue(updateBlog);
      getContentBasedOnNegotiation.mockResolvedValue(response);

      //Act
      await handleUpdateBlogRequest(req, res, next);

      //Assert
      expect(BlogDto.BlogUpdateRequestDto).toHaveBeenCalledWith(title, content);
      expect(blogService.processUpdateBlog).toHaveBeenCalledWith(
        userData,
        blogUUID,
        blogDto
      );

      expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(
        jsonBlogs,
        negotiate
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.type).toHaveBeenCalledWith(negotiate);
      expect(res.send).toHaveBeenCalledWith(response);
    });

    it("Test case 2: Unable to update Blog", async () => {
      // Arrange
      const req = {
        params: { uuid: "uuid-123" },
        body: {
          title: "Test 1",
          content: "Hello world 1!",
        },
        accepts: jest.fn().mockReturnValue("json"),
        user: usersDB[1],
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };

      const next = jest.fn();
      const blogDto = {
        title: "Test 1",
        content: "Hello world 1!",
      };
      const userData = req.user;
      const blogUUID = req.params.uuid;
      const { title, content } = req.body;
      // Mock
      BlogDto.BlogUpdateRequestDto(blogDto);
      const error = new Error("errorr");
      blogService.processUpdateBlog.mockRejectedValue(error);

      // Act
      await handleUpdateBlogRequest(req, res, next);

      // Assert
      expect(BlogDto.BlogUpdateRequestDto).toHaveBeenCalledWith(title, content);
      expect(blogService.processUpdateBlog).toHaveBeenCalledWith(
        userData,
        blogUUID,
        blogDto
      );
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
