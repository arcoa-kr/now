import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { watch } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const clients = new Set();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const liveReloadScript = `
<script>
  (() => {
    const source = new EventSource("/__arcoa_reload");

    source.addEventListener("reload", () => {
      window.location.reload();
    });
  })();
</script>
`;

const isInsideRoot = (filePath) => {
  return filePath === root || filePath.startsWith(root + sep);
};

const reloadBrowsers = () => {
  clients.forEach((client) => {
    client.write("event: reload\\ndata: now\\n\\n");
  });
};

let reloadTimer;

watch(root, { recursive: true }, (eventType, filename) => {
  if (!filename) {
    return;
  }

  const changedFile = String(filename).replaceAll("\\\\", "/");

  if (
    changedFile.startsWith(".git/") ||
    changedFile.startsWith("node_modules/")
  ) {
    return;
  }

  clearTimeout(reloadTimer);

  reloadTimer = setTimeout(() => {
    console.log("Updated:", changedFile);
    reloadBrowsers();
  }, 120);
});

createServer(async (request, response) => {
  const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);

  if (requestPath === "/__arcoa_reload") {
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream"
    });

    response.write("\\n");
    clients.add(response);

    request.on("close", () => {
      clients.delete(response);
    });

    return;
  }

  const relativePath = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const filePath = normalize(join(root, relativePath));

  if (!isInsideRoot(filePath)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const extension = extname(filePath);
    let body = await readFile(filePath);

    if (extension === ".html") {
      const html = body.toString("utf8");

      body = Buffer.from(
        html.includes("</body>")
          ? html.replace("</body>", `${liveReloadScript}</body>`)
          : `${html}${liveReloadScript}`,
        "utf8"
      );
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeTypes[extension] || "application/octet-stream"
    });

    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(4173, "127.0.0.1", () => {
  console.log("ARCOA preview: http://127.0.0.1:4173");
  console.log("Live reload: enabled");
});
