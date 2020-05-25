import { RequestHandler } from "express";
import { hash, verify } from "argon2";

import { User } from "../entity/user";
import { util } from "../util/util";

interface IAuthController {
  logIn: RequestHandler;
  register: RequestHandler;
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

      return res.status(200).send({ token: accessToken });
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
};
