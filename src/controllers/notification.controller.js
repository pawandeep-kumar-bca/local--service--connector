const notificationModel = require("../models/notification.model");
const userModel = require("../models/User.model");

async function createNotification(req, res) {
  try {
    const { receiverId, type, title, message, relatedId, relatedModel } =
      req.body;
    const senderId = req.user.id;
    if (!receiverId || !message || !type) {
      return res.status(400).json({ message: "All filed are required" });
    }
    if (receiverId === senderId) {
      return res.status(400).json({ message: "invalid receiver id" });
    }
    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "user not found" });
    }
    const notification = await notificationModel.create({
      receiverId,
      type,
      senderId,
      title,
      message,
      relatedId,
      relatedModel,
    });
    return res.status(201).json({
      message: "notification created successfully",
      notification,
    });
  } catch (err) {
    console.error("create notification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllNotification(req, res) {
  try {
    const userId = req.user.id;
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const skip = (page - 1) * limit;
    const notifications = await notificationModel
      .find({
        receiverId: userId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    if (notifications.length === 0) {
      return res
        .status(200)
        .json({
          message: "notification not found",
          notifications: [],
          totalNotifications: notifications.length,
        });
    }
    return res.status(200).json({
      message: "get all notification successfully",
      notifications,
      totalNotifications: notifications.length,
      page: page,
      limit: limit,
    });
  } catch (err) {
    console.error("get all notification error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function readNotification(req, res) {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await notificationModel.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "notification not found" });
    }
    if (notification.receiverId.toString() !== userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    return res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error("read notification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteNotification(req, res) {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await notificationModel.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "notification not found" });
    }
    if (notification.receiverId.toString() !== userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    if (notification.isDeleted) {
      return res.status(200).json({ message: "already deleted notification" });
    }
    if (!notification.isDeleted) {
      notification.isDeleted = true;
      await notification.save();
    }

    return res
      .status(200)
      .json({ message: "notification deleted successfully" });
  } catch (err) {
    console.error("delete notification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function unreadNotification(req, res) {
  try {
    const userId = req.user.id;
    const unreadCount = await notificationModel.countDocuments({
      receiverId: userId,
      isRead: false,
      isDeleted: false,
    });
    return res.status(200).json({
      message: "unread notifications count fetched successfully",
      unreadCount: unreadCount,
    });
  } catch (err) {
    console.error("unread notification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {
  createNotification,
  getAllNotification,
  readNotification,
  deleteNotification,
  unreadNotification,
};
