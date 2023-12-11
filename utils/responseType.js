const getContentBasedOnNegotiation = async (data, format, next) => {
  try {
    switch (format) {
      case "json":
        return data;
      case "xml":
        let xmlData = `<?xml version="1.0" encoding="UTF-8" ?>\n<root>\n`;
        xmlData += data
          .map((data) => {
            let xml = ``;
            for (let key in data) {
              xml = xml + `         <${key}>${data[key]} </${key}> \n`;
            }
            return xml;
          })
          .join(" ");

        xmlData = xmlData + `</root>`;
        return xmlData;

      case "html":
        const htmldata = data
          .map((data) => {
            let html = "<div>";
            for (let key in data) {
              html = html + `<p>${key} : ${data[key]}</p>`;
            }
            html = html + "</div>";
            return html;
          })
          .join("");
        return htmldata;

      case "text":
        const textData = data
          .map((data) => {
            let text = "";
            for (let key in data) {
              text = text + `${key} : ${data[key]}\n`;
            }

            return text;
          })
          .join("\n");

        return textData;

      default:
        throw new Error("Not Acceptable");
    }
  } catch (error) {
    console.error("Error in getContentBasedOnNegotiation:", error);
    throw error;
  }
};

module.exports = {
  getContentBasedOnNegotiation,
};
