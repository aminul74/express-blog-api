class UserBlogRequestDto {
  title;
  content;
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }
}

module.exports = { UserBlogRequestDto };
