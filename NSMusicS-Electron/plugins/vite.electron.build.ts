import type { Plugin } from 'vite'
import * as electronBuilder from 'electron-builder'
import path from 'path'
import fs from 'fs'

// 导出Vite插件函数
export const viteElectronBuild = (): Plugin => {
  return {
    name: 'vite-electron-build',
    // closeBundle是Vite的一个插件钩子函数，用于在Vite构建完成后执行一些自定义逻辑。
    closeBundle() {
      // 定义初始化Electron的函数
      const initElectron = () => {
        // 使用esbuild编译TypeScript代码为JavaScript
        require('esbuild').buildSync({
          entryPoints: ['src/background.ts'],
          bundle: true,
          outfile: 'dist/background.js',
          platform: 'node',
          target: 'node12',
          external: ['electron'],
        })
      }

      // 调用初始化Electron函数
      initElectron()

      // 修改package.json文件的main字段 不然会打包失败
      const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
      json.main = 'background.js'
      fs.writeSync(fs.openSync('dist/package.json', 'w'), JSON.stringify(json, null, 2))

      // 创建一个空的node_modules目录 不然会打包失败
      fs.mkdirSync(path.join(process.cwd(), 'dist/node_modules'))

      // 使用electron-builder打包Electron应用程序
      electronBuilder.build({
        config: {
          appId: 'github.com.nsmusics.xiang.cheng',
          productName: 'NSMusicS',
          directories: {
            output: path.join(process.cwd(), 'release'), //输出目录
            app: path.join(process.cwd(), 'dist'), //app目录
          },
          asar: true,
          win: {
            target: 'nsis',
            icon: 'resources/config/NSMusicS.ico',
            artifactName: '${productName}-Win-${version}-${arch}.${ext}',
          },
          //, 'pacman',

          // deb:
          // ubuntu
          // sudo apt update
          // sudo apt install gnome-software
          // sudo apt install ruby ruby-dev build-essential
          // sudo gem install fpm

          // icon
          // resources/config/png: sudo chmod 0644 *
          linux: {
            target: ['AppImage', 'deb'],
            icon: 'resources/config/NSMusicS.icns',
            desktop: {
              Icon: '/usr/share/icons/hicolor/512x512/apps/nsmusics.png',
            },
            category: 'Audio',
            maintainer: 'Xiang Cheng 1774148579@qq.com',
            artifactName: '${productName}-Linux-${version}-${arch}.${ext}',
          },
          // arch -x86_64 zsh
          // arch -arm64 zsh
          // node -p "process.arch"
          // 如需在arm架构上编译 arch -x86_64
          // -> ’arch -x86_64 zsh‘ + 重新创建拉取新项目(可命名为_x64) + 在新项目重新下载所有开发环境
          // -> 所有指令前加sudo
          // -> npm i
          // -> npm rebuild:手动原生编译node组件
          // -> npm run dev
          // -> npm run build
          //
          // node环境管理混乱，使用nvm管理nodejs版本与对应的架构
          // arch -x86_64 zsh
          // arch -arm64 zsh
          // nvm安装脚本下载，给该文件权限
          // chmod +x nvm.sh
          // 然后在下载目录执行以下命令
          // sh nvm.sh
          // 加载激活nvm环境设置
          // export NVM_DIR="$HOME/.nvm"
          // [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
          // [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
          // 安装一个临时版本，切换到临时版本
          // nvm install 18 --arch=x64
          // nvm use 18
          // 2. 卸载当前版本，切换到其他版本后，可以卸载当前版本：
          // nvm uninstall 22.13.0
          // 或者卸载所有 LTS 版本：
          // nvm uninstall --lts
          // 3.手动指定架构，重装是最方便快捷的办法
          // NVM_ARCH=x64 nvm install --lts
          // NVM_ARCH=arm64 nvm install --lts
          // 4.安装完成后，运行以下命令验证 Node.js 的架构：
          // node -p "process.arch"
          // 5.再次打包，很显然这没有github工作流方便，但是涉及到原生编译的情况，github工作流可能并非好使
          mac: {
            target: 'dmg',
            icon: 'resources/config/NSMusicS.icns',
            artifactName: '${productName}-Mac-${version}-${arch}.${ext}',
          },
          nsis: {
            oneClick: false,
            perMachine: true,
            allowElevation: true,
            allowToChangeInstallationDirectory: true,
            installerIcon: 'resources/config/NSMusicS.ico',
            uninstallerIcon: 'resources/config/NSMusicS.ico',
            installerHeaderIcon: 'resources/config/NSMusicS.ico',
            createDesktopShortcut: true,
            createStartMenuShortcut: true,
            shortcutName: 'NSMusicS',
          },
          extraResources: {
            from: './resources/',
            to: '',
          },
        },
      })
    },
  }
}
