import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "/",
    plugins: [react(), tailwindcss()],
    server: {
        watch: {
            // Build replaces these generated trees; source QA keeps HMR.
            ignored: ["**/public/r/**", "**/public/examples/**"],
        },
    },
});
