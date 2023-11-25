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
  constructor(password) {
    this.password = password;
  }
}

module.exports = {
  UserRegRequestDto,
  UserLoginRequestDto,
  UserUpdateRequestDto,
};
