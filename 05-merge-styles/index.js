const fs = require("fs");
const path = require("path");
const styles = path.join(__dirname, "styles");
const dist = path.join(__dirname, "project-dist", "bundle.css");

const stream = fs.createWriteStream(dist, "utf-8");

fs.readdir(styles, { withFileTypes: true, encoding: "utf-8" }, (err, files) => {
  if (err) console.log(err);
  for (const file of files) {
    if (file.isFile() && path.parse(file.name).ext == ".css") {
      const filePath = path.join(styles, file.name);
      const rs = fs.createReadStream(filePath);
      rs.pipe(stream);
    }
  }
});