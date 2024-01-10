const userRepositories = require("../../repositories/user.repository");
const bcrypt = require("bcrypt");
const { decodeToken } = require("../../utils/JWT");
const { usersDB } = require("../testDB");
const {
  // userFromAuthToken,
  processUserDeleteById,
  processUserUpdate,
  userByTokenId,
} = require("../../services/user.service");

jest.mock("../../repositories/user.repository");
jest.mock("bcrypt");
jest.mock("../../utils/JWT");
// jest.mock("../../utils/errors");

describe("User Controllers", () => {
  describe("userByTokenId", () => {
    it("Test Case 1: Get User by Token Success!", async () => {
      //Arrange
      const user = usersDB[1];

      //Moc
      userRepositories.getUserById.mockResolvedValue(user);

      //Act
      const result = await userByTokenId(user);

      //Assert
      expect(userRepositories.getUserById).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(user);
    });

    it("Test Case 2: Get User by Token Failure!", async () => {
      // Arrange
      const user = usersDB[1];

      // Mock
      const error = new Error("Unauthorized!");
      userRepositories.getUserById.mockRejectedValue(error);

      // Act and Assert
      await expect(userByTokenId(user)).rejects.toThrow("Unauthorized!");
      expect(userRepositories.getUserById).toHaveBeenCalledWith(user.id);
    });
  });

  describe("processUserDeleteById", () => {
    it("Test Case 1: User Delete Success!", async () => {
      // Arrange
      const user = { id: "1234" };
      const userUUID = "1234";

      // Mock
      userRepositories.deleteUserById.mockResolvedValue(true);

      // Act
      const result = await processUserDeleteById(user, userUUID);

      // Assert
      expect(userRepositories.deleteUserById).toHaveBeenCalledWith(user.id);
      expect(result).toBe(true);
    });

    it("Test Case 2: User Delete Failure!", async () => {
      // Arrange
      const user = { id: "1234" };
      const userUUID = "5678";

      // Act and Assert
      await expect(processUserDeleteById(user, userUUID)).rejects.toThrow(
        "Invalid user ID"
      );
    });
  });

  describe("processUserUpdate", () => {
    it("Test Case 1: User Password Update Success!", async () => {
      // Arrange
      const userUUID = "1234";
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
      const result = await processUserUpdate(
        user,
        updateUser,
        new_password,
        userUUID
      );

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
      const userUUID = "1234";
      const user = { id: "1234", password: "hashedOldPassword" };
      const updateUser = { password: "old_Password" };

      const error = new Error("Wrong old password!");
      error.status = 400;
      // Mock
      bcrypt.compare.mockResolvedValue(false);

      // Act and Assert
      await expect(
        processUserUpdate(user, updateUser, "new_password", userUUID)
      ).rejects.toThrow(error);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        updateUser.password,
        user.password
      );
    });

    it("Test Case 3: User Password Update Failure!", async () => {
      // Arrange
      const userUUID = "1234";
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
        processUserUpdate(user, updateUser, new_password, userUUID)
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
