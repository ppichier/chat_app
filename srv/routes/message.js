import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  const messages = await req.context.models.Message.find();
  return res.send(messages);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const message = new req.context.models.Message(req.body);
  message.save();
});

router.get("/:messageId", async (req, res) => {
  const message = await req.context.models.Message.findById(
    req.params.messageId
  );
  return res.send(message);
});

router.delete("/:messageId", async (req, res) => {
  const message = await req.context.models.Message.findById(
    req.params.messageId
  );
  let result = null;
  if (message) {
    resutl = await message.remove();
  }
  return res.send(result);
});
export default router;
