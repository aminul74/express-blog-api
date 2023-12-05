/* eslint-disable no-undef */
const {
  handleUserRegistration,
  handleLoginRequest,
  handleProfileGetRequest,
  handleProfileDeletionRequest,
  handlePasswordUpdateRequest,
} = require("../../controllers/user.controller");

const UserDtoFilter = require("../../dto/user.dto");
const userService = require("../../services/user.service");
const { createToken } = require("../../utils/JWT");

jest.mock("../../dto/user.dto");
jest.mock("../../services/user.service");
jest.mock("../../utils/JWT");
/*
    AAA
    A - arrange
    A - act
    A - assert
*/

describe("User Controllers", () => {
  describe("Signup", () => {
    it("Test Case 1: Registrationn success!", async () => {
      // arrange
      const req = {
        body: {
          username: "fake_user",
          email: "fake@gamil.com",
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

      userService.processUserRegistration.mockResolvedValue(req.body);
      createToken.mockReturnValue("responseData.id");
      // Act
      await handleUserRegistration(req, res, next);

      // Assert

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.cookie).toHaveBeenCalledWith(
        "access-token",
        "responseData.id",
        {
          maxAge: 2592000,
        }
      );
      expect(res.send).toHaveBeenCalledWith("Signup Success!");
      expect(next).not.toHaveBeenCalledWith();
    });

    it("Test Case 2: Registrationn Failure!", async () => {
      // arrange
      const req = {
        body: {
          username: "fake_user",
          email: "fake@gamil.com",
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

      userService.processUserRegistration.mockRejectedValue(
        new Error("Email already exist")
      );

      // Act
      await handleUserRegistration(req, res, next);

      // Assert

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("Login", () => {
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

      UserDtoFilter.UserLoginRequestDto.mockReturnValue(req.body);
      userService.processUserLogin.mockResolvedValue(req.body);
      userService.getUserByUsername.mockResolvedValue(req.body);
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
      userService.processUserLogin.mockRejectedValue(
        new Error("Username or password is incorrect.")
      );
      userService.getUserByUsername.mockResolvedValue(req.body);
      createToken.mockReturnValue("user.id");

      //Act
      await handleLoginRequest(req, res, next);

      //Assert

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("ProfileGetRequest", () => {
    it("Test case 1: Profile Get Success!", async () => {
      // Arrange
      const req = {
        cookies: {
          "access-token": "fake-token",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();
      const fakeUserData = {
        id: "userFakeId",
        username: "fake_user",
        email: "fake@gamil.com",
        password: "fake_pass",
      };

      const fakeUserDataObj = {
        ...fakeUserData,
        toJSON: () => {
          return fakeUserData;
        },
      };

      userService.userFromAuthToken.mockResolvedValue(fakeUserDataObj);

      //Act
      await handleProfileGetRequest(req, res, next);

      //Assert
      expect(userService.userFromAuthToken).toHaveBeenCalledWith(
        req.cookies["access-token"]
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        ...fakeUserData,
        password: undefined,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("ProfileDeletionRequest", () => {
    it("Test case 1: Profile Delete success!", async () => {
      // Arrange
      const req = {
        cookies: {
          "access-token": "fake-token",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();
      const fakeUserData = {
        id: "userFakeId",
      };

      // Mock
      userService.userFromAuthToken.mockResolvedValue(fakeUserData);
      userService.processUserDeleteById.mockResolvedValue(fakeUserData);

      // Act
      await handleProfileDeletionRequest(req, res, next);

      // Assert
      expect(userService.userFromAuthToken).toHaveBeenCalledWith(
        req.cookies["access-token"]
      );

      expect(userService.processUserDeleteById).toHaveBeenCalledWith(
        fakeUserData
      );

      expect(res.status).toHaveBeenLastCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Delete Success!");

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("ProfileDeletionRequest", () => {
    it("Test case 1: Profile Delete success!", async () => {
      // Arrange
      const req = {
        cookies: {
          "access-token": "fake-token",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();
      const fakeUserData = {
        id: "userFakeId",
      };

      // Mock
      userService.userFromAuthToken.mockResolvedValue(fakeUserData);
      userService.processUserDeleteById.mockResolvedValue(fakeUserData);

      // Act
      await handleProfileDeletionRequest(req, res, next);

      // Assert
      expect(userService.userFromAuthToken).toHaveBeenCalledWith(
        req.cookies["access-token"]
      );

      expect(userService.processUserDeleteById).toHaveBeenCalledWith(
        fakeUserData
      );

      expect(res.status).toHaveBeenLastCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Delete Success!");

      expect(next).not.toHaveBeenCalled();
    });
    it("Test case 2: Profile Deletion Failure", async () => {
      // Arrange
      const req = {
        cookies: {
          "access-token": "fake-token",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const fakeUserData = {
        id: "userFakeId",
      };

      const next = jest.fn();

      // Mock
      userService.userFromAuthToken.mockResolvedValue(fakeUserData);

      // Act
      await handleProfileDeletionRequest(req, res, next);

      // Assert
      expect(userService.userFromAuthToken).toHaveBeenCalledWith(
        req.cookies["access-token"]
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Delete Success!");

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("PasswordUpdateRequest", () => {
    it("Test case 1: Password Update Success!", async () => {
      // Arrange
      const req = {
        body: {
          old_password: "fakeOld",
          new_password: "fakenew",
        },
        cookies: {
          "access-token": "fake-token",
        },
      };

      const res = {
        status: jest.fn(),
        send: jest.fn(),
        cookie: jest.fn(),
      };
      const fakeUserData = {
        id: "userFakeId",
        username: "fakeUsername",
        email: "fakeEmail",
        password: "fakeOld",
      };
      const next = jest.fn();

      // Mock 
      userService.userFromAuthToken.mockResolvedValue({

      });
      userService.processUserUpdate.mockResolvedValue(true);

      // Act
      await handlePasswordUpdateRequest(req, res, next);

      // Assert
      expect(userService.userFromAuthToken).toHaveBeenCalledWith(
        req.cookies["access-token"]
      );
      expect(userService.processUserUpdate).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        req.body.new_password
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Password update success!");
      expect(res.cookie).toHaveBeenCalledWith("access-token", " ", {
        maxAge: -1,
      });

      expect(next).not.toHaveBeenCalled();
    });
  });
});
