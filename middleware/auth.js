const { User } = require("../models")

function authParamsValidate(req, res, next) {
    if (typeof (req.body.username) === "string"
        && (req.body.username.length > 4)
        && (req.body.username.length < 35)) {
        if (typeof (req.body.password) === "string"
            && (req.body.password.length > 5)) {
            next()
        } else {
            req.flash("error", "too short or long username min length is 5 and max length is 17")
            res.redirect("/auth")
        }
    } else {
        req.flash("error", "too short password/ min length of password is 6")
        res.redirect("/auth")
    }
}

function signupParamsValidate(req, res, next) {
    const { username, password, password_confirm } = req.body
    if (username && typeof (username) === "string" && username.length > 6) {
        if (password && password.length > 6) {
            if (password_confirm && password === password_confirm) {
                next()
            } else {
                req.flash("error", "password should equal password confirm")
                res.redirect("/auth")
            }
        } else {
            req.flash("error", "password length will be more then 6")
            res.redirect("/auth")
        }
    } else {
        req.flash("error", "username length will be more then 6")
        res.redirect("/auth")
    }
}

function updateUserUsername(req, res, next) {
    const { username, } = req.body
    if (username && typeof (username) === "string" && username.length > 4) {
        User.findByIdAndUpdate({ _id: req.user._id, username: req.user.username }, { username }, { new: true })
            .then(updatedUser => {
                if (!updatedUser) {
                    req.flash("error", "Don't updated user info")
                    return res.redirect("/")
                } else {
                    req.flash("success", "User info successufully updated")
                    return res.redirect("/")
                }
            })
            .catch(e => {
                req.flash("error", `${e.name}::${e.message}`)
                return res.redirect("/")
            })
    } else {
        return next()
    }
}

function updateUserPassword(req, res, next) {
    const { old_pass, new_pass, confirm_new_pass } = req.body

    if (old_pass && new_pass) {
        if (typeof (old_pass) === "string" && old_pass.length > 6) {
            if (old_pass.length > 6) {
                if (new_pass.length > 6 && typeof (new_pass) === "string" && new_pass === confirm_new_pass) {
                    bcrypt.compare(old_pass, req.user.password)
                        .then(value => {
                            console.log(value)
                            if (value) {
                                return bcrypt.hash(new_pass, 12)
                            } else {
                                req.flash("error", "Password is incorrected")
                                return res.redirect("/")
                            }
                        })
                        .then(hash => User.findByIdAndUpdate({ _id: req.user._id, username: req.user.username }, { password: hash }, { new: true }))
                        .then(updatedUser => {
                            req.flash("success", "User data successufly updated")
                            return res.redirect("/")
                        }).catch(e => {
                            req.flash("error", `${e.name}::${e.message}`)
                        })
                } else {
                    req.flash("error", "new password will be equal to newpassword confirm and length more than 6")
                    res.redirect("/")
                }
            }
        } else {
            req.flash("error", "old password length will more 6")
            return res.redirect("/")
        }
    } else {
        return next()
    }
}

module.exports = { authParamsValidate, updateUserUsername, updateUserPassword, signupParamsValidate }
