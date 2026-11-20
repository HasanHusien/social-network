import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { AppError, catchAsync } from "../../utils/index.js";
import { User } from "../users/user.model.js";

const followUser = catchAsync(async (req, res, next) => {
  const sourceUserId = req.user._id;
  const targetUserId = req.params.userId;

  if (sourceUserId === targetUserId) {
    return next(
      new AppError("Users Cannot follow themselves", HTTP_STATUS.BAD_REQUEST),
    );
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser || !targetUser.active) {
    return next(
      new AppError(
        `Cannot find User with this ${targetUserId} Id`,
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }

  
});
