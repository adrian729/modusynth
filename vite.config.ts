import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/modusynth/',
    plugins: [react(), tailwindcss()],
    resolve: { alias: { src: path.resolve(__dirname, 'src') } },
    server: { port: 4400 },
});
