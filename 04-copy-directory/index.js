const path = require("path");
const fs = require("fs/promises");

const filesPath = path.join(__dirname, "files");
const copyPath = path.join(__dirname, "files-copy");

fs.rm(copyPath, {
  force: true,
  recursive: true,
}).then(() => {
  fs.mkdir(copyPath, {
    recursive: true,
  });

  fs.readdir(filesPath, { withFileTypes: true }).then((files) => {
    for (const file of files) {
      if (file.isFile()) {
        const pathFile = path.join(filesPath, file.name);
        const pathFileCopied = path.join(copyPath, file.name);
        fs.copyFile(pathFile, pathFileCopied);
      }
    }
  });
});