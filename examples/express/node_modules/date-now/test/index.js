var test = require("tape")
var now = require("../index")

test("date", function (assert) {
    var ts = now()
    var ts2 = Date.now()
    assert.equal(ts, ts2)
    assert.end()
})
