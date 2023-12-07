const authRepositories = require("../../repositories/auth.repository");
const bcrypt = require("bcrypt");
const { decodeToken } = require("../../utils/JWT");
const { UnauthorizedError } = require("../../utils/errors");

const {
  processUserRegistration,
  processUserLogin,
  getUserByUsername,
} = require("../../services/auth.service");

jest.mock("../../repositories/auth.repository");
jest.mock("bcrypt");
jest.mock("../../utils/JWT");
jest.mock("../../utils/errors");

describe("Auth Controllers", () => {
  describe("processUserRegistration", () => {
    describe("processUserRegistration", () => {
      it("Test Case 1: Registration Success!", async () => {
        //Arrange
        const username = "aminul123";
        const email = "aminul@gmail.com";
        const password = "pass123";

        //Mock
        authRepositories.findEmailByUserEmail.mockResolvedValue(null);
        bcrypt.genSalt.mockResolvedValue("salted");
        bcrypt.hash.mockResolvedValue("hashed");
        authRepositories.createUser.mockResolvedValue({
          username,
          email,
          password: "hashed",
        });

        //Act

        const result = await processUserRegistration(username, email, password);

        //Assert
        expect(authRepositories.findEmailByUserEmail).toHaveBeenCalledWith(
          email
        );
        expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalledWith(password, "salted");
        expect(authRepositories.createUser).toHaveBeenCalledWith(
          username,
          email,
          "hashed"
        );
        expect(result).toEqual({
          username,
          email,
          password: "hashed",
        });
      });

      it("Test Case : Registration Failure!", async () => {
        // Arrange
        const username = "aminul123";
        const email = "aminul@gmail.com";
        const password = "pass123";

        // Mock
        authRepositories.findEmailByUserEmail.mockRejectedValue(
          new Error("You are already registerd !")
        );

        // Act and Assert
        await expect(
          processUserRegistration(username, email, password)
        ).rejects.toThrow(Error);
        expect(authRepositories.findEmailByUserEmail).toHaveBeenCalledWith(
          email
        );
        expect(bcrypt.genSalt).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(authRepositories.createUser).not.toHaveBeenCalled();
      });
    });

    describe("processUserLogin", () => {
      it("Test Case 1: Login Success!", async () => {
        // Arrange
        const username = "aminul123";
        const password = "pass123";
        const hashedPassword = "hashed_pass123";

        // Mock
        authRepositories.loginUser.mockResolvedValue({
          username,
          password: hashedPassword,
        });
        bcrypt.compare.mockResolvedValue(true);

        // Act
        const result = await processUserLogin(username, password);

        // Assert
        expect(authRepositories.loginUser).toHaveBeenCalledWith(username);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
        expect(result).toBe(true);
      });

      it("Test Case 2: Login Username Not found!", async () => {
        // Arrange
        const username = "aminul123";
        const password = "pass123";

        // Mock
        authRepositories.loginUser.mockRejectedValue(
          new Error("Username not found")
        );

        // Act and Assert
        await expect(processUserLogin(username, password)).rejects.toThrow(
          Error
        );
        expect(authRepositories.loginUser).toHaveBeenCalledWith(username);
        expect(bcrypt.compare).not.toHaveBeenCalled();
      });

      it("Test Case 3: Login Wrong Password!", async () => {
        // Arrange
        const username = "aminul123";
        const password = "pass123";
        const hashedPassword = "hashed_pass123";

        // Mock
        authRepositories.loginUser.mockResolvedValue({
          username,
          password: hashedPassword,
        });

        bcrypt.compare.mockRejectedValue(new Error("Wrong password"));

        // Act and Assert
        await expect(processUserLogin(username, password)).rejects.toThrow(
          Error
        );
        expect(authRepositories.loginUser).toHaveBeenCalledWith(username);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      });
    });
  });

  describe("getUserByUsername", () => {
    it("Test Case 1: Get User By Username Success!", async () => {
      // Arrange
      const username = "aminul123";

      const userMock = {
        id: "12345",
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      // Mock
      authRepositories.getUserByUsername.mockResolvedValue(userMock);

      // Act
      const result = await getUserByUsername(username);

      // Assert
      expect(authRepositories.getUserByUsername).toHaveBeenCalledWith(username);
      expect(result).toEqual(userMock);
    });

    it("Test Case 2: Get User Failure!", async () => {
      // Arrange
      const username = "aminul123";

      // Mock
      authRepositories.getUserByUsername.mockRejectedValue(
        new Error("Something went wrong, please try again!")
      );

      // Act and Assert
      await expect(getUserByUsername(username)).rejects.toThrow(Error);
      expect(authRepositories.getUserByUsername).toHaveBeenCalledWith(username);
    });
  });
});
