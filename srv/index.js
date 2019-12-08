import models, { connectDb } from "./models";
import "dotenv/config";

var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http, {
  pingTimeout: 60000
});

app.get("/", function(req, res) {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("chat message", function(msg) {
    console.log("message " + JSON.stringify(msg));
    io.emit("chat message", msg);
  });
});

const eraseDatabaseOnSync = false; // Set to true for re-initialize the db on every express server start

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({})
    ]);
  }

  http.listen(3001, function() {
    const host = http.address().address;
    const port = http.address().port;
    console.log("App listening at http://%s:%s", host, port);
  });

  createUsersWithMessages();
});

const createUsersWithMessages = async () => {
  const user1 = new models.User({
    username: "ppichier"
  });

  const user2 = new models.User({
    username: "ddavids"
  });

  const message1 = new models.Message({
    text: "Published the Road to learn React",
    user: user1.id
  });

  const message2 = new models.Message({
    text: "Happy to release ...",
    user: user2.id
  });
  const message3 = new models.Message({
    text: "Published a complete ...",
    user: user2.id
  });

  await message1.save();
  await message2.save();
  await message3.save();

  await user1.save();
  await user2.save();
};
