import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const PORT = parseInt(process.env.PORT || "5000");

const app = next({ dev, hostname, port: PORT });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    await app.prepare();
    
    const { createServer } = await import("http");
    const server = createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("internal server error");
      }
    });

    server.listen(PORT, () => {
      console.log(`Next.js app ready on http://${hostname}:${PORT}`);
      console.log('The Universal One School platform running');
      console.log(`Main landing page: http://${hostname}:${PORT}`);
      console.log('Stage prep link: /schools/secondary-school');
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

startServer();