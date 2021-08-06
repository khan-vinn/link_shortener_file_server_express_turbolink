const mongoose = require("mongoose");
const FileSchema = require("./schema/file");
const LinkSchema = require("./schema/link");
const UserSchema = require("./schema/user");


const User = mongoose.model("Users", UserSchema)
const File = mongoose.model("Files", FileSchema)
const Link = mongoose.model("Link", LinkSchema)
module.exports = { User, File, Link }