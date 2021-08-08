const express = require('express');
const dns = require("dns");
const { ensureNotAuthenticated, flashMessageProvideToRender } = require('./middleware');
const { Link } = require('../models');
const router = express.Router();

router.get("/", flashMessageProvideToRender,
    ensureNotAuthenticated,
    (req, res, next) => {
        res.render("links/form")
    })

router.post("/", ensureNotAuthenticated,
    (req, res, next) => {
        if (typeof (req.body.link) === "string" && (req.body.link.length > 5)) {
            var protocolHost;
            var urlDns;
            try {
                protocolHost = req.body.link.split("//")[1];
            } catch (error) {
                req.flash("error", `${error.name} :: ${error.message}`)
                req.flash("error", "Link should be valid like https://example.com/link/wich/you/want/shortened")
                return res.redirect("/l")
            }
            try {
                urlDns = protocolHost.split("/")[0];
            } catch (error) {
                req.flash("error", `${error.name} :: ${error.message}`)
                req.flash("error", "DNS, like example.com should be representive")
                return res.redirect("/l")
            }
            dns.lookup(urlDns, (error) => {
                if (error) {
                    req.flash("error", `${error.name} :: ${error.message}`)
                    req.flash("error", "DNS should be correctly work")
                    return res.redirect("/l")
                }
                return next()
            })
        } else {
            req.flash("error", "Link length should be more than 8")
            res.redirect("/l")
        }
    },
    (req, res, next) => {
        Link.create({ original_link: req.params.link, _lord: req.user._id }, (error, linkDoc) => {
            if (error) {
                req.flash("error", `${error.name} :: ${error.message}`)
                res.redirect("/l")
            } else if (!linkDoc) {
                req.flash("error", "Error on save link")
                req.redirect("/l")
            }
            req.flash("success", "Link created.")
            return res.redirect(`/l/${linkDoc.short_link}/view`)
        })
    })

router.get("/:id",
    (req, res, next) => {
        if (req.params.id && typeof (req.params.id) && req.params.id.length > 5) {
            return next()
        }
        req.flash("error", "Link should be represent and valid")
        res.redirect("/404")
    },
    (req, res, next) => {
        Link.findOneAndUpdate({ short_link: req.params.id }, { $inc: { redirect_count: 1 } }, (error, linkDoc) => {
            if (error) {
                req.flash("error", `${error.name} :: ${error.message}`)
                res.redirect("/404")
            } else if (!linkDoc) {
                req.flash("error", `Dont find link with this id::${req.params.id}`)
                req.flash("success", "You can use this id, it is ~free!")
                res.redirect("/404")
            }
            res.redirect(linkDoc.original_link)
        })
    })

router.get("/:id/view",
    (req, res, next) => {
        if (req.params.id && typeof (req.params.id) && req.params.id.length > 5) {
            return next()
        }
        req.flash("error", "Link should be represent and valid")
    },
    (req, res, next) => {
        Link.findOne({ short_link: req.params.id }, (error, linkDoc) => {
            if (error) {
                req.flash("error", `${error.name} :: ${error.message}`)
                res.redirect("/404")
            } else if (!linkDoc) {
                req.flash("error", `Dont find link with this id::${req.params.id}`)
                req.flash("success", "You can use this id, it is ~free!")
                res.redirect("/404")
            }
            res.render("/links/elem", {})
        })
    })

router.get("/:id/stats",
    ensureNotAuthenticated,
    (req, res, next) => {
        res.send("Will render statistic of link")
    })

module.exports = router;
