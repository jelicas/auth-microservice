import { User } from "../entity/user";
import { sign } from "jsonwebtoken";

export const util = {
  createAccessToken(user: User) {
    const dataStoredInToken = { userId: user.id };
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET!;
    const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRE!;

    return sign(dataStoredInToken, secret, {
      expiresIn,
    });
  },
  createRefreshToken(user: User) {
    const dataStoredInToken = { userId: user.id };
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET!;
    const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRE!;

    return sign(dataStoredInToken, secret, {
      expiresIn,
    });
  },
};
