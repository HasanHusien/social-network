import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { APIFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { Notification } from "./notification.model.js";

// @rote GET network/notifications
const getNotification = catchAsync(async (req, res, _next) => {
  const features = new APIFeatures(
    Notification.find({
      recipient: req.user._id,
      active: true,
    }),
    req.query,
  );
  const notifications = await features.query
    .populate("sender", "name photo")
    .populate("entityId", "content")
    .sort()
    .limitFields();

  if (!notifications)
    return new AppError(
      "Cannot found the notification",
      HTTP_STATUS.BAD_REQUEST,
    );

  const unreadNotificationCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
    active: true,
  });

  res.status(HTTP_STATUS.CREATED).json({
    status: "success",
    data: {
      notifications,
      unreadNotificationCount,
    },
  });
});

export { getNotification };
