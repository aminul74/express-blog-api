const userRepositories = require("../../repositories/user.repository");
const bcrypt = require("bcrypt");
const { decodeToken } = require("../../utils/JWT");
const {
  userFromAuthToken,
  processUserDeleteById,
  processUserUpdate,
} = require("../../services/user.service");

jest.mock("../../repositories/user.repository");
jest.mock("bcrypt");
jest.mock("../../utils/JWT");
jest.mock("../../utils/errors");

describe("User Controllers", () => {

  describe("userFromAuthToken", () => {
    it("Test Case 1: Get User From Token Success!", async () => {
      // Arrange
      const userToken = "fake-token";
      const decodedTokenMock = { id: "12345" };
      const userMock = {
        id: "12345",
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      // Mock
      decodeToken.mockResolvedValue(decodedTokenMock);
      userRepositories.getUserById.mockResolvedValue(userMock);

      // Act
      const result = await userFromAuthToken(userToken);

      // Assert
      expect(decodeToken).toHaveBeenCalledWith(userToken);
      expect(userRepositories.getUserById).toHaveBeenCalledWith(
        decodedTokenMock.id
      );
      expect(result).toEqual(userMock);
    });

    it("Test Case 2: Get User From Token Failure!", async () => {
      // Arrange
      const userToken = "fake-token";
      const decodedTokenMock = { id: "12345" };

      // Mock
      decodeToken.mockResolvedValue(decodedTokenMock);
      userRepositories.getUserById.mockRejectedValue(
        new Error("Unauthorized!")
      );

      // Act and Assert
      await expect(userFromAuthToken(userToken)).rejects.toThrow(Error);
      expect(decodeToken).toHaveBeenCalledWith(userToken);
      expect(userRepositories.getUserById).toHaveBeenCalledWith(
        decodedTokenMock.id
      );
    });

    it("Test Case 3: Token Missing!", async () => {
      // Arrange
      const userToken = null;

      // Act and Assert
      await expect(userFromAuthToken(userToken)).rejects.toThrow();
    });
  });

  describe("processUserDeleteById", () => {
    it("Test Case 1: User Delete Success!", async () => {
      // Arrange
      const user = { id: "1234" };

      // Mock
      userRepositories.deleteUserById.mockResolvedValue(true);

      // Act
      const result = await processUserDeleteById(user);

      // Assert
      expect(userRepositories.deleteUserById).toHaveBeenCalledWith(user.id);
      expect(result).toBe(true);
    });

    it("Test Case 1: User Delete Failure!", async () => {
      // Arrange
      const user = { id: "1234" };

      // Mock
      userRepositories.deleteUserById.mockRejectedValue(
        new Error("Please try again")
      );

      // Act and Assert
      await expect(processUserDeleteById(user)).rejects.toThrow(Error);
      expect(userRepositories.deleteUserById).toHaveBeenCalledWith(user.id);
    });
  });

  describe("processUserUpdate", () => {
    it("Test Case 1: User Password Update Success!", async () => {
      // Arrange
      const user = {
        id: "1234",
        password: "hashedOldPassword",
      };
      const updateUser = {
        password: "old_Password",
      };
      const new_password = "new_Pass123";
      const hashedNewPassword = "hashedNewPassword";

      // Mock
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue(hashedNewPassword);
      userRepositories.updatePasswordByUser.mockResolvedValue(true);

      // Act
      const result = await processUserUpdate(user, updateUser, new_password);

      // Assert
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        updateUser.password,
        user.password
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(new_password, "salt");
      expect(userRepositories.updatePasswordByUser).toHaveBeenCalledWith(
        user.id,
        hashedNewPassword
      );
      expect(result).toBe(true);
    });

    it("Test Case 2: User Old Password Wrong!", async () => {
      // Arrange
      const user = { id: "1234", password: "hashedOldPassword" };
      const updateUser = { password: "old_Password" };

      const error = new Error("Wrong old password!");
      error.status = 400;
      // Mock
      bcrypt.compare.mockResolvedValue(false);

      // Act and Assert
      await expect(
        processUserUpdate(user, updateUser, "new_password")
      ).rejects.toThrow(error);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        updateUser.password,
        user.password
      );
    });

    it("Test Case 3: User Password Update Failure!", async () => {
      // Arrange
      const user = { id: "1234", password: "hashedOldPassword" };
      const updateUser = { password: "old_Password" };
      const new_password = "new_Pass123";
      const error = new Error("Please try again");
      error.status = 400;
      // Mock
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedNewPassword");
      userRepositories.updatePasswordByUser.mockResolvedValue(false);

      // Act and Assert
      await expect(
        processUserUpdate(user, updateUser, new_password)
      ).rejects.toThrow(error);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        updateUser.password,
        user.password
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(new_password, "salt");
      expect(userRepositories.updatePasswordByUser).toHaveBeenCalledWith(
        user.id,
        "hashedNewPassword"
      );
    });
  });
});
