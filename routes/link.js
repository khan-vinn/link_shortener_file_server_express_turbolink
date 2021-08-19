const express = require('express');
const dns = require("dns");
const { flashMessageProvideToRender, ensureNotAuthenticated } = require('../middleware/middleware');
const { Link, Visit } = require('../models');
const { linkIdParamsValidate } = require('../middleware/link');
const router = express.Router();

router.get("/", flashMessageProvideToRender,
    ensureNotAuthenticated,
    (req, res, next) => {
        res.render("links/form")
    })

router.post("/", ensureNotAuthenticated,
    (req, res, next) => {
        const { link } = req.body
        if (typeof (link) === "string" && (link.length > 5)) {
            var protocolHost;
            var urlDns;
            try {
                protocolHost = link.split("//")[1];
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
                req.flash("error", `${link} not valid, use like https://github.com/vim`)
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
        Link.create({ original_link: req.body.link, _lord: req.user._id })
            .then(doc => {
                console.log(doc)
                if (doc) {
                    req.flash("success", "Link created.")
                    return res.redirect(`/l/${doc.short_link}/view`)
                } else if (!doc) {
                    req.flash("error", "Error on save link")
                    return req.redirect("/l")
                }
            }).catch(error => {
                req.flash("error", `${error.name} :: ${error.message}`)
                return res.redirect("/l")
            })
    })

router.get("/:id",
    linkIdParamsValidate,
    (req, res, next) => {
        Link.findOneAndUpdate({ short_link: req.params.id }, { $inc: { redirect_count: 1 } }, { new: true, timestamps: false }, (error, linkDoc) => {
            if (error) {
                req.flash("error", `${error.name} :: ${error.message}`)
                res.redirect("/404")
            } else if (!linkDoc) {
                req.flash("error", `Dont find link with this id::${req.params.id}`)
                req.flash("success", "You can use this id, it is ~free!")
                res.redirect("/404")
            }
            Visit.create({
                belongs_to: linkDoc._id,
                ip_addr: req.ip,
                client: req.get("user-agent"),
                lang: req.header("accept-language")
            }, (err, visit) => {
                if (err) {
                    console.log(err)
                }
                res.redirect(linkDoc.original_link)
            })
        })
    })

router.get("/:id/view",
    linkIdParamsValidate,
    flashMessageProvideToRender,
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
            res.render("links/elem", { link: linkDoc })
        })
    })

router.get("/:id/stats",
    ensureNotAuthenticated,
    (req, res, next) => {
        res.send("Will render statistic of link")
    })

module.exports = router;
