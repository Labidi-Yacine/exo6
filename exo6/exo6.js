const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // Récupération de l'URL demandée
  const requestedUrl = req.url;
  // Construction du chemin absolu vers le fichier demandé en utilisant la méthode path.join()
  console.log("__dirname =", __dirname);
  const filePath = path.join(__dirname, requestedUrl);
  console.log("filePath =", filePath);
  ////////////

  // Vérification si le fichier existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Si le fichier n'existe pas, renvoyer une réponse 404 avec le contenu de 404.html
      fs.readFile("404.html", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal server error");
        } else {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else {
      // Si le fichier existe, renvoyer son contenu avec le type MIME approprié
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal server error");
        } else {
          const contentType = getContentType(filePath);
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
    }
  });
});

// Fonction qui retourne le type MIME correspondant à une extension de fichier
function getContentType(filePath) {
  const extension = path.extname(filePath);
  console.log("extension =", extension);
  switch (extension) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
      
    default:
      return "text/plain";
  }
}

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});