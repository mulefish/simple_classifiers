const Reset = "\x1b[0m";
// const Bright = "\x1b[1m";
// const Dim = "\x1b[2m";
// const Underscore = "\x1b[4m";
// const Blink = "\x1b[5m";
// const Reverse = "\x1b[7m";
// const Hidden = "\x1b[8m";

const FgBlack = "\x1b[30m";
// const FgRed = "\x1b[31m";
// const FgGreen = "\x1b[32m";
// const FgYellow = "\x1b[33m";
// const FgBlue = "\x1b[34m";
// const FgMagenta = "\x1b[35m";
// const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

// const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
// const BgBlue = "\x1b[44m";
// const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
// const BgWhite = "\x1b[47m";

function yellow(msg) {
    const type = typeof msg
    if (type === "object") {
        const x = BgYellow + FgBlack + JSON.stringify(msg, null, 2) + Reset;
        console.log(x)
    } else {
        const x = BgYellow + FgBlack + msg + Reset;
        console.log(x)
    }
}

function red(msg) {
    const type = typeof msg
    if (type === "object") {
        const x = BgRed + FgWhite + JSON.stringify(msg, null, 2) + Reset;
        console.log(x)
    } else {
        const x = BgRed + FgWhite + msg + Reset;
        console.log(x)
    }
}


function green(msg) {
    const type = typeof msg
    if (type === "object") {
        const x = BgGreen + FgBlack + JSON.stringify(msg, null, 2) + Reset;
        console.log(x)
    } else {
        const x = BgGreen + FgBlack + msg + Reset;
        console.log(x)
    }
}


function cyan(msg) {
    const type = typeof msg
    if (type === "object") {
        const x = BgCyan + FgBlack + JSON.stringify(msg, null, 2) + Reset;
        console.log(x)
    } else {
        const x = BgCyan + FgBlack + msg + Reset;
        console.log(x)
    }
}

function log(msg) {
    console.log(msg)
}


function getExcelLikeLetter(str) {
    if (str === undefined) {
        return "A"
    }
    let index = str.length - 1;
    let baseCode = str.charCodeAt(index);
    do {
        baseCode = str.charCodeAt(index);
        let strArr = str.split("");
        if (strArr[index] == "Z") {
            strArr[index] = "A";
            if (index == 0) {
                strArr.unshift("A");
            }
        }
        else {
            strArr[index] = String.fromCharCode(baseCode + 1);
        }
        str = strArr.join("");
        index--;
    } while (baseCode == 90)
    return str;
}


function verdict(a, b, msg) {
    if ( JSON.stringify(a) === JSON.stringify(b)) {
        yellow("PASS:" + msg)
        return true
    } else {
        red("FAIL: " + msg)
        return false
    }
}
module.exports = { yellow, red, green, cyan, log, getExcelLikeLetter, verdict }

// https://www.geeksforgeeks.org/naive-bayes-classifiers/