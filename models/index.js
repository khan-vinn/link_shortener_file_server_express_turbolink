const mongoose = require("mongoose");
const UserSchema = require("./schema/user");

const User = mongoose.model("Users", UserSchema)

module.exports = User