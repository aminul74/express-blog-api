const blogService = require("../../services/blog.service");
const BlogDto = require("../../dto/blog.dto");
const userService = require("../../services/user.service");
const { blogsDB } = require("../testDB");
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

  //   describe("handleGetAllBlogsRequest", () => {
  //     it("Test case 1: All Blog Get Success!", async () => {
  //       //Arrange
  //       const req = {
  //         query: { page: "0", size: "5" },
  //         accepts: jest.fn().mockReturnValue(["json", "text", "xml", "html"]),
  //       };

  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         send: jest.fn(),
  //         type: jest.fn(),
  //       };

  //       const blogList = {
  //         id: "1",
  //         title: "Test 1",
  //         content: "Hello world 1!",
  //         authorId: "1",
  //       };
  //       const next = jest.fn();

  //       //Moc
  //       blogService.processAllBlogs.mockResolvedValue(blogList);
  //       getContentBasedOnNegotiation.mockReturnValue(blogList);

  //       //Act

  //       await handleGetAllBlogsRequest(req, res, next);

  //       //Assert

  //       expect(blogService.processAllBlogs).toHaveBeenCalledWith(0, 5);
  //       expect(req.accepts).toHaveBeenCalledWith(["json", "text", "xml", "html"]);
  //       expect(res.type).toHaveBeenCalledWith(["json", "text", "xml", "html"]);
  //       expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(blogList, [
  //         "json",
  //         "text",
  //         "xml",
  //         "html",
  //       ]);
  //       expect(res.status).toHaveBeenCalledWith(200);
  //       expect(res.send).toHaveBeenCalledWith(blogList);
  //       expect(next).not.toHaveBeenCalled();
  //     });

  //     it("Test case 2: All Blog Get Failure!", async () => {
  //       //Arrange
  //       const req = {
  //         query: { page: "0", size: "5" },
  //         accepts: jest.fn().mockReturnValue(["json", "text", "xml", "html"]),
  //       };

  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         send: jest.fn(),
  //         type: jest.fn(),
  //       };
  //       const next = jest.fn();

  //       //Moc
  //       blogService.processAllBlogs.mockRejectedValue();

  //       //Act

  //       await handleGetAllBlogsRequest(req, res, next);

  //       //Assert

  //       expect(blogService.processAllBlogs).not.toHaveBeenCalledWith();
  //       expect(req.accepts).not.toHaveBeenCalledWith();
  //       expect(res.type).not.toHaveBeenCalledWith();
  //       expect(getContentBasedOnNegotiation).not.toHaveBeenCalledWith();
  //       expect(res.status).not.toHaveBeenCalledWith();
  //       expect(res.send).not.toHaveBeenCalledWith();
  //       expect(next).toHaveBeenCalledTimes(1);
  //     });
  //   });

  //   describe("handleBlogDeletionRequest", () => {
  //     it("Test Case 1: Blog Delete Success!", async () => {
  //       //Arrange
  //       const req = {
  //         params: { uuid: "blog-uuid" },
  //         cookies: { "access-token": "fake-token" },
  //       };

  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         send: jest.fn(),
  //       };

  //       const user = {
  //         id: "12345",
  //         username: "aminul123",
  //         email: "aminul@gmail.com",
  //         password: "a1234b4",
  //         createdAt: "12-12-12",
  //         updatedAt: "12-12-12",
  //       };

  //       //Moc
  //       userService.userFromAuthToken.mockResolvedValue(user);

  //       blogService.processDeleteBlog.mockResolvedValue(true);

  //       // Act
  //       await handleBlogDeletionRequest(req, res);

  //       // Assert
  //       expect(userService.userFromAuthToken).toHaveBeenCalledWith("fake-token");
  //       expect(blogService.processDeleteBlog).toHaveBeenCalledWith(
  //         user,
  //         "blog-uuid"
  //       );
  //       expect(res.status).toHaveBeenCalledWith(200);
  //       expect(res.send).toHaveBeenCalledWith("Delete success!");
  //     });

  //     it("Test case 2: Unable to delete blog", async () => {
  //       // Arrange
  //       const req = {
  //         params: { uuid: "blog-uuid" },
  //         cookies: { "access-token": "fake-token" },
  //       };

  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         send: jest.fn(),
  //       };

  //       // Mock
  //       userService.userFromAuthToken = jest.fn().mockResolvedValue(null);

  //       blogService.processDeleteBlog = jest.fn().mockResolvedValue(false);

  //       const next = jest.fn();

  //       // Act
  //       await handleBlogDeletionRequest(req, res, next);

  //       // Assert
  //       expect(userService.userFromAuthToken).toHaveBeenCalledWith("fake-token");
  //       expect(blogService.processDeleteBlog).toHaveBeenCalledWith(
  //         null,
  //         "blog-uuid"
  //       );
  //       expect(next).toHaveBeenCalledTimes(1);
  //     });
  //   });

  //   describe("handleBlogByIdRequest", () => {
  //     it("Test case 1: Get Blog by Id Success", async () => {
  //       // Arrange
  //       const req = {
  //         params: { uuid: "blog-uuid" },
  //         accepts: jest.fn().mockReturnValue(["json", "text", "xml", "html"]),
  //       };

  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         send: jest.fn(),
  //         type: jest.fn(),
  //       };

  //       const blogList = {
  //         id: "1",
  //         title: "Test 1",
  //         content: "Hello world 1!",
  //         authorId: "1",
  //         createdAt: "12-12-12",
  //         updatedAt: "12-12-12",
  //       };

  //       // Mock
  //       blogService.processBlogbyId = jest.fn().mockResolvedValue(blogList);
  //       getContentBasedOnNegotiation.mockReturnValue([blogList]);

  //       // Act
  //       await handleBlogByIdRequest(req, res);

  //       // Assert
  //       expect(blogService.processBlogbyId).toHaveBeenCalledWith("blog-uuid");
  //       expect(req.accepts).toHaveBeenCalledWith(["json", "text", "xml", "html"]);
  //       expect(res.type).toHaveBeenCalledWith(["json", "text", "xml", "html"]);
  //       expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(
  //         [blogList],
  //         ["json", "text", "xml", "html"]
  //       );
  //       expect(res.status).toHaveBeenCalledWith(200);
  //       expect(res.send).toHaveBeenCalledWith([blogList]);
  //     });

  //     it("Test case 2: Unable to get Blog by Id", async () => {
  //       // Arrange
  //       const req = {
  //         params: { uuid: "blog-uuid" },
  //         accepts: jest.fn().mockReturnValue(["json", "text", "xml", "html"]),
  //       };

  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         send: jest.fn(),
  //         type: jest.fn(),
  //       };

  //       const next = jest.fn();

  //       // Mock
  //       blogService.processBlogbyId.mockResolvedValue(null);

  //       // Act
  //       await handleBlogByIdRequest(req, res, next);

  //       // Assert
  //       expect(blogService.processBlogbyId).toHaveBeenCalledWith("blog-uuid");
  //       expect(req.accepts).not.toHaveBeenCalledWith([
  //         "json",
  //         "text",
  //         "xml",
  //         "html",
  //       ]);
  //       expect(res.status).not.toHaveBeenCalledWith(404);
  //       expect(res.send).not.toHaveBeenCalledWith(
  //         "Unable to process! Please try again"
  //       );
  //       expect(next).toHaveBeenCalledTimes(1);
  //     });

  //     it("Test case 3: Not Acceptable", async () => {
  //       // Arrange
  //       const req = {
  //         params: { uuid: "blog-uuid" },
  //         accepts: jest.fn().mockReturnValue(null),
  //       };

  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         send: jest.fn(),
  //       };

  //       const next = jest.fn();

  //       // Act
  //       await handleBlogByIdRequest(req, res, next);

  //       // Assert
  //       expect(next).toHaveBeenCalledTimes(1);
  //     });
  //   });

  //   describe("handleUpdateBlogRequest", () => {
  //     it("Test case 1: Update Blog Success!", async () => {
  //       // Arrange
  //       const req = {
  //         params: { uuid: "blog-uuid" },
  //         body: { title: "fake_title", content: "fake_content" },
  //         cookies: { "access-token": "fake-token" },
  //       };

  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         send: jest.fn(),
  //       };

  //       const user = {
  //         id: "12345",
  //         username: "aminul123",
  //         email: "aminul@gmail.com",
  //         password: "a1234b4",
  //       };

  //       const next = jest.fn();

  //       // Mock
  //       userService.userFromAuthToken.mockResolvedValue(user);
  //       const blogDto = new BlogDto.BlogUpdateRequestDto(
  //         "fake_title",
  //         "fake-token"
  //       );
  //       blogService.processUpdateBlog.mockResolvedValue(true);

  //       // Act
  //       await handleUpdateBlogRequest(req, res, next);

  //       // Assert
  //       expect(userService.userFromAuthToken).toHaveBeenCalledWith("fake-token");
  //       expect(blogService.processUpdateBlog).toHaveBeenCalledWith(
  //         user,
  //         "blog-uuid",
  //         blogDto
  //       );
  //       expect(res.status).toHaveBeenCalledWith(200);
  //       expect(res.send).toHaveBeenCalledWith("Update success!");
  //       expect(next).not.toHaveBeenCalledWith();
  //     });

  //     it("Test case 2: Unable to update Blog", async () => {
  //       // Arrange
  //       const req = {
  //         params: { uuid: "blog-uuid" },
  //         body: { title: "fake_title", content: "fake_content" },
  //         cookies: { "access-token": "fake-token" },
  //       };

  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         send: jest.fn(),
  //       };

  //       const next = jest.fn();

  //       // Mock
  //       userService.userFromAuthToken.mockResolvedValue(null);
  //       const blogDto = new BlogDto.BlogUpdateRequestDto(
  //         "fake_title",
  //         "fake_content"
  //       );
  //       blogService.processUpdateBlog.mockResolvedValue(false);

  //       // Act
  //       await handleUpdateBlogRequest(req, res, next);

  //       // Assert
  //       expect(userService.userFromAuthToken).toHaveBeenCalledWith("fake-token");
  //       expect(blogService.processUpdateBlog).toHaveBeenCalledWith(
  //         null,
  //         "blog-uuid",
  //         blogDto
  //       );
  //       expect(next).toHaveBeenCalledWith(
  //         new Error("Unable to update! please try again")
  //       );
  //     });
  //   });
});
