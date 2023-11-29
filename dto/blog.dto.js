class BlogCreateRequestDto {
  title;
  content;
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }
}

class BlogUpdateRequestDto {
  title;
  content;
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }
}

module.exports = {BlogCreateRequestDto, BlogUpdateRequestDto };
