const xml2js = require("xml2js");
const getContentBasedOnNegotiation = (blogs, negotiate) => {
  let result;

  switch (negotiate) {
    case "text":
      result = blogs
        .map(
          (blog) => `
        id: ${blog.id}
        title: ${blog.title}
        content: ${blog.content}`
        )
        .join("\n");
      break;
    case "json":
      result = blogs;
      break;
    case "html":
      result = blogs
        .map(
          (blog) =>
            `<div><strong>${blog.id}</strong>
              <strong>${blog.title}</strong>
              <p>${blog.content}</p></div>`
        )
        .join("");
      break;
    case "xml": {
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
    }

    default:
      throw new Error("Not Acceptable");
  }

  return result;
};

module.exports = { getContentBasedOnNegotiation };
