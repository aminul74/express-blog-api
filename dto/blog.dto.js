
class UserBlogRequestDto {
  constructor(body) {
    const { title, content, author } = body;
    this.title = title;
    this.content = content;
    this.author = author;

  }
}

module.exports = { UserBlogRequestDto };
