import { app, BrowserWindow,dialog, Menu  } from 'electron'
import { readFileSync } from 'fs';
import path from 'path';

app.commandLine.appendSwitch('disable-http-cache');
Menu.setApplicationMenu(null)

async function createWindow() {
    const win = await new BrowserWindow({
        width: 1180,
        height: 760,
        // minWidth: 300,//移动端
        minWidth:1180,//PC端
        minHeight: 760,
        frame:false,
        resizable: true,

        // 配置窗口的WebPreferences选项，用于控制渲染进程的行为
        webPreferences: {
            nodeIntegration: true, // 启用Node.js集成
            contextIsolation: false, // 上下文隔离
            webSecurity: false, // web安全策略：开启则不能访问本机路径的文件
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
    // 去除警告：Policy set or a policy with “unsafe-eval“ enabled. 
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
    // 根据命令行参数加载URL或本地文件
    if (process.argv[2]) {
        win.loadURL(process.argv[2])
    } else {
        win.loadFile('index.html')
    }
    // Open the DevTools.
    win.webContents.openDevTools({
        mode:'bottom'
    });

    const electron = require('electron')
    const ipc = electron.ipcMain
    ipc.on('window-min', function () {
        win.minimize();
    })
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
    
    ipc.on('open-music-file', (event) => {
        dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Music', extensions: ['mp3', 'flac'] }]
        }).then((res) => {
            // 拿到结果
            const { canceled, filePaths } = res
            if (!canceled && filePaths.length) {
                event.sender.send('selected-file', filePaths)
            }
        }).catch(err => {
            // 错误
        })
    }); 
    ipc.handle('readFile', async (event, filePath) => {
        return readFileSync(filePath);
    });

    // ipc.handle('readDB', (event, params) => {
    //   let {
    //     media_page_num,
    //     media_page_size,
    //     media_file_count,
    //     media_page_length,
    //     columnKey,
    //     order,
    //     keyword
    //   } = params;      
    //   const media_Files_temporary: any[] = []
      
    //   const path = require('path');
    //   const Database = require('better-sqlite3');
    //   let db = null;
  
    //   try {
    //     db = new Database(path.resolve('resources/navidrome.db'), { verbose: console.log });
    //     db.pragma('journal_mode = WAL');
  
    //     const offset = (media_page_num - 1) * media_page_size;
    //     const sortKey = columnKey.length > 0 && order !== 'default' ?
    //       columnKey : 'id';
    //     const sortOrder = columnKey.length > 0 && order !== 'default' ?
    //       order.replace('end', '') : '';
  
    //     const keywordFilter = keyword.length > 0 ?
    //       `WHERE title LIKE '%${keyword}%' OR artist LIKE '%${keyword}%' OR album LIKE '%${keyword}%'` :
    //       '';
  
    //     const stmt_media_file = db.prepare(`
    //       SELECT id, title, artist, album, duration, path 
    //       FROM media_file 
    //       ${keywordFilter}
    //       ORDER BY ${sortKey} ${sortOrder}
    //       LIMIT ${media_page_size} 
    //       OFFSET ${offset}
    //     `);
  
    //     const stmt_album = db.prepare('SELECT * FROM album LIMIT 1');
    //     const rows = stmt_media_file.all();
    //     const imagefiles = stmt_album.all();
  
    //     for (const row of rows) {
    //       row.duration_txt = formatTime(row.duration);
    //       const medium_image_url = row.path.replace('mp3', 'jpg');
    //       if (imagefiles[0].image_files.indexOf(medium_image_url) > 0)
    //         row.medium_image_url = medium_image_url;
    //       else
    //         row.medium_image_url = '../../../resources/error_album.jpg';
    //       media_Files_temporary.push(row);
    //     }
  
    //     const stmt_media_file_count = db.prepare('SELECT COUNT(*) AS count FROM media_file');
    //     media_file_count = stmt_media_file_count.get().count;
    //     if (media_file_count != null)
    //       media_page_length = Math.floor(media_file_count / media_page_size) + 1;
  
    //     media_Files_temporary.forEach((item: { absoluteIndex: any }, index: number) => {
    //       item.absoluteIndex = index + offset + 1;
    //     });
    //   } catch (err: any) {
    //     console.error(err);
    //   } finally {
    //     if (db) {
    //       db.close();
    //       console.log('db.close().......');
    //       console.log('db.open?:' + db.open);
    //       db = null;
    //     }
      
    //     return { media_Files_temporary, media_page_length }
    //   }
    // });
    // function formatTime(currentTime: number): string {
    //     const minutes = Math.floor(currentTime / 60);
    //     const seconds = currentTime % 60;

    //     let formattedMinutes = String(minutes);
    //     let formattedSeconds = String(seconds);

    //     if(formattedMinutes.length == 1)
    //         formattedMinutes = '0' + formattedMinutes;
    //     formattedMinutes = formattedMinutes.replace('.','');
    //     formattedMinutes = formattedMinutes.substring(0, 2);

    //     formattedSeconds = formattedSeconds.substring(0,formattedSeconds.indexOf('.'));
    //     if(formattedSeconds.length == 1)
    //         formattedSeconds = '0' + formattedSeconds;
    //     formattedSeconds = formattedSeconds.substring(0, 2);

    //     return `${formattedMinutes}:${formattedSeconds}`;
    // }
}

// 等待Electron应用就绪后创建BrowserWindow窗口
app.whenReady().then(() => {
    createWindow(); 

    const devInnerHeight: number = 1080.0; // 开发时的 InnerHeight
    const devDevicePixelRatio: number = 1.0; // 开发时的 device pixel ratio
    const devScaleFactor: number = 1.3; // 开发时的 ScaleFactor
    const scaleFactor: number = require('electron').screen.getPrimaryDisplay().scaleFactor;
    const zoomFactor: number = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor);
    require('electron').webFrame.setZoomFactor(zoomFactor);
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  