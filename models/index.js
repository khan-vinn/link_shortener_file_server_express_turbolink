const mongoose = require("mongoose");
const FileSchema = require("./schema/file");
const UserSchema = require("./schema/user");

const User = mongoose.model("Users", UserSchema)
const File = mongoose.model("Files", FileSchema)
module.exports = { User, File }