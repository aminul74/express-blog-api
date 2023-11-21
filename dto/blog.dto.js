class UserBlogRequestDto {
  title;
  author;
  date;
  content;

  constructor(body) {
    const { title, author, date, content } = body;

    this.title = title;
    this.author = author;
    this.date = date;
    this.content = content;
  }
}

module.exports = { UserBlogRequestDto };
