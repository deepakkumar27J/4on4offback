const userController = require('../controllers/user.controller');
const userService = require('../services/user.service');
const tokenService = require('../services/token.service');
const { sendEmail } = require('../services/email.service');

// Mocking dependencies
jest.mock('../services/user.service');
jest.mock('../services/token.service');
jest.mock('../services/email.service');

// Mock request and response objects
const mockRequest = (body = {}, params = {}) => ({
  body,
  params,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return 201 status', async () => {
      const mockUser = {
        name:"mrkumar",
        email:"binoviw4802@gitated.com",
        startDate:"12-11-2024",
        holidays:[]
    };
      userService.createUser.mockResolvedValue(mockUser);

      const req = mockRequest({
        name:"mrkumar",
        email:"binoviw4802@gitated.com",
        password:"admin",
        startDate:"12-11-2024",
        holidays:[]
    });
      const res = mockResponse();

      const user = await userController.createUser(req, res);
    console.log("user ", user);
      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 status if there is an error', async () => {
      userService.createUser.mockRejectedValue(new Error('Invalid data'));

      const req = mockRequest({ name: '' });
      const res = mockResponse();

      const user = await userController.createUser(req, res);
        console.log("error user ", user);
      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data' });
    });
  });

  describe('getUserById', () => {
    it('should return the user if found', async () => {
      const mockUser = { id: '123', name: 'John Doe' };
      userService.getUserById.mockResolvedValue(mockUser);

      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      await userController.getUserById(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('123');
      expect(res.status).not.toHaveBeenCalled(); // No status call for 200 by default
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if the user is not found', async () => {
      userService.getUserById.mockResolvedValue(null);

      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      await userController.getUserById(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 400 if there is an error', async () => {
      userService.getUserById.mockRejectedValue(new Error('Database error'));

      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      await userController.getUserById(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
})