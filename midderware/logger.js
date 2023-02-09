module.exports = function (req, res, next) {
    console.log("New Request")
    console.log(req.userAgent)
    next()
}