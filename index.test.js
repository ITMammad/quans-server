const quans = require("./index");

quans.server.init(12345, "127.0.0.1", (question) => {
    const txt = question.question.toString();
    if (txt === "Can I Login?") {
        question.answer("Yes");
    } else if (txt === "Can I Logout?") {
        question.answer("No");
    } else {
        question.answer("Bad Request!");
    }
});

const client = quans.client.init(12345, "127.0.0.1");
client.ask("Can I Login?", (answer) => {
    console.log(answer.toString());
});
client.ask("Can I Logout?", (answer) => {
    console.log(answer.toString());
});