class UserRegRequestDto {
  username;
  email;
  password;

  constructor(body) {
    const { username, email, password } = body;

    this.username = username;
    this.email = email;
    this.password = password;
  }
}

class UserLoginRequestDto {
  username;
  password;

  constructor(body) {
    const { username, password } = body;

    this.username = username;
    this.password = password;
  }
}

module.exports = { UserRegRequestDto, UserLoginRequestDto };
