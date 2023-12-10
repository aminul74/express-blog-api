const blogRepositories = require("../repositories/blog.repository");

const processNewBlog = async (user, blogDto) => {
  const proccessBlog = await blogRepositories.createBlog(
    user.id,
    blogDto.title,
    blogDto.content
  );

  if (!proccessBlog) {
    throw new Error("Unable to process! Please try again");
  }
  return proccessBlog;
};

const processSpecificUserBlog = async (user) => {
  const processToFindAllBlog = await blogRepositories.findBlogsById(user.id);

  if (!processToFindAllBlog) {
    throw new Error("Please try again");
  }
  return processToFindAllBlog;
};

const processAllBlogs = async (page, size) => {
  let pageNo = page;
  let numOfContent = size;

  const numOfBlogs = await blogRepositories.countBlogs();
  const pageLimit = Math.ceil(numOfBlogs / numOfContent);

  if (pageNo >= pageLimit) {
    pageNo = 1;
    numOfContent = 5;
  }
  const processAllBlogs = await blogRepositories.findAllBlogs(
    pageNo,
    numOfContent
  );

  if (!processAllBlogs) {
    throw new Error("Please try again!");
  }
  return processAllBlogs;
};

const processDeleteBlog = async (user, blogUUID) => {
  console.log("USERTTT", blogUUID);
  const deletedBlog = await blogRepositories.deleteBlogById(user.id, blogUUID);
  if (!deletedBlog) {
    const error = new Error("Blog not found!");
    error.status = 404;
    throw error;
  }
  return deletedBlog;
};

const processBlogbyId = async (blogUUID) => {
  const getBlog = await blogRepositories.findBlogByUUId(blogUUID);

  if (!getBlog) {
    const error = new Error("Blog not found!");
    error.status = 404;
    throw error;
  }

  return getBlog;
};

const processUpdateBlog = async (user, blogUUID, blogDto) => {
  const { title, content } = blogDto;
  const isValidBlog = await blogRepositories.findBlogByAuthUser(
    user.id,
    blogUUID
  );
  if (!isValidBlog) {
    const error = new Error("Blog not found");
    error.status = 404;
    throw error;
  }
  const processToUpdateBlog = await blogRepositories.updateBlogById(
    blogUUID,
    title,
    content
  );

  if (!processToUpdateBlog) {
    const error = new Error("Please try again");
    error.status = 404;
    throw error;
  }

  return processToUpdateBlog;
};

module.exports = {
  processNewBlog,
  processSpecificUserBlog,
  processAllBlogs,
  processDeleteBlog,
  processBlogbyId,
  processUpdateBlog,
};
