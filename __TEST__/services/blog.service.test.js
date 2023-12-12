// const blogRepositories = require("../../repositories/blog.repository");
// const {
//   processNewBlog,
//   processSpecificUserBlog,
//   processAllBlogs,
//   processDeleteBlog,
//   processBlogbyId,
//   processUpdateBlog,
// } = require("../../services/blog.service");

// jest.mock("../../repositories/blog.repository");

// describe("Blog Services", () => {
//   describe("processNewBlog", () => {
//     it("Test Case 1: Blog Create Success!", async () => {
//       const user = {
//         id: "1234",
//       };
//       const blogDto = {
//         title: "fake_titles",
//         content: "fake_contents",
//       };
//       const blogMock = {
//         id: "1",
//         // ...blogDto,
//         title: blogDto.title,
//         content: blogDto.content,
//         authorId: user.id,
//       };

//       // Mock
//       blogRepositories.createBlog.mockResolvedValue(blogMock);

//       // Act
//       const result = await processNewBlog(user, blogDto);

//       // Assert
//       expect(result).toEqual(blogMock);
//     });

//     it("Test Case 2: Blog Create Failure!", async () => {
//       const user = {
//         id: "1234",
//       };
//       const blogDto = {
//         title: "fake_titles",
//         content: "fake_contents",
//       };

//       // Mock
//       blogRepositories.createBlog.mockRejectedValue(
//         new Error("Unable to process! Please try again")
//       );

//       // Act and Assert
//       await expect(processNewBlog(user, blogDto)).rejects.toThrow(
//         "Unable to process! Please try again"
//       );
//       expect(blogRepositories.createBlog).toHaveBeenCalledWith(
//         user.id,
//         blogDto.title,
//         blogDto.content
//       );
//     });
//   });

//   describe("processSpecificUserBlog", () => {
//     it("Test Case 1: User Self Blog Get Success!", async () => {
//       //Arrange
//       const user = {
//         id: "1234",
//       };
//       const Blog = {
//         id: "1",
//         title: "Test 1",
//         content: "Hello world 1!",
//         authorId: user.id,
//       };

//       //Moc
//       blogRepositories.findBlogsById.mockResolvedValue(Blog);

//       //Act
//       const result = await processSpecificUserBlog(user);

//       //Assert

//       expect(result).toEqual(Blog);
//       expect(blogRepositories.findBlogsById).toHaveBeenCalledWith(user.id);
//     });

//     it("Test Case 2: User Self Blog Get Failure!", async () => {
//       //Arrange
//       const user = {
//         id: "1234",
//       };
//       const Blog = {
//         id: "1",
//         title: "Test 1",
//         content: "Hello world 1!",
//         authorId: user.id,
//       };

//       // Mock
//       blogRepositories.findBlogsById.mockRejectedValue(
//         new Error("Please try again")
//       );

//       // Act and Assert
//       await expect(processSpecificUserBlog(user)).rejects.toThrow(
//         "Please try again"
//       );
//       expect(blogRepositories.findBlogsById).toHaveBeenCalledWith(user.id);
//     });
//   });

//   describe("processAllBlogs", () => {
//     it("Test Case 1: Get All Blogs Success!", async () => {
//       // Arrange
//       const page = 1;
//       const size = 5;

//       const numOfBlogs = 5;
//       const user = {
//         id: "1234",
//       };
//       const blogDto = {
//         title: "fake_titles",
//         content: "fake_contents",
//       };
//       const blogData = {
//         id: "1",
//         // ...blogDto,
//         title: blogDto.title,
//         content: blogDto.content,
//         authorId: user.id,
//       };
//       const blogsMock = [blogData];

//       // Mock
//       blogRepositories.countBlogs.mockResolvedValue(numOfBlogs);
//       blogRepositories.findAllBlogs.mockResolvedValue(blogsMock);

//       // Act
//       const result = await processAllBlogs(page, size);

//       // Assert
//       expect(blogRepositories.countBlogs).toHaveBeenCalled();
//       expect(blogRepositories.findAllBlogs).toHaveBeenCalledWith(page, size);
//       expect(result).toEqual(blogsMock);
//     });

//     it("Test Case 2: Get All Blogs Failure!", async () => {
//       // Arrange
//       const page = 1;
//       const size = 5;

//       // Mock
//       blogRepositories.countBlogs.mockRejectedValue(
//         new Error("Please try again!")
//       );

//       // Act and Assert
//       await expect(processAllBlogs(page, size)).rejects.toThrow(
//         "Please try again!"
//       );
//       expect(blogRepositories.countBlogs).toHaveBeenCalled();
//       expect(blogRepositories.findAllBlogs).not.toHaveBeenCalled();
//     });
//   });

//   describe("processDeleteBlogById", () => {
//     it("Test Case 1: Blog Delete Success!", async () => {
//       // Arrange
//       const user = { id: "1234" };
//       const blogUUID = "blog-uuid";

//       // Mock
//       blogRepositories.deleteBlogById.mockResolvedValue(true);

//       // Act
//       const result = await processDeleteBlog(user, blogUUID);

//       // Assert
//       expect(blogRepositories.deleteBlogById).toHaveBeenCalledWith(
//         user.id,
//         blogUUID
//       );
//       expect(result).toBe(true);
//     });

//     it("Test Case 2: Blog Delete Failure!", async () => {
//       // Arrange
//       const user = { id: "1234" };
//       const blogUUID = "blog-uuid";

//       // Mock
//       blogRepositories.deleteBlogById.mockRejectedValue(
//         new Error("Blog not found!")
//       );

//       // Act and Assert
//       await expect(processDeleteBlog(user, blogUUID)).rejects.toThrow(Error);
//       expect(blogRepositories.deleteBlogById).toHaveBeenCalledWith(
//         user.id,
//         blogUUID
//       );
//     });
//   });

//   describe("processBlogbyId", () => {
//     it("Test Case 1: Blog By UUID Success", async () => {
//       // Arrange
//       const blogUUID = "blog-uuid";
//       const user = {
//         id: "1234",
//       };
//       const blogDto = {
//         title: "fake_titles",
//         content: "fake_contents",
//       };
//       const blogMock = {
//         id: "1",
//         // ...blogDto,
//         title: blogDto.title,
//         content: blogDto.content,
//         authorId: user.id,
//       };
//       // Mock
//       blogRepositories.findBlogByUUId.mockResolvedValue(blogMock);

//       // Act
//       const result = await processBlogbyId(blogUUID);

//       // Assert
//       expect(blogRepositories.findBlogByUUId).toHaveBeenCalledWith(blogUUID);
//       expect(result).toEqual(blogMock);
//     });

//     it("Test Case 2: Blog By UUID Failure", async () => {
//       // Arrange
//       const blogUUID = "non-existing-blog-uuid";

//       // Mock
//       blogRepositories.findBlogByUUId.mockRejectedValue(
//         new Error("Blog not found!")
//       );

//       // Act and Assert
//       await expect(processBlogbyId(blogUUID)).rejects.toThrow(Error);
//       expect(blogRepositories.findBlogByUUId).toHaveBeenCalledWith(blogUUID);
//     });
//   });

//   describe("processUpdateBlog", () => {
//     it("Test Case 1: Blog Update Success!", async () => {
//       // Arrange
//       const user = {
//         id: "1234",
//       };
//       const blogDto = {
//         title: "fake_titles",
//         content: "fake_contents",
//       };

//       const blogUUID = "blog-uuid";
//       const isValidBlogMock = true;

//       // Mock
//       blogRepositories.findBlogByAuthUser.mockResolvedValue(isValidBlogMock);
//       blogRepositories.updateBlogById.mockResolvedValue(true);

//       // Act
//       const result = await processUpdateBlog(user, blogUUID, blogDto);

//       // Assert
//       expect(blogRepositories.findBlogByAuthUser).toHaveBeenCalledWith(
//         user.id,
//         blogUUID
//       );
//       expect(blogRepositories.updateBlogById).toHaveBeenCalledWith(
//         blogUUID,
//         blogDto.title,
//         blogDto.content
//       );
//       expect(result).toBe(true);
//     });

//     it("Test Case 2: Blog Not Found!", async () => {
//       // Arrange
//       const user = {
//         id: "1234",
//       };
//       const blogDto = {
//         title: "fake_titles",
//         content: "fake_contents",
//       };

//       const blogUUID = "blog-uuid";

//       // Mock
//       blogRepositories.findBlogByAuthUser.mockRejectedValue(
//         new Error("Blog not found")
//       );

//       // Act and Assert
//       await expect(processUpdateBlog(user, blogUUID, blogDto)).rejects.toThrow(
//         Error
//       );
//       expect(blogRepositories.findBlogByAuthUser).toHaveBeenCalledWith(
//         user.id,
//         blogUUID
//       );
//       expect(blogRepositories.updateBlogById).not.toHaveBeenCalled();
//     });

//     it("Test Case 3: Blog Update Failure!", async () => {
//       // Arrange
//       const user = {
//         id: "1234",
//       };
//       const blogDto = {
//         title: "fake_titles",
//         content: "fake_contents",
//       };

//       const blogUUID = "blog-uuid";
//       const isValidBlogMock = true;

//       // Mock
//       blogRepositories.findBlogByAuthUser.mockResolvedValue(isValidBlogMock);
//       blogRepositories.updateBlogById.mockRejectedValue(
//         new Error("Please try again")
//       );

//       // Act and Assert
//       await expect(processUpdateBlog(user, blogUUID, blogDto)).rejects.toThrow(
//         Error
//       );
//       expect(blogRepositories.findBlogByAuthUser).toHaveBeenCalledWith(
//         user.id,
//         blogUUID
//       );
//       expect(blogRepositories.updateBlogById).toHaveBeenCalledWith(
//         blogUUID,
//         blogDto.title,
//         blogDto.content
//       );
//     });
//   });
// });
