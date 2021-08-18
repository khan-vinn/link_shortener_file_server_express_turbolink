const { Visit } = require("../models");

async function visitCreate(req, id) {
    await Visit.create({
        belongs_to: id,
        ip_addr: req.ip,
        client: req.get("user-agent"),
        lang: req.header("accept-language")
    })
}

module.exports = { visitCreate }