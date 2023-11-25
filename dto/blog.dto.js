class UserBlogRequestDto {
  constructor(body, user) {
    const { title, content } = body;
    const username = user.username;
    console.log("Debug - title:", title);
    console.log("Debug - content:", content);
    console.log("Debug - username:", username);
    this.title = title;
    this.content = content;
    this.username = username;
  }
}

module.exports = { UserBlogRequestDto };
