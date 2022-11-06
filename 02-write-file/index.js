const fs = require("fs");
const path = require("path");
const { stdout, stdin, exit } = require("process");

const stream = fs.createWriteStream(path.join(__dirname, "text.txt"));

const exitFunc = () => {
  stdout.write("Goodbye!");
  exit();
};

stdout.write("Enter your text:");

stdin.on("data", (text) => {
  if (text.toString().trim() === "exit") exitFunc();
  stream.write(text);
});
