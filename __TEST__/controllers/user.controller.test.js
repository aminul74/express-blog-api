/* eslint-disable no-undef */
const UserDtoFilter = require("../../dto/user.dto");
const userService = require("../../services/user.service");
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

      const expectedUser = {
        id: "12345",
        username: "aminul123",
        email: "aminul@gmail.com",
      };
      const req = {
        user: {
          expectedUser,
          toJSON: jest.fn().mockReturnThis({
            id: "12345",
            username: "aminul123",
            email: "aminul@gmail.com",
          }),
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

    // Add more test cases as needed
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

    // it("Test case 2: Profile Deletion Failure", async () => {
    //   // Arrange
    //   const req = {
    //     cookies: {
    //       "access-token": "fake-token",
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //   };

    //   const fakeUserData = {
    //     id: "userFakeId",
    //   };

    //   const next = jest.fn();

    //   // Mock
    //   userService.userFromAuthToken.mockResolvedValue(fakeUserData);
    //   userService.processUserDeleteById.mockRejectedValue(
    //     new Error("Deletion failure")
    //   );

    //   // Act
    //   await handleProfileDeletionRequest(req, res, next);

    //   // Assert
    //   expect(userService.userFromAuthToken).toHaveBeenCalledWith(
    //     req.cookies["access-token"]
    //   );
    //   expect(res.status).not.toHaveBeenCalledWith(200);
    //   expect(res.send).not.toHaveBeenCalledWith("Deletion Failure!");
    //   expect(next).toHaveBeenCalledWith(expect.any(Error));
    // });
  });

  // describe("PasswordUpdateRequest", () => {
  //   it("Test case 1: Password Update success!", async () => {
  //     // Arrange

  //     const req = {
  //       body: {
  //         old_password: "oldPass",
  //         new_password: "newPass",
  //       },
  //       cookies: {
  //         "access-token": "fake-token",
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       send: jest.fn(),
  //       cookie: jest.fn(),
  //     };
  //     const fakeUser = {
  //       id: "44678312-7204-4fa6-be5d-1b7de9949aeb",
  //       password:
  //         "$2b$10$Z1s4VoX/NQZ3c8gLcEaaZOeXh0w7C9sRcOBypl1vcukznvc9ScWuu",
  //     };
  //     const next = jest.fn();
  //     //Moc
  //     userService.userFromAuthToken.mockResolvedValue(fakeUser);
  //     UserDtoFilter.UserUpdateRequestDto.mockReturnValue({
  //       password: "oldPass",
  //     });

  //     userService.processUserUpdate.mockResolvedValue(
  //       fakeUser,
  //       req.body.old_password,
  //       req.body.new_password
  //     );

  //     //Act
  //     await handlePasswordUpdateRequest(req, res, next);

  //     //Assert

  //     expect(userService.userFromAuthToken).toHaveBeenCalledWith(
  //       req.cookies["access-token"]
  //     );

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.send).toHaveBeenCalledWith("Password update success!");
  //     expect(res.cookie).toHaveBeenCalledWith("access-token", " ", {
  //       maxAge: -1,
  //     });
  //     expect(next).not.toHaveBeenCalled();
  //   });

  //   it("Test case 2: Password Update Failure!", async () => {
  //     // Arrange

  //     const req = {
  //       body: {
  //         old_password: "oldPass",
  //         new_password: "newPass",
  //       },
  //       cookies: {
  //         "access-token": "fake-token",
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       send: jest.fn(),
  //       cookie: jest.fn(),
  //     };
  //     const fakeUser = {
  //       id: "44678312-7204-4fa6-be5d-1b7de9949aeb",
  //       password:
  //         "$2b$10$Z1s4VoX/NQZ3c8gLcEaaZOeXh0w7C9sRcOBypl1vcukznvc9ScWuu",
  //     };
  //     const next = jest.fn();
  //     //Moc
  //     userService.userFromAuthToken.mockResolvedValue(fakeUser);
  //     UserDtoFilter.UserUpdateRequestDto.mockReturnValue({
  //       password: "oldPass",
  //     });

  //     userService.processUserUpdate.mockResolvedValue(null);

  //     //Act
  //     await handlePasswordUpdateRequest(req, res, next);

  //     //Assert

  //     expect(userService.userFromAuthToken).toHaveBeenCalledWith(
  //       req.cookies["access-token"]
  //     );
  //     expect(next).toHaveBeenCalledWith(
  //       Error("Unable to update password please try again!")
  //     );
  //   });
  // });
});
