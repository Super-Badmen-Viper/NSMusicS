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
                        icon: 'resources/config/NSMusicS.ico'
                    },
                    linux: {
                        target: 'AppImage',
                        icon: 'resources/config/NSMusicS.png'
                    },
                    mac: {
                        target: 'dmg',
                        icon: 'resources/config/NSMusicS.png'
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
