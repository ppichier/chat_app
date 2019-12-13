import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true
  }
});

userSchema.statics.findByLogin = async function(login) {
  let user = await this.findOne({
    userName: login
  });

  if (!user) {
    user = await this.findOne({ email: login });
  }

  return user;
};

//Every time a user is deleted, this hook makes sure that all messages that belong to this user are deleted as well
userSchema.pre("remove", function(next) {
  this.model("Message").deleteMany({ user: this._id }, next);
});

const User = mongoose.model("User", userSchema);

export default User;
