module.exports = async function (ctx, params) {
    console.log('demo 1')
    var a = await getValue();
    console.log(a)

    console.log("1.2")
}

function getValue() {
    return "1.1"
}