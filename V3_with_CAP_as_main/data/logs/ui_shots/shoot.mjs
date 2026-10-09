// Usage: node shoot.mjs "name|url|width,height|waitMs[|fullpage]" ...
// Captures each page with headless Chrome in real time (animations run as they do for a user).
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = dirname(fileURLToPath(import.meta.url));
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9333;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = spawn(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--user-data-dir=${join(out, "chrome_profile_cdp")}`, `--remote-debugging-port=${port}`, "about:blank"], { stdio: "ignore" });

async function target() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const page = pages.find((entry) => entry.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // Chrome is still starting.
    }
    await sleep(200);
  }
  throw new Error("Chrome did not start");
}

const socket = new WebSocket(await target());
await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
let nextId = 1;
const waiting = new Map();
socket.addEventListener("message", (message) => {
  const data = JSON.parse(message.data);
  if (data.id && waiting.has(data.id)) {
    waiting.get(data.id)(data.result ?? data.error);
    waiting.delete(data.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = nextId++;
    waiting.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });

for (const shot of process.argv.slice(2)) {
  const [name, url, size, wait = "3000", full = ""] = shot.split("|");
  const [width, height] = size.split(",").map(Number);
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: "about:blank" });
  await sleep(150);
  await send("Page.navigate", { url });
  await sleep(Number(wait));
  const script = await send("Runtime.evaluate", { expression: process.env.SHOT_EVAL || "''", returnByValue: true });
  if (process.env.SHOT_EVAL) console.log(`${name} eval:`, JSON.stringify(script.result?.value));
  const image = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: full === "full" });
  writeFileSync(join(out, `${name}.png`), Buffer.from(image.data, "base64"));
  console.log(`${name}: ${Buffer.from(image.data, "base64").length} bytes`);
}

socket.close();
browser.kill();
