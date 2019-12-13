import "dotenv/config";
import express from "express";
import cors from "cors";

import models, { connectDb } from "./models";
import routes from "./routes";

var app = express();
var http = require("http").createServer(app);

var io = require("socket.io")(http, {
  pingTimeout: 60000
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByLogin("rwieruch")
  };
  next();
});

app.use("/session", routes.session);
app.use("/users", routes.user);
app.use("/messages", routes.message);

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("chat message", function(msg) {
    console.log("message " + JSON.stringify(msg));

    io.emit("chat message", msg);
  });
});

const eraseDatabaseOnSync = true; // Set to true for re-initialize the db on every express server start

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({})
    ]);
  }

  http.listen(process.env.PORT, function() {
    const host = http.address().address;
    const port = http.address().port;
    console.log("App listening at http://%s:%s", host, port);
  });

  createUsersWithMessages();
});

const createUsersWithMessages = async () => {
  const user1 = new models.User({
    userName: "rwieruc"
  });
  const user2 = new models.User({
    userName: "ddavid"
  });
  const message1 = new models.Message({
    msg: "Published the Road to learn React",
    from: user1.id,
    topic: "general"
  });
  const message2 = new models.Message({
    msg: "Happy to release ...",
    from: user2.id,
    topic: "general"
  });
  const message3 = new models.Message({
    msg: "Published a complete ...",
    from: user2.id,
    topic: "finance"
  });
  await Promise.all([
    message1.save(),
    message2.save(),
    message3.save(),
    user1.save(),
    user2.save()
  ]);

  models.User.find(function(err, users) {
    if (err) return console.error(err);
    console.log(users);
  });

  // const user = await models.User.find({ userName: "ddavid" });
  // console.log(user);
};
