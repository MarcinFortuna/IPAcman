import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), viteTsconfigPaths(), eslint()],
// });

export default defineConfig({
  plugins: [
      react(),
      viteTsconfigPaths(),
    { // default settings on build (i.e. fail on error)
      ...eslint(),
      apply: 'build',
    },
    { // do not fail on serve (i.e. local development)
      ...eslint({
        failOnWarning: false,
        failOnError: false,
      }),
      apply: 'serve',
      enforce: 'post'
    }
  ],
});
