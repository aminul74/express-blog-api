/* eslint-disable no-undef */
const UserDtoFilter = require("../../dto/user.dto");
const userService = require("../../services/user.service");
const { usersDB, blogsDB } = require("../testDB");
const { getContentBasedOnNegotiation } = require("../../utils/responseType");
const {
  handleProfileGetRequest,
  handleProfileDeletionRequest,
  handlePasswordUpdateRequest,
} = require("../../controllers/user.controller");

jest.mock("../../dto/user.dto");
jest.mock("../../services/user.service");
jest.mock("../../utils//responseType.js");

/*
    AAA
    A - arrange
    A - act
    A - assert
*/

describe("User Controllers", () => {
  describe("handleProfileGetRequest", () => {
    it("Test Case 1: Profile Get Request Success!", async () => {
      // Arrange

      const expectedUser = usersDB[0];
      const req = {
        user: {
          expectedUser,
          toJSON: jest.fn().mockReturnThis(expectedUser),
        },
        accepts: jest.fn().mockReturnValue(["json", "text", "xml", "html"]),
      };
      const negotiate = req.accepts(["json", "text", "xml", "html"]);
      const res = {
        type: jest.fn().mockReturnThis(negotiate),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      const userProfile = [req.user];

      //Moc
      getContentBasedOnNegotiation.mockResolvedValue(expectedUser);
      //Act
      await handleProfileGetRequest(req, res, next);

      //Assert
      expect(req.user.toJSON).toHaveBeenCalled();
      expect(req.accepts).toHaveBeenCalledWith(["json", "text", "xml", "html"]);
      expect(res.type).toHaveBeenCalledWith(negotiate);
      expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(
        userProfile,
        negotiate
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expectedUser);
    });

    it("Test Case 2: Profile Get Request Failure!", async () => {
      // Arrange
      const req = {
        user: { toJSON: jest.fn() },
        accepts: jest.fn().mockReturnValue(null),
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();
      // Act
      await handleProfileGetRequest(req, res, next);

      // Assert
      expect(req.user.toJSON).toHaveBeenCalled();
      expect(req.accepts).toHaveBeenCalledWith(["json", "text", "xml", "html"]);
      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.send).toHaveBeenCalledWith("Not Acceptable");
    });
  });

  describe("ProfileDeletionRequest", () => {
    it("Test case 1: Profile Delete success!", async () => {
      // Arrange
      const req = {
        user: {
          id: "12345",
        },
      };

      const userData = req.user;
      const expectedUser = usersDB[0];

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      userService.processUserDeleteById.mockResolvedValue(expectedUser);

      // Act
      await handleProfileDeletionRequest(req, res, next);

      // Assert
      expect(userService.processUserDeleteById).toHaveBeenCalledWith(userData);

      expect(res.status).toHaveBeenLastCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Delete Success!");

      expect(next).not.toHaveBeenCalled();
    });

    it("Test case 2: Profile Deletion Failure", async () => {
      //Arrange
      const req = {
        user: {
          id: "12345",
        },
      };

      const userData = req.user;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();
      const error = new Error("Please try again");
      //Moc
      userService.processUserDeleteById.mockRejectedValue(error);

      // Act
      await handleProfileDeletionRequest(req, res, next);

      // Assert
      expect(userService.processUserDeleteById).toHaveBeenCalledWith(userData);

      expect(res.status).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("PasswordUpdateRequest", () => {
    it("Test case 1: Password Update success!", async () => {
      // Arrange
      const user = usersDB[0];
      const req = {
        body: {
          old_password: "12354",
          new_password: "12345",
        },
        user,
      };
      const userDto = { old_password: "12354" };
      const userData = req.user;

      const { old_password, new_password } = req.body;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        cookie: jest.fn(),
      };

      const next = jest.fn();
      //Moc
      UserDtoFilter.UserUpdateRequestDto.mockReturnValue(userDto);
      userService.processUserUpdate.mockResolvedValue(true);

      //Act
      await handlePasswordUpdateRequest(req, res, next);

      //Assert
      expect(UserDtoFilter.UserUpdateRequestDto).toHaveBeenCalledWith(
        old_password
      );
      expect(userService.processUserUpdate).toHaveBeenCalledWith(
        userData,
        userDto,
        new_password
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Password update success!");
      expect(next).not.toHaveBeenCalled();
    });

    it("Test case 2: Password Update Failure!", async () => {
      // Arrange
      const user = usersDB[0];
      const req = {
        body: {
          old_password: "12354",
          new_password: "12345",
        },
        user,
      };
      const userDto = { old_password: "12354" };
      const userData = req.user;

      const { old_password, new_password } = req.body;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        cookie: jest.fn(),
      };

      const next = jest.fn();
      //Moc
      UserDtoFilter.UserUpdateRequestDto.mockReturnValue(userDto);
      const updateError = new Error("Invalid old password");
      userService.processUserUpdate.mockRejectedValue(updateError);

      //Act
      await handlePasswordUpdateRequest(req, res, next);

      //Assert
      expect(UserDtoFilter.UserUpdateRequestDto).toHaveBeenCalledWith(
        old_password
      );
      expect(userService.processUserUpdate).toHaveBeenCalledWith(
        userData,
        userDto,
        new_password
      );

      expect(res.status).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith(updateError);
    });
  });
});
