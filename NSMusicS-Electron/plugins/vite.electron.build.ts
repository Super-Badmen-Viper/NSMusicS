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
            const json =  JSON.parse(fs.readFileSync('package.json', 'utf-8')) 
            json.main = 'background.js'
            fs.writeSync(fs.openSync('dist/package.json', 'w'), JSON.stringify(json, null, 2))

            // 创建一个空的node_modules目录 不然会打包失败
            fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));

            // 使用electron-builder打包Electron应用程序
            electronBuilder.build({
                config: {
                    appId: 'github.com.nsmusics.xiang.cheng',
                    productName: 'NSMusicS',
                    directories: {
                        output: path.join(process.cwd(), "release"), //输出目录
                        app: path.join(process.cwd(), "dist"), //app目录
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
                        desktop:{
                            Icon:"/usr/share/icons/hicolor/512x512/apps/nsmusics.png"
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
                        shortcutName: 'NSMusicS'
                    },
                    extraResources: {
                        from: './resources/',
                        to: ''
                    },
                }
            });
        }
    }
}
