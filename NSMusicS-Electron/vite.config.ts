import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

import { fileURLToPath, URL } from 'node:url'
import {viteElectronDev} from './plugins/vite.electron.dev'
import {viteElectronBuild} from './plugins/vite.electron.build'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue({ template: { compilerOptions: { hoistStatic: false } } }),
      viteElectronDev(),
      viteElectronBuild(),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ],
    base: './',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.BACKEND_SERVICE || 'http://localhost:8082',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    }
  };
});