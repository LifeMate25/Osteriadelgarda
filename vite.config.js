import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:         resolve(__dirname, 'index.html'),
        menu:         resolve(__dirname, 'menu.html'),
        storia:       resolve(__dirname, 'storia.html'),
        prenotazioni: resolve(__dirname, 'prenotazioni.html'),
      }
    }
  }
})
