import { User } from "../entity/user";
import { sign } from "jsonwebtoken";

export const util = {
  createAccessToken(user: User) {
    const dataStoredInToken = { userId: user.id };
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET || "nekisecret";
    const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRE || "1h";

    console.log(secret);
    console.log(expiresIn);

    return sign(dataStoredInToken, secret, {
      expiresIn,
    });
  },
  createRefreshToken(user: User) {
    //todo
  },
};
