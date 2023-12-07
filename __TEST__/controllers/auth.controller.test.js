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
      // arrange
      const req = {
        body: {
          username: "fake_user",
          email: "fake@gmail.com",
          password: "fake_pass",
        },
      };

      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      UserDtoFilter.UserRegRequestDto.mockReturnValue(req.body);

      const responseData = { id: 123 };
      authService.processUserRegistration.mockResolvedValue(responseData);

      const expectedToken = "some_generated_token";
      createToken.mockReturnValue(expectedToken);

      // Act
      await handleUserRegistration(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.cookie).toHaveBeenCalledWith("access-token", expectedToken, {
        maxAge: 2592000,
      });
      expect(res.send).toHaveBeenCalledWith("Signup Success!");
      expect(next).not.toHaveBeenCalled();
    });

    it("Test Case 2: Registration Failure!", async () => {
      // arrange
      const req = {
        body: {
          username: "fake_user",
          email: "fake@gmail.com",
          password: "fake_pass",
        },
      };

      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      UserDtoFilter.UserRegRequestDto.mockReturnValue(req.body);

      authService.processUserRegistration.mockRejectedValue(
        new Error("Email already exists")
      );

      // Act
      await handleUserRegistration(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });

  describe("handleLoginRequest", () => {
    it("Test case 1: Login sucess!", async () => {
      //Arrange

      const req = {
        body: {
          username: "fake_user",
          password: "fake_pass",
        },
      };

      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      UserDtoFilter.UserLoginRequestDto.mockReturnValue(
        "fake_user",
        "fake_pass"
      );
      authService.processUserLogin.mockResolvedValue(req.body);
      authService.getUserByUsername.mockResolvedValue(req.body);
      createToken.mockReturnValue("user.id");

      //Act
      await handleLoginRequest(req, res, next);

      //Assert
      expect(res.cookie).toHaveBeenCalledWith("access-token", "user.id", {
        maxAge: 2592000,
      });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith("Login Success!");
      expect(next).not.toHaveBeenCalledWith();
    });
    it("Test case 2: Login Failure!", async () => {
      //Arrange
      const req = {
        body: {
          username: "fake_user",
          password: "fake_pass",
        },
      };

      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      UserDtoFilter.UserLoginRequestDto.mockReturnValue(req.body);
      authService.processUserLogin.mockRejectedValue(
        new Error("Username or password is incorrect.")
      );
      authService.getUserByUsername.mockResolvedValue(req.body);
      createToken.mockReturnValue("user.id");

      //Act
      await handleLoginRequest(req, res, next);

      //Assert

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
