/* eslint-disable no-undef */
const UserDtoFilter = require("../../dto/user.dto");
const userService = require("../../services/user.service");
const { createToken } = require("../../utils/JWT");

const {
  handleUserRegistration,
  handleLoginRequest,
  handleProfileGetRequest,
  handleProfileDeletionRequest,
  handlePasswordUpdateRequest,
} = require("../../controllers/user.controller");

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
      userService.processUserDeleteById.mockRejectedValue(
        new Error("Deletion failure")
      );

      // Act
      await handleProfileDeletionRequest(req, res, next);

      // Assert
      expect(userService.userFromAuthToken).toHaveBeenCalledWith(
        req.cookies["access-token"]
      );
      expect(res.status).not.toHaveBeenCalledWith(200);
      expect(res.send).not.toHaveBeenCalledWith("Deletion Failure!");
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("PasswordUpdateRequest", () => {
    it("Test case 1: Password Update success!", async () => {
      // Arrange

      const req = {
        body: {
          old_password: "oldPass",
          new_password: "newPass",
        },
        cookies: {
          "access-token": "fake-token",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        cookie: jest.fn(),
      };
      const fakeUser = {
        id: "44678312-7204-4fa6-be5d-1b7de9949aeb",
        password:
          "$2b$10$Z1s4VoX/NQZ3c8gLcEaaZOeXh0w7C9sRcOBypl1vcukznvc9ScWuu",
      };
      const next = jest.fn();
      //Moc
      userService.userFromAuthToken.mockResolvedValue(fakeUser);
      UserDtoFilter.UserUpdateRequestDto.mockReturnValue({
        password: "oldPass",
      });

      userService.processUserUpdate.mockResolvedValue(
        fakeUser,
        req.body.old_password,
        req.body.new_password
      );

      //Act
      await handlePasswordUpdateRequest(req, res, next);

      //Assert

      expect(userService.userFromAuthToken).toHaveBeenCalledWith(
        req.cookies["access-token"]
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Password update success!");
      expect(res.cookie).toHaveBeenCalledWith("access-token", " ", {
        maxAge: -1,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("Test case 2: Password Update Failure!", async () => {
      // Arrange

      const req = {
        body: {
          old_password: "oldPass",
          new_password: "newPass",
        },
        cookies: {
          "access-token": "fake-token",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        cookie: jest.fn(),
      };
      const fakeUser = {
        id: "44678312-7204-4fa6-be5d-1b7de9949aeb",
        password:
          "$2b$10$Z1s4VoX/NQZ3c8gLcEaaZOeXh0w7C9sRcOBypl1vcukznvc9ScWuu",
      };
      const next = jest.fn();
      //Moc
      userService.userFromAuthToken.mockResolvedValue(fakeUser);
      UserDtoFilter.UserUpdateRequestDto.mockReturnValue({
        password: "oldPass",
      });

      userService.processUserUpdate.mockResolvedValue(null);

      //Act
      await handlePasswordUpdateRequest(req, res, next);

      //Assert

      expect(userService.userFromAuthToken).toHaveBeenCalledWith(
        req.cookies["access-token"]
      );
      expect(next).toHaveBeenCalledWith(
        Error("Unable to update password please try again!")
      );
    });
  });
});
