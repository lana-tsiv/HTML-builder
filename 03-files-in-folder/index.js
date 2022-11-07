const fs = require("fs");
const path = require("path");
const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath, (err, files) => {
  if (err) console.log(err);

  for (const file of files) {
    const info = path.parse(file);

    fs.stat(path.resolve(folderPath, file), (err, stats) => {
      if (err) console.log(err);

      if (stats.isFile()) {
        const size = (stats.size / 1024).toFixed(3);
        console.log(
          info.name + "-" + info.ext.replace(".", "") + "-" + size + "kb"
        );
      }
    });
  }
});
