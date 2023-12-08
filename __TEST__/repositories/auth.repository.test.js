const User = require("../../models/user.model");
const {
  findEmailByUserEmail,
  getUserByUsername,
  createUser,
  //   loginUser,
} = require("../../repositories/auth.repository");

jest.mock("../../models/user.model");

describe("Auth Controllers", () => {
  describe("findEmailByUserEmail", () => {
    it("Test Case 1: Find EmailByUserEmail Success!", async () => {
      //Arrange
      const email = "aminul@gmail.com";

      //Moc
      User.findOne.mockResolvedValue(null);

      //Act
      const result = await findEmailByUserEmail(email);

      //Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: email } });

      expect(result).toBeNull();
    });
  });

  describe("findEmailByUserEmail", () => {
    it("Test Case 2: Find EmailByUserEmail Failure!", async () => {
      //Arrange
      const validUser = "aminul@gmail.com";
      const email = "aminul@gmail.com";

      //Moc
      User.findOne.mockResolvedValue(validUser);

      //Act
      const result = await findEmailByUserEmail(email);

      //Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: email } });

      expect(result).toEqual(validUser);
    });
  });

  describe("getUserByUsername", () => {
    it("Test Case 1: User Validation Success!", async () => {
      //Arrange
      const username = "aminul@gmail.com";
      const validUser = {
        id: "12345",
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };
      //Moc
      User.findOne.mockResolvedValue(validUser);

      //Act
      const result = await getUserByUsername(username);

      //Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { username } });

      expect(result).toEqual(validUser);
    });

    it("Test Case 2: User Validation Failure!", async () => {
      //Arrange
      const username = "aminul@gmail.com";
      const validUser = {
        id: "12345",
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };
      //Moc
      User.findOne.mockResolvedValue(null);

      //Act
      const result = await getUserByUsername(username);

      //Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { username } });

      expect(result).not.toEqual(validUser);
    });
  });

  describe("createUser", () => {
    it("Test Case 1: Create User Success!", async () => {
      //Arrange
      const username = "aminul123";
      const email = "aminul@gamil.conm";
      const hashPassword = "pass-123";

      const validUser = {
        username: "aminul123",
        email: "aminul@gamil.conm",
        password: "pass-123",
      };

      //Moc
      User.create.mockResolvedValue(validUser);

      //Act
      const result = await createUser(username, email, hashPassword);

      //Assert
      expect(User.create).toHaveBeenCalledWith({
        username,
        email,
        password: hashPassword,
      });
      expect(result).toEqual(validUser);
    });

    it("Test Case 2: Create User Failure!", async () => {
      //Arrange
      const username = "aminul123";
      const email = "aminul@gamil.conm";
      const hashPassword = "pass-123";

      const validUser = {
        username: "aminul123",
        email: "aminul@gamil.conm",
        password: "pass-123",
      };

      //Moc
      User.create.mockResolvedValue(null);

      //Act
      const result = await createUser(username, email, hashPassword);

      //Assert
      expect(User.create).toHaveBeenCalledWith({
        username,
        email,
        password: hashPassword,
      });
      expect(result).not.toEqual(validUser);
    });
  });
});
