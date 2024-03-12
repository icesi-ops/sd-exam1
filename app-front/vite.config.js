import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

const replacePlugin = () => {
    return {
        name: "html-inject-env",
        transformIndexHtml: (html) => {
            return html.replace(
                "<!-- ENV -->",
                `<script src="./config/front.env.js"></script>`
            );
        },
    };
};

export default defineConfig({
  base: "/",
  plugins: [react(),replacePlugin()],
  preview: {
   port: 8080,
   strictPort: true,
  },
  server: {
   port: 8080,
   strictPort: true,
   host: true,
   origin: "http://0.0.0.0:8080",
  },

 });