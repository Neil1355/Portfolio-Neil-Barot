import "dotenv/config";
import app from "../api/index.js";

const PORT = Number(process.env.PORT) || 3001;

/**
 * Starts the local Express API server.
 */
function startServer() {
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

startServer();
