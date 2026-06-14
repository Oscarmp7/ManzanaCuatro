import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Single deploy target: Vercel (root base). The old GitHub Pages dual-target
// was removed because BrowserRouter routing never supported the subpath.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
