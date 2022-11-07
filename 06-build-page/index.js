const fs = require("fs");
const path = require("path");
const fsPromises = require("fs/promises");

const folderPath = path.join(__dirname, "project-dist");
const folderToAssets = path.join(folderPath, "assets");
const folderFromAssets = path.join(__dirname, "assets");
const buildPath = path.join(folderPath, "style.css");
const pathToStyles = path.join(__dirname, "styles");

const generateHtml = async () => {
  const template = await fsPromises.readFile(
    path.join(__dirname, "template.html"),
    "utf-8",
    (err) => {
      if (err) throw err;
    }
  );

  for (const elem of template.match(/\{\{+[a-w]+}}/g)) {
    const component = await fsPromises.readFile(
      path.join(__dirname, "components", `${elem.slice(2, -2)}.html`),
      "utf-8",
      (err) => {
        if (err) throw err;
      }
    );

    const file = template.replace(`${elem}`, `${component}`);

    await fsPromises.writeFile(path.join(folderPath, "index.html"), file);
  }
};

const generateCss = async () => {
  fsPromises
    .readdir(pathToStyles, { withFileTypes: true })
    .then((files) => {
      fsPromises.writeFile(buildPath, "").then(() => {
        for (const file of files) {
          if (file.isFile() && path.extname(file.name) === ".css") {
            const filePath = path.join(pathToStyles, file.name);
            fsPromises.readFile(filePath).then((data) => {
              fsPromises
                .appendFile(buildPath, data)
                .catch((err) => console.log(err));
            });
          }
        }
      });
    });
};

const copyFolder = (folderFromAssets, folderToAssets) => {
  fs.readdir(folderFromAssets, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      if (file.isDirectory()) {
        fs.rm(
          `${folderToAssets}/${file.name}`,
          { recursive: true, force: true },
          (err) => {
            if (err) throw err;
            fs.mkdir(
              `${folderToAssets}/${file.name}`,
              { recursive: true },
              (err) => {
                if (err) throw err;
                copyFolder(
                  `${folderFromAssets}/${file.name}`,
                  `${folderToAssets}/${file.name}`
                );
              }
            );
          }
        );
      } else {
        fs.copyFile(
          `${folderFromAssets}/${file.name}`,
          `${folderToAssets}/${file.name}`,
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      }
    }
  });
};

fsPromises.rm(folderPath, { recursive: true, force: true }).then(() => {
  fsPromises
    .mkdir(folderPath, { recursive: true })
    .then(() => generateHtml())
    .then(() => generateCss())
    .then(() => copyFolder(folderFromAssets, folderToAssets))
    .catch((err) => console.log(err));
});