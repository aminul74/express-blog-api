const UserDtoFilter = require("../../dto/user.dto");
const authService = require("../../services/auth.service");
const { createToken } = require("../../utils/JWT");

const {
  handleUserRegistration,
  handleLoginRequest,
} = require("../../controllers/auth.controller");

jest.mock("../../dto/user.dto");
jest.mock("../../services/auth.service");
jest.mock("../../utils/JWT");

describe("Auth Controller", () => {
  describe("handleUserRegistration", () => {
    it("Test Case 1: Registration success!", async () => {
      // Arrange
      const req = {
        body: {
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
      };

      const { username, email, password } = req.body;
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      const userDto = {
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      const registeredUser = {
        id: "12345",
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      // Moc
      UserDtoFilter.UserRegRequestDto.mockReturnValue(userDto);

      authService.processUserRegistration.mockResolvedValue(registeredUser);

      createToken.mockReturnValue(registeredUser.id);

      // Act
      await handleUserRegistration(req, res, next);

      //Assert
      expect(UserDtoFilter.UserRegRequestDto).toHaveBeenCalledWith(
        username,
        email,
        password
      );

      expect(authService.processUserRegistration).toHaveBeenCalledWith(
        userDto.username,
        userDto.email,
        userDto.password
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.cookie).toHaveBeenCalledWith(
        "access-token",
        registeredUser.id,
        {
          maxAge: 2592000,
        }
      );
      expect(res.send).toHaveBeenCalledWith("Signup Success!");
      expect(next).not.toHaveBeenCalled();
    });

    it("Test Case 2: Registration Failure!", async () => {
      // Arrange
      const req = {
        body: {
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
      };

      const { username, email, password } = req.body;
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      const userDto = {
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      // Moc
      UserDtoFilter.UserRegRequestDto.mockReturnValue(userDto);

      authService.processUserRegistration.mockRejectedValue(new Error("error"));

      // Act
      await handleUserRegistration(req, res, next);

      //Assert
      expect(UserDtoFilter.UserRegRequestDto).toHaveBeenCalledWith(
        username,
        email,
        password
      );

      expect(authService.processUserRegistration).toHaveBeenCalledWith(
        userDto.username,
        userDto.email,
        userDto.password
      );

      // expect(res.status).toHaveBeenCalled(409);
      expect(res.cookie).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("handleLoginRequest", () => {
    it("Test case 1: Login sucess!", async () => {
      //Arrange
      const req = {
        body: {
          username: "aminul123",
          password: "a1234b4",
        },
      };

      const { username, password } = req.body;
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const userDto = {
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      const validUser = {
        id: "1234",
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };
      const next = jest.fn();

      UserDtoFilter.UserLoginRequestDto.mockReturnValue(userDto);
      authService.processUserLogin.mockResolvedValue(true);
      authService.getUserByUsername.mockResolvedValue(validUser);
      createToken.mockReturnValue(validUser.id);

      //Act
      await handleLoginRequest(req, res, next);

      //Assert
      expect(UserDtoFilter.UserLoginRequestDto).toHaveBeenCalledWith(
        username,
        password
      );

      expect(authService.processUserLogin).toHaveBeenCalledWith(
        userDto.username,
        userDto.password
      );

      expect(authService.getUserByUsername).toHaveBeenCalledWith(
        userDto.username
      );

      expect(res.cookie).toHaveBeenCalledWith("access-token", validUser.id, {
        maxAge: 2592000,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Login Success!");
      expect(next).not.toHaveBeenCalledWith();
    });
    it("Test case 2: Login Failure!", async () => {
      //Arrange
      const req = {
        body: {
          username: "aminul123",
          password: "a1234b4",
        },
      };

      const { username, password } = req.body;
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const userDto = {
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      const next = jest.fn();

      UserDtoFilter.UserLoginRequestDto.mockReturnValue(userDto);
      authService.processUserLogin.mockRejectedValue(new Error("error"));

      //Act
      await handleLoginRequest(req, res, next);

      //Assert
      expect(UserDtoFilter.UserLoginRequestDto).toHaveBeenCalledWith(
        username,
        password
      );

      expect(authService.processUserLogin).toHaveBeenCalledWith(
        userDto.username,
        userDto.password
      );

      expect(res.status).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
