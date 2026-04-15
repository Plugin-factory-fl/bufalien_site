import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project pages live under `/{repo}/`. Set `VITE_BASE=/repo-name/` in CI. */
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
});
