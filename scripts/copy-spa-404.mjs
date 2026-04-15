import fs from "node:fs";

/**
 * GitHub Pages serves 404.html for unknown paths — copy the SPA shell so deep links work.
 */
fs.copyFileSync("dist/index.html", "dist/404.html");
