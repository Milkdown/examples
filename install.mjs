import { exec } from "child_process";
import fs from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const exampleDirs = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."));

await Promise.all(
  exampleDirs.map(async (dir) => {
    const { name } = dir;
    const path = resolve(__dirname, name);
    console.log(`[${name}]: Start install.`);
    const { stderr } = await promisify(exec)(
      `cd ${path} && pnpm dedupe && pnpm install`
    );
    if (stderr) console.error(stderr);
    console.log(`[${name}]: Install complete.`);
  })
);
