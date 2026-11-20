import type { HydratedDocument, Types } from "mongoose";
import type { IUser } from "../modules/users/user.model.ts";

declare global {
  namespace Express {
    interface Request {
      // Make req.user available with the right type
      user?: HydratedDocument<IUser>;
    }
  }
}
declare global {
  namespace Express {
    interface Request {
      user: { _id: Types.ObjectId };
    }
  }
}
