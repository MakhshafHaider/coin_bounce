const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshTokenScehma = require("../models/token");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  /////////// Register logic
  async register(req, res, next) {
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, name, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, Use other email",
        };

        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username not available, choose another email",
        };

        return next(error);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let AccessToken;
      let RefreshToken;
      let user;

      try {
        const userToRegister = new User({
          username,
          name,
          email,
          password: hashedPassword,
        });

        user = await userToRegister.save();

        //token generation
        AccessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
        RefreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
      } catch (error) {
        return next(error);
      }

      // store generated token in db
      await JWTService.storeRefreshToken(RefreshToken, user._id);

      res.cookie("accessToken", AccessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie("refreshToken", RefreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      let userDTO = new UserDTO(user);

      return res.status(201).json({ user: userDTO, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  /////////// Login logic
  async login(req, res, next) {
    const userLoginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let user;
    try {
      user = await User.findOne({ email });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };
        return next(error);
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    let AccessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    let RefreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    //update refresh token in db

    try {
      await RefreshTokenScehma.updateOne(
        {
          _id: user._id,
        },
        {
          token: RefreshToken,
        },
        {
          upsert: true,
        }
      );
    } catch (error) {
      return next(error);
    }
    res.cookie("accessToken", AccessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", RefreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    let userDTO = new UserDTO(user);
    return res.status(200).json({ user: userDTO, auth: true });
  },

  ////////////Logout logic
  async logout(req, res, next) {
    const { refreshToken } = req.cookies;

    try {
      await RefreshTokenScehma.deleteOne({
        token: refreshToken,
      });
    } catch (error) {
      return next(error);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ user: null, auth: false });
  },

  ////////////refresh logic

  async refresh(req, res, next) {
    const originalRefreshToken = req.cookies.refreshToken;
    let id;
    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthoirzed",
      };
      return next(error);
    }

    try {
      const match = RefreshTokenScehma.findOne({
        _id: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");
      await RefreshTokenScehma.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (error) {
      return next(error);
    }

    const user = await User.findOne({ _id: id });

    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
};

module.exports = authController;
