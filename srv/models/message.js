import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  msg: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
    // ref: "user"
  },
  topic: {
    type: String,
    required: true
  }

  // user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
