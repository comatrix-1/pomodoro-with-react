import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Move inlined script from <head> to end of <body> and remove type="module".
// Inline <script defer> is ignored by browsers (defer only works with src attribute),
// so the script must be placed after <div id="root"> to ensure the DOM is ready.
function fixInlineScript(): Plugin {
  let outDir = "dist";
  return {
    name: "fix-inline-script",
    enforce: "post",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const htmlPath = resolve(outDir, "index.html");
      let html = readFileSync(htmlPath, "utf-8");
      // Extract the <script> block from <head>
      const scriptMatch = html.match(/<script type="module" crossorigin>([\s\S]*?)<\/script>/);
      if (scriptMatch) {
        const scriptContent = scriptMatch[1];
        // Remove the script from <head>
        html = html.replace(scriptMatch[0], "");
        // Insert plain <script> right before </body>
        html = html.replace("</body>", `<script>${scriptContent}</script>\n  </body>`);
      }
      writeFileSync(htmlPath, html);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile(), fixInlineScript()],
  build: {
    assetsInlineLimit: 100000,
    emptyOutDir: true,
  },
});
