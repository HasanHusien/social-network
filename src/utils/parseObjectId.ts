import { Types } from "mongoose";

export const parseObjectId = (value: unknown): Types.ObjectId | null =>
  typeof value === "string" && Types.ObjectId.isValid(value)
    ? new Types.ObjectId(value)
    : null;
