const mongoose = require("mongoose");
const Message = require("../models/message.model");
const HttpError = require("../utils/http-error");

function validateObjectId(id, fieldName) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, `${fieldName} is invalid`);
  }
}

function getCurrentUserId(req) {
  const currentUserId = req.header("x-user-id");

  if (!currentUserId) {
    throw new HttpError(400, "x-user-id header is required");
  }

  validateObjectId(currentUserId, "Current user ID");
  return currentUserId;
}

function buildMessageContent(body) {
  const { text, filePath } = body;

  if (typeof filePath === "string" && filePath.trim()) {
    return {
      type: "file",
      text: filePath.trim()
    };
  }

  if (typeof text === "string" && text.trim()) {
    return {
      type: "text",
      text: text.trim()
    };
  }

  throw new HttpError(400, "text or filePath is required");
}

async function createMessage(req, res, next) {
  try {
    const from = getCurrentUserId(req);
    const { to } = req.body;

    validateObjectId(to, "to");

    if (from === to) {
      throw new HttpError(400, "Sender and receiver must be different");
    }

    const messageContent = buildMessageContent(req.body);

    const message = await Message.create({
      from,
      to,
      messageContent
    });

    res.status(201).json({
      message: "Send message successfully",
      data: message
    });
  } catch (error) {
    next(error);
  }
}

async function getConversationByUserId(req, res, next) {
  try {
    const currentUserId = getCurrentUserId(req);
    const { userID } = req.params;

    validateObjectId(userID, "userID");

    const messages = await Message.find({
      $or: [
        {
          from: currentUserId,
          to: userID
        },
        {
          from: userID,
          to: currentUserId
        }
      ]
    }).sort({ createdAt: 1 });

    res.json({
      message: "Get conversation successfully",
      data: messages
    });
  } catch (error) {
    next(error);
  }
}

async function getLastMessages(req, res, next) {
  try {
    const currentUserId = getCurrentUserId(req);
    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);

    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: currentUserObjectId },
            { to: currentUserObjectId }
          ]
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: [
              { $eq: ["$from", currentUserObjectId] },
              "$to",
              "$from"
            ]
          }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: {
          newRoot: "$lastMessage"
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);

    res.json({
      message: "Get last messages successfully",
      data: lastMessages
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMessage,
  getConversationByUserId,
  getLastMessages
};
