const UserDtoFilter = require("../../dto/user.dto");
const authService = require("../../services/auth.service");
const { createToken } = require("../../utils/JWT");
const { usersDB } = require("../testDB");
const { getContentBasedOnNegotiation } = require("../../utils/responseType");
const {
  handleUserRegistration,
  handleLoginRequest,
} = require("../../controllers/auth.controller");

jest.mock("../../dto/user.dto");
jest.mock("../../services/auth.service");
jest.mock("../../utils/JWT");
jest.mock("../../utils/responseType");

describe("Auth Controller", () => {
  describe("handleUserRegistration", () => {
    it("Test Case 1: Registration success!", async () => {
      // Arrange
      const req = {
        body: {
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
        accepts: jest.fn().mockReturnValue("json"),
      };
      const next = jest.fn();
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };

      const { username, email, password } = req.body;
      const user = {
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      const registeredUser = usersDB[1];
      const userRegistrationToken = {
        id: "12345",
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };
      const tokenResponse = { token: userRegistrationToken };
      const token = [tokenResponse];
      const negotiate = req.accepts(["json", "text", "xml", "html"]);
      const response = usersDB[1];
      //Moc
      UserDtoFilter.UserRegRequestDto.mockReturnValue(user);
      authService.processUserRegistration.mockResolvedValue(registeredUser);
      createToken.mockReturnValue(userRegistrationToken);
      getContentBasedOnNegotiation.mockResolvedValue(response);

      //Act
      await handleUserRegistration(req, res, next);

      //Assert
      expect(UserDtoFilter.UserRegRequestDto).toHaveBeenCalledWith(
        username,
        email,
        password
      );

      expect(authService.processUserRegistration).toHaveBeenCalledWith(
        user.username,
        user.email,
        user.password
      );

      expect(createToken).toHaveBeenCalledWith(registeredUser.id);
      expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(
        token,
        negotiate
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.type).toHaveBeenCalledWith(negotiate);
      expect(res.send).toHaveBeenCalledWith(response);
    });

    it("Test Case 2: Registration Failure!", async () => {
      // Arrange
      const req = {
        body: {
          username: "aminul123",
          email: "aminul@gmail.com",
          password: "a1234b4",
        },
      };

      const { username, email, password } = req.body;
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      const userDto = {
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      // Moc
      UserDtoFilter.UserRegRequestDto.mockReturnValue(userDto);

      authService.processUserRegistration.mockRejectedValue(new Error("error"));

      // Act
      await handleUserRegistration(req, res, next);

      //Assert
      expect(UserDtoFilter.UserRegRequestDto).toHaveBeenCalledWith(
        username,
        email,
        password
      );

      expect(authService.processUserRegistration).toHaveBeenCalledWith(
        userDto.username,
        userDto.email,
        userDto.password
      );

      // expect(res.status).toHaveBeenCalled(409);
      expect(res.cookie).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("handleLoginRequest", () => {
    it("Test case 1: Login sucess!", async () => {
      //Arrange
      const req = {
        body: {
          username: "aminul123",
          password: "a1234b4",
        },
        accepts: jest.fn().mockReturnValue("json"),
      };
      const next = jest.fn();
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        type: jest.fn(),
      };

      const { username, password } = req.body;
      const userDto = {
        username: "aminul123",
        password: "a1234b4",
      };
      const userLoginToken = usersDB[1];
      const user = {
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };
      const tokenResponse = { token: userLoginToken };
      const token = [tokenResponse];
      const negotiate = req.accepts(["json", "text", "xml", "html"]);
      const response = usersDB[1];

      //Moc
      UserDtoFilter.UserLoginRequestDto.mockReturnValue(userDto);
      authService.processUserLogin.mockResolvedValue(user);
      authService.getUserByUsername.mockResolvedValue(userDto.username);
      createToken.mockReturnValue(userLoginToken);
      getContentBasedOnNegotiation.mockResolvedValue(response);

      //Act
      await handleLoginRequest(req, res, next);

      //Assert
      expect(UserDtoFilter.UserLoginRequestDto).toHaveBeenCalledWith(
        username,
        password
      );

      expect(authService.processUserLogin).toHaveBeenCalledWith(
        userDto.username,
        userDto.password
      );

      expect(authService.getUserByUsername).toHaveBeenCalledWith(
        userDto.username
      );

      expect(createToken).toHaveBeenCalledWith(user.id);

      expect(getContentBasedOnNegotiation).toHaveBeenCalledWith(
        token,
        negotiate
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.type).toHaveBeenCalledWith(negotiate);
      expect(res.send).toHaveBeenCalledWith(response);
    });

    it("Test case 2: Login Failure!", async () => {
      //Arrange
      const req = {
        body: {
          username: "aminul123",
          password: "a1234b4",
        },
      };

      const { username, password } = req.body;
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const userDto = {
        username: "aminul123",
        email: "aminul@gmail.com",
        password: "a1234b4",
      };

      const next = jest.fn();

      UserDtoFilter.UserLoginRequestDto.mockReturnValue(userDto);
      authService.processUserLogin.mockRejectedValue(new Error("error"));

      //Act
      await handleLoginRequest(req, res, next);

      //Assert
      expect(UserDtoFilter.UserLoginRequestDto).toHaveBeenCalledWith(
        username,
        password
      );

      expect(authService.processUserLogin).toHaveBeenCalledWith(
        userDto.username,
        userDto.password
      );

      expect(res.status).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
