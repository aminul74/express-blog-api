const blogRepositories = require("../repositories/blog.repository");
const userServices = require("../services/user.service");

const processNewBlog = async (user, blogDto) => {
  try {
    const proccessBlog = await blogRepositories.createBlog(
      user.id,
      blogDto.title,
      blogDto.content
    );

    if (!proccessBlog) {
      throw new Error("Unable to process! Please try again");
    }
    return proccessBlog;
  } catch (error) {
    throw error;
  }
};

const processSpecificUserBlog = async (user) => {
  try {
    const processToFindAllBlog = await blogRepositories.findBlogsById(user.id);

    if (!processToFindAllBlog) {
      throw new Error("Please try again");
    }
    return processToFindAllBlog;
  } catch (error) {
    throw error;
  }
};

const processAllBlogs = async (res) => {
  try {
    const processAllBlogs = await blogRepositories.findAllBlogs();

    if (!processAllBlogs) {
      throw new Error("Please try again!");
    }
    return processAllBlogs;
  } catch (error) {
    throw error;
  }
};

const processDeleteBlog = async (user, blogUUID) => {
  try {
    const processToDelete = await blogRepositories.deleteBlogById(
      user.id,
      blogUUID
    );
    if (!processToDelete) {
      const error = new Error("Blog not found!");
      error.status = 404;
      throw error;
    }
    return processToDelete;
  } catch (error) {
    throw error;
  }
};

const processBlogbyId = async (user, blogUUID) => {
  try {
    const processBlog = await blogRepositories.findBlogByUserId(
      user.id,
      blogUUID
    );

    if (!processBlog) {
      const error = new Error("Blog not found!");
      error.status = 404;
      throw error;
    }

    return processBlog;
  } catch (error) {}
};

const processUpdateBlog = async (user, blogUUID, blogDto) => {
  try {
    const { title, content } = blogDto;
    const isValidBlog = await blogRepositories.findAuthorBlogById(user.id, blogUUID);
    if (!isValidBlog) {
      const error = new Error("Blog not found");
      error.status = 404;
      throw error;
    }
    const processToUpdateBlog = await blogRepositories.updateBlogById(
      blogUUID,
      title,
      content,
    );
  
    if (!processToUpdateBlog) {
      const error = new Error("Please try again");
      error.status = 404;
      throw error;
    }
  
    return processToUpdateBlog;
  } catch (error) {
   throw error 
  }
};

module.exports = {
  processNewBlog,
  processSpecificUserBlog,
  processAllBlogs,
  processDeleteBlog,
  processBlogbyId,
  processUpdateBlog,
};
