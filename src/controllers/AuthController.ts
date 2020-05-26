import "dotenv/config";

import { RequestHandler } from "express";
import { hash } from "argon2";

import { User } from "../entity/user";
import { util } from "../util/util";
import { verify } from "jsonwebtoken";

interface IAuthController {
  logIn: RequestHandler;
  register: RequestHandler;
  refresh: RequestHandler;
}

export const AuthController: IAuthController = {
  async logIn(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
        select: ["id", "email", "password", "fullName"],
      });

      if (!user) {
        return res
          .status(404)
          .send({ message: "User with that email does not exist" });
      }

      if (!(await verify(user.password, password))) {
        return res.status(404).send({ message: "Wrong password" });
      }

      const accessToken = util.createAccessToken(user);
      const refreshToken = util.createRefreshToken(user);

      const cookieKey = process.env.JWT_REFRESH_TOKEN_COOKIE_KEY!;

      return res
        .status(200)
        .cookie(cookieKey, refreshToken, {
          httpOnly: true,
        })
        .send({ accessToken });
    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ message: error.message || "Internal server error", error });
    }
  },
  async register(req, res) {
    try {
      const { email, password, fullName } = req.body;

      if ((await User.find({ email })).length) {
        return res
          .status(403)
          .send({ message: "User with that email already exists" });
      }

      const hashedPassword = await hash(password);

      //active record pattern
      const user = new User(email, hashedPassword, fullName);
      await user.save();

      return res.status(200).send({ id: user.id });
    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ message: error.message || "Internal server error", error });
    }
  },
  async refresh(req, res) {
    try {
      const cookieKey = process.env.JWT_REFRESH_TOKEN_COOKIE_KEY!;
      const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET!;

      console.log(req.cookies);

      let refreshToken = req.cookies[cookieKey];
      let payload: any = null;

      try {
        payload = verify(refreshToken, refreshSecret);
      } catch (error) {
        return res.status(401).send({ message: "Token invalid" });
      }

      const user = await User.findOne(
        { id: payload.userId },
        { select: ['id', 'email', 'password'] },
      );
  
      if (!user) {
        return res
          .status(404)
          .send({ message: "User does not exist." });
      }

      const accessToken = util.createAccessToken(user);
      refreshToken = util.createRefreshToken(user);

      return res
      .status(200)
      .cookie(cookieKey, refreshToken, {
        httpOnly: true,
      })
      .send({ accessToken });

    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ message: error.message || "Internal server error", error });
    }
  },
};
