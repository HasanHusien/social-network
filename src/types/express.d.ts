import type { HydratedDocument } from "mongoose";
import type { IUser } from "../modules/users/user.model.ts";

declare global {
  namespace Express {
    interface Request {
      // Make req.user available with the right type
      user?: HydratedDocument<IUser>;
    }
  }
}
