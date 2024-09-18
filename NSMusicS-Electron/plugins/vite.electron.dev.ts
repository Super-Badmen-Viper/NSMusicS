// 导入需要使用的类型和库
import type { Plugin } from 'vite'
import type { AddressInfo } from 'net'
import { spawn } from 'child_process'
import fs from 'fs'

// 导出Vite插件函数
export const viteElectronDev = (): Plugin => {
    return {
        name: 'vite-electron-dev',
        // 在configureServer中实现插件的逻辑
        configureServer(server) {
            // 定义初始化Electron的函数
            const initElectron = () => {
                // 使用esbuild编译TypeScript代码为JavaScript
                require('esbuild').buildSync({
                    entryPoints: ['src/background.ts'],
                    bundle: true,
                    outfile: 'dist/background.js',
                    platform: 'node',
                    target: 'node12',
                    external: ['electron']
                })
            }

            // 调用初始化Electron函数
            initElectron()

            // 监听Vite的HTTP服务器的listening事件
            server?.httpServer?.once('listening', () => {
                // 获取HTTP服务器的监听地址和端口号
                const addressInfo = server?.httpServer?.address() as AddressInfo
                const IP = `http://localhost:${addressInfo.port}`
                // 启动Electron进程
                let electronProcess = spawn(require('electron'), ['dist/background.js', IP])

                // 监听主进程代码的更改
                fs.watchFile('src/background.ts', () => {
                    // 杀死当前的Electron进程
                    electronProcess.kill()
                    // 重新编译主进程代码并重新启动Electron进程
                    initElectron()
                    electronProcess = spawn(require('electron'), ['dist/background.js', IP])
                })

                // 监听Electron进程的stdout输出
                electronProcess.stdout?.on('data', (data) => {
                    console.log(`日志: ${data}`);
                });
            })
        }
    }
}
