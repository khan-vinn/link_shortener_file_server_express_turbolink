const express = require('express');
const dns = require("dns");
const { ensureNotAuthenticated, flashMessageProvideToRender } = require('./middleware');
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
        res.send("will post link")
    })

router.get("/:id", (req, res, next) => {
    res.send("will redirect to original link")
})

router.get("/:id/stats",
    ensureNotAuthenticated,
    (req, res, next) => {
        res.send("Will render statistic of link")
    })

module.exports = router;
