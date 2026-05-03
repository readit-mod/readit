import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chokidar from "chokidar";
import httpServer from "http-server";
import { buildReadIt } from "./build";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

type BuildMode = "userscript" | "bundle";

async function isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const tester = net
            .createServer()
            .once("error", () => resolve(false))
            .once("listening", () => tester.close(() => resolve(true)))
            .listen(port);
    });
}

async function getAvailablePort(defaultPort: number, argvPort?: string): Promise<number> {
    let port = argvPort ? parseInt(argvPort, 10) : defaultPort;
    while (!(await isPortAvailable(port))) {
        port++;
    }
    return port;
}

async function serveReadIt(mode: BuildMode) {
    const port = await getAvailablePort(8080, process.argv[3]);
    console.log(`Serving ReadIt on port ${port}`);

    const server = httpServer.createServer({
        root: path.resolve(root, "dist"),
    });

    server.listen(port, () => {
        console.log(`HTTP server is listening on http://localhost:${port}`);
    });

    const build = async () => {
        console.log("Detected changes, rebuilding...");
        await buildReadIt(mode);
        console.log("Rebuild complete!");
    };

    chokidar
        .watch(path.resolve(root, "src"), {
            ignoreInitial: true,
        })
        .on("all", build);
}

serveReadIt(process.argv[2] as BuildMode);
