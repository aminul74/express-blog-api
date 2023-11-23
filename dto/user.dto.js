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

// class UserGetRequestDto {
//   password;

//   constructor(body) {
//     this.password;
//   }
// }
// class UserDeleteRequestDto {
//   password;

//   constructor(body) {
//     this.password;
//   }
// }

class UserUpdateRequestDto {
  constructor(body, user) {
    this.username = user.tokenParam;
    this.password = body.password;
  }
}

module.exports = {
  UserRegRequestDto,
  UserLoginRequestDto,
  UserUpdateRequestDto,
};
