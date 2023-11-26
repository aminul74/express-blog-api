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
    console.log("QQQQQQQQ",user.username)
    const processToFindAllBlog = await blogRepositories.findBlogById(user.id);
    if (!processToFindAllBlog) {
      throw new Error("Please try again");
    }
    return processToFindAllBlog;
  } catch (error) {
    throw error;
  }
};


const processAllBlogs = async(res)=>{
  try {
    const processAllBlogs = await blogRepositories.findAllBlogs();
    if (!processAllBlogs) {
      throw new Error("Something went wrong!")
    }
    return processAllBlogs;
  } catch (error) {
    throw error
  }
}

module.exports = { processNewBlog, processSpecificUserBlog, processAllBlogs };
