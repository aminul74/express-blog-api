class UserRegRequestDto {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

class UserLoginRequestDto {
  username;
  password;

  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

class UserUpdateRequestDto {
  constructor(old_password) {
    this.password = old_password;
  }
}

module.exports = {
  UserRegRequestDto,
  UserLoginRequestDto,
  UserUpdateRequestDto,
};
