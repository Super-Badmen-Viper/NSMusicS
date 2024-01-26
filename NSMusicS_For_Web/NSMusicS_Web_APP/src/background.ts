import { app, BrowserWindow,webFrame } from 'electron'

async function createWindow() {
    const win = await new BrowserWindow({
        width: 1000,
        // minWidth: 300,//移动端
        minWidth:1080,//PC端
        minHeight: 720,
        frame:false,
        resizable: true,

        // 配置窗口的WebPreferences选项，用于控制渲染进程的行为
        webPreferences: {
            nodeIntegration: true, // 启用Node.js集成
            contextIsolation: false, // 禁用上下文隔离
            webSecurity: false, // 禁用web安全策略
        },
    })
    win.setMenu(null)
    // 设置窗口是否可以由用户手动最大化。
    win.setMaximizable(false)

    // 禁用水平滚动条
    win.webContents.on('did-finish-load', () => {
        win.webContents.insertCSS(`
        ::-webkit-scrollbar {
            display: none;
        }
        `)
    })

    // 根据命令行参数加载URL或本地文件
    if (process.argv[2]) {
        win.loadURL(process.argv[2])
    } else {
        win.loadFile('index.html')
    }

    const electron = require('electron')
    const ipc = electron.ipcMain
    //登录窗口最小化
    ipc.on('window-min', function () {
        win.minimize();
    })
    //登录窗口最大化
    ipc.on('window-max', function () {
    if (win.isMaximized()) {
        win.restore();
    } else {
        win.setMaximizable(true);
        win.maximize();
        win.setMaximizable(false);
    }
    })
    ipc.on('window-close', function () {
        win.close();
    })

    // 注册事件监听
    webFrame.executeJavaScript(`
        document.addEventListener('mouseout', (event) => {
        window.postMessage({ type: 'mouseout', x: event.clientX, y: event.clientY }, '*');
        });
    `);
}

// 等待Electron应用就绪后创建BrowserWindow窗口
app.whenReady().then(() => {
    createWindow();
    
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })