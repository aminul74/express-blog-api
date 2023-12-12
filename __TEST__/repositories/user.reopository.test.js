// const User = require("../../models/user.model");
// const {
//   getUserById,
//   deleteUserById,
//   updatePasswordByUser,
//   getUserByUsername,
// } = require("../../repositories/user.repository");

// jest.mock("../../models/user.model");

// describe("User Controller", () => {
//   describe("getUserById", () => {
//     it("Test Case 1: Get User Success!", async () => {
//       //Arrange
//       const id = "1234";
//       const user = {
//         id: "12345",
//         username: "aminul123",
//         email: "aminul@gmail.com",
//         password: "a1234b4",
//       };
//       //Moc
//       User.findByPk.mockResolvedValue(user);

//       //Act
//       const result = await getUserById(id);
//       //Assert
//       expect(User.findByPk).toHaveBeenCalledWith(id, {
//         attributes: ["id", "username", "email", "password"],
//       });
//       expect(result).toEqual(user);
//       //   describe("Test Case 1");
//     });

//     it("Test Case 2: Get User By Id Falilure", async () => {
//       //Arrange
//       const id = "1234";

//       //Mocs
//       User.findByPk.mockResolvedValue(null);

//       //Act
//       const result = await getUserById(id);
//       //Assert
//       expect(User.findByPk).toHaveBeenCalledWith(id, {
//         attributes: ["id", "username", "email", "password"],
//       });
//       expect(result).toBeNull();
//     });
//   });

//   describe("deleteUserById", () => {
//     it("Test case 1: Delete User By Id Success!", async () => {
//       //Arrange
//       const id = "1234";

//       //Moc
//       User.destroy.mockResolvedValue(true);

//       //Act
//       const result = await deleteUserById(id);

//       //Assert
//       expect(User.destroy).toHaveBeenCalledWith({
//         where: { id },
//       });
//       expect(result).toEqual(true);
//     });

//     it("Test case 2: Delete User By Id Falilure!", async () => {
//       //Arrange
//       const id = "1234";

//       //Moc
//       User.destroy.mockResolvedValue(false);

//       //Act
//       const result = await deleteUserById(id);

//       //Assert
//       expect(User.destroy).toHaveBeenCalledWith({
//         where: { id },
//       });
//       expect(result).toEqual(false);
//     });
//   });

//   describe("updatePasswordByUser", () => {
//     it("Test Case 1: Update Password Success!", async () => {
//       //Arrange
//       const userId = "1234";
//       const newHashPassword = "hash-123";
//       const user = {
//         id: "12345",
//         username: "aminul123",
//         email: "aminul@gmail.com",
//         password: "a1234b4",
//       };

//       //Moc
//       User.update.mockResolvedValue(user);

//       //Act
//       const result = await updatePasswordByUser(userId, newHashPassword);

//       //Assert
//       expect(User.update).toHaveBeenCalledWith(
//         { password: newHashPassword },
//         { where: { id: userId } }
//       );
//       expect(result).toEqual(user);
//     });

//     it("Test Case 2: Update Password Failure!", async () => {
//       //Arrange
//       const userId = "1234";
//       const newHashPassword = "hash-123";

//       //Moc
//       User.update.mockResolvedValue(false);

//       //Act
//       const result = await updatePasswordByUser(userId, newHashPassword);

//       //Assert
//       expect(User.update).toHaveBeenCalledWith(
//         { password: newHashPassword },
//         { where: { id: userId } }
//       );
//       expect(result).toEqual(false);
//     });
//   });

//   describe("getUserByUsername", () => {
//     it("Test Case 1: Get User By Username Success!", async () => {
//       // Arrange
//       const username = "aminul123";
//       const expectedUser = {
//         id: "12345",
//         username: "aminul123",
//         email: "aminul@gmail.com",
//         password: "a1234b4",
//       };

//       // Mock User.findOne
//       User.findOne.mockResolvedValue(expectedUser);

//       // Act
//       const result = await getUserByUsername(username);

//       // Assert
//       expect(User.findOne).toHaveBeenCalledWith({ where: { username } });
//       expect(result).toEqual(expectedUser);
//     });

//     it("Test Case 2: Get User By Username Failure!", async () => {
//       // Arrange
//       const username = "aminul123";

//       // Mock
//       User.findOne.mockResolvedValue(false);

//       // Act
//       const result = await getUserByUsername(username);

//       // Assert
//       expect(User.findOne).toHaveBeenCalledWith({
//         where: { username: username },
//       });
//       expect(result).toEqual(false);
//     });
//   });
// });
