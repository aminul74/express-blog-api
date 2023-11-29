const xml2js = require("xml2js");
const getContentBasedOnNegotiation = (blogs, negotiate) => {
  let result;

  switch (negotiate) {
    case "text":
      const textData = blogs
        .map((blogs) => `${blogs.title}\n${blogs.content}\n`)
        .join("\n");
      result = textData;
      break;
    case "json":
      result = blogs;
      break;
    case "html":
      const htmldata = blogs
        .map(
          (blogs) =>
            `<div><strong>${blogs.id}</strong>
              <strong>${blogs.title}</strong>
              <p>${blogs.content}</p></div>`
        )
        .join("");
      result = htmldata;
      break;
    case "xml":
      const xmlBuilder = new xml2js.Builder();
      const xmlData = xmlBuilder.buildObject({
        blogs: {
          blog: blogs.map((blog) => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
          })),
        },
      });

      result = xmlData;
      break;

    default:
      throw new Error("Not Acceptable");
  }

  return result;
};

module.exports = { getContentBasedOnNegotiation };
