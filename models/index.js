const mongoose = require("mongoose");
const FileSchema = require("./schema/file");
const LinkSchema = require("./schema/link");
const UserSchema = require("./schema/user");
const VisitSchema = require("./schema/visit");


const User = mongoose.model("Users", UserSchema)
const File = mongoose.model("Files", FileSchema)
const Link = mongoose.model("Links", LinkSchema)
const Visit = mongoose.model("Visits", VisitSchema)
module.exports = { User, File, Link, Visit }