/// node-system
import { File } from 'node-taglib-sharp'
import fs from 'fs'
const path = require('path')
const os = require('os')

/// electron
import {
  app,
  BrowserWindow,
  screen,
  globalShortcut,
  Tray,
  Menu,
  nativeImage,
  nativeTheme,
} from 'electron'
const electron = require('electron')
const ipc = electron.ipcMain
const { session } = require('electron')
const context_MainWin = {
  allowQuitting: false,
  mainWindow: null,
}
const showWindow = (mainWindow: any) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show()
    mainWindow.focus()
  }
}
const hideWindow = (mainWindow: any) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (process.platform === 'darwin' && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false)
      mainWindow.once('leave-full-screen', () => {
        mainWindow.hide()
      })
    } else {
      mainWindow.hide()
    }
  }
}
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('ready', async () => {
    globalShortcut.register('Ctrl+Alt+Shift+T', () => {
      if (context_MainWin.mainWindow.webContents.isDevToolsOpened()) {
        context_MainWin.mainWindow.webContents.closeDevTools()
      } else {
        context_MainWin.mainWindow.webContents.openDevTools({
          mode: 'detach',
        })
      }
    })

    await createWindow()

    try {
      await createTray()
      tray_loading_state = true
    } catch (e) {
      tray_loading_state = false
      console.log('托盘创建失败: ' + e)
    }

    app.on('activate', () => {
      if (context_MainWin.mainWindow === undefined) {
        createWindow()
      } else {
        showWindow(context_MainWin.mainWindow)
      }
    })

    await initNodeMpv()
    await createNodeMpv()

    await initModifyMediaTag()

    context_MainWin.mainWindow.webContents.setZoomFactor(1)

    setTimeout(clearSessionClearCache, 5000)
  })
}
app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (context_MainWin.mainWindow) {
    showWindow(context_MainWin.mainWindow)
  }
})
app.on('before-quit', () => (context_MainWin.allowQuitting = true))
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    try {
      if (mpv != undefined) {
        if (mpv.isRunning()) {
          await mpv.quit()
        }
      }
    } catch {}
    app.quit()
  }
})

/// electron-gc
async function clearSessionClearCache() {
  await session.defaultSession.clearCache()
  require('v8').setFlagsFromString('--expose_gc')
  global.gc = require('vm').runInNewContext('gc')
}

/// electron-tray
let tray_loading_state = false
let tray_music_play = false
let tray_music_order = 'playback-1'
let tray_menu_label_music = 'NSMusicS | 九歌'
let tray_menu_label_music_check_enter = false
async function createTray() {
  /// icon
  const createResizedIcon = (iconPath, width, height) => {
    if (!nativeTheme.shouldUseDarkColors) {
      return nativeImage
        .createFromPath(iconPath.replace(/\.png$/, '_Dark.png'))
        .resize({ width, height })
    } else {
      return nativeImage.createFromPath(iconPath).resize({ width, height })
    }
  }
  /// Tray
  let tray = null
  if (process.platform === 'win32') {
    tray = new Tray(path.join(resourcesPath, 'config/NSMusicS.ico'))
  } else if (process.platform === 'darwin') {
    tray = new Tray(
      nativeImage
        .createFromPath(path.join(resourcesPath, 'config/png/256x256.png'))
        .resize({ width: 16, height: 16 })
    )
  } else if (process.platform === 'linux') {
    tray = new Tray(path.join(resourcesPath, 'config/png/256x256.png'))
  }
  let playIcon = createResizedIcon(path.join(resourcesPath, 'icons/Play.png'), 18, 18)
  let pauseIcon = createResizedIcon(path.join(resourcesPath, 'icons/Pause.png'), 22, 22)
  let prevIcon = createResizedIcon(path.join(resourcesPath, 'icons/PlaySkipBack.png'), 16, 16)
  let nextIcon = createResizedIcon(path.join(resourcesPath, 'icons/PlaySkipForward.png'), 16, 16)
  let lyricIcon = createResizedIcon(path.join(resourcesPath, 'icons/Lyric.png'), 16, 16)
  let musicIcon = createResizedIcon(path.join(resourcesPath, 'icons/MusicalNotes 1.png'), 16, 16)
  let shutIcon = createResizedIcon(path.join(resourcesPath, 'icons/ShutDown.png'), 16, 16)
  let order1Icon = createResizedIcon(
    path.join(resourcesPath, 'icons/ArrowAutofitDown24Regular.png'),
    18,
    18
  )
  let order2Icon = createResizedIcon(
    path.join(resourcesPath, 'icons/ArrowRepeatAll16Regular.png'),
    18,
    18
  )
  let order3Icon = createResizedIcon(
    path.join(resourcesPath, 'icons/SingleTuneirculation.png'),
    16,
    16
  )
  let order4Icon = createResizedIcon(path.join(resourcesPath, 'icons/Shuffle.png'), 17, 17)
  function get_tray_Icon() {
    playIcon = createResizedIcon(path.join(resourcesPath, 'icons/Play.png'), 18, 18)
    pauseIcon = createResizedIcon(path.join(resourcesPath, 'icons/Pause.png'), 22, 22)
    prevIcon = createResizedIcon(path.join(resourcesPath, 'icons/PlaySkipBack.png'), 16, 16)
    nextIcon = createResizedIcon(path.join(resourcesPath, 'icons/PlaySkipForward.png'), 16, 16)
    lyricIcon = createResizedIcon(path.join(resourcesPath, 'icons/Lyric.png'), 16, 16)
    musicIcon = createResizedIcon(path.join(resourcesPath, 'icons/MusicalNotes 1.png'), 16, 16)
    shutIcon = createResizedIcon(path.join(resourcesPath, 'icons/ShutDown.png'), 16, 16)
    order1Icon = createResizedIcon(
      path.join(resourcesPath, 'icons/ArrowAutofitDown24Regular.png'),
      18,
      18
    )
    order2Icon = createResizedIcon(
      path.join(resourcesPath, 'icons/ArrowRepeatAll16Regular.png'),
      18,
      18
    )
    order3Icon = createResizedIcon(
      path.join(resourcesPath, 'icons/SingleTuneirculation.png'),
      16,
      16
    )
    order4Icon = createResizedIcon(path.join(resourcesPath, 'icons/Shuffle.png'), 17, 17)
  }
  /// label
  let tray_menu_label_play = '播放'
  let tray_menu_label_pause = '暂停'
  let tray_menu_label_next = '下一首'
  let tray_menu_label_prev = '上一首'
  let tray_menu_label_lyric = '桌面歌词'
  let tray_menu_label_shut = '退出'
  let tray_menu_label_order1 = '顺序播放'
  let tray_menu_label_order2 = '循环播放'
  let tray_menu_label_order3 = '单曲播放'
  let tray_menu_label_order4 = '随机播放'
  /// tray load
  function get_tray_template() {
    return [
      {
        label: get_tray_truncateText(tray_menu_label_music, 10),
        click: () => {
          showWindow(context_MainWin.mainWindow)
        },
        icon: musicIcon,
      },
      { type: 'separator' },
      {
        label: String(tray_menu_label_prev),
        click: () => {
          if (tray_loading_state) {
            tray_menu_label_music_check_enter = true
            context_MainWin.mainWindow.webContents.send('tray-music-prev', true)
          }
        },
        icon: prevIcon,
      },
      {
        label: String(tray_menu_label_pause),
        click: () => {
          if (tray_loading_state) {
            context_MainWin.mainWindow.webContents.send('tray-music-pause', tray_music_play)
          }
        },
        icon: pauseIcon,
      },
      {
        label: String(tray_menu_label_next),
        click: () => {
          if (tray_loading_state) {
            tray_menu_label_music_check_enter = true
            context_MainWin.mainWindow.webContents.send('tray-music-next', true)
          }
        },
        icon: nextIcon,
      },
      { type: 'separator' },
      {
        label: String(tray_menu_label_order1),
        icon: order1Icon,
        submenu: [
          {
            label: String(tray_menu_label_order1),
            click: () => {
              if (tray_loading_state) {
                tray_template[6].icon = order1Icon
                tray_music_order = 'playback-1'
                context_MainWin.mainWindow.webContents.send('tray-music-order', tray_music_order)
              }
            },
            icon: order1Icon,
          },
          {
            label: String(tray_menu_label_order2),
            click: () => {
              if (tray_loading_state) {
                tray_template[6].icon = order2Icon
                tray_music_order = 'playback-2'
                context_MainWin.mainWindow.webContents.send('tray-music-order', tray_music_order)
              }
            },
            icon: order2Icon,
          },
          {
            label: String(tray_menu_label_order3),
            click: () => {
              if (tray_loading_state) {
                tray_template[6].icon = order3Icon
                tray_music_order = 'playback-3'
                context_MainWin.mainWindow.webContents.send('tray-music-order', tray_music_order)
              }
            },
            icon: order3Icon,
          },
          {
            label: String(tray_menu_label_order4),
            click: () => {
              if (tray_loading_state) {
                tray_template[6].icon = order4Icon
                tray_music_order = 'playback-4'
                context_MainWin.mainWindow.webContents.send('tray-music-order', tray_music_order)
              }
            },
            icon: order4Icon,
          },
        ],
      },
      { type: 'separator' },
      // {
      //     label: String(tray_menu_label_lyric),
      //     click: () => {
      //
      //     },
      //     icon: lyricIcon
      // },
      { type: 'separator' },
      {
        label: String(tray_menu_label_shut),
        click: async () => {
          try {
            context_MainWin.mainWindow.webContents.send('tray-app-quit')
            if (mpv != undefined) {
              if (mpv.isRunning()) {
                await mpv.quit()
              }
            }
          } catch {
          } finally {
            app.quit()
          }
        },
        icon: shutIcon,
      },
    ]
  }
  function get_tray_truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...'
    }
    return text
  }
  let tray_template = get_tray_template()
  let trayContextMenu = Menu.buildFromTemplate(tray_template)
  tray.on('click', () => {
    showWindow(context_MainWin.mainWindow)
  })
  tray.on('right-click', () => {
    get_tray_Icon()

    tray_template[3].icon = !tray_music_play ? playIcon : pauseIcon
    tray_template[3].label = !tray_music_play ? tray_menu_label_play : tray_menu_label_pause
    if (tray_music_order === 'playback-1') {
      tray_template[6].icon = order1Icon
      tray_template[6].label = tray_menu_label_order1
    } else if (tray_music_order === 'playback-2') {
      tray_template[6].icon = order2Icon
      tray_template[6].label = tray_menu_label_order2
    } else if (tray_music_order === 'playback-3') {
      tray_template[6].icon = order3Icon
      tray_template[6].label = tray_menu_label_order3
    } else if (tray_music_order === 'playback-4') {
      tray_template[6].icon = order4Icon
      tray_template[6].label = tray_menu_label_order4
    }

    trayContextMenu.clear()
    trayContextMenu = Menu.buildFromTemplate(tray_template)
    tray.popUpContextMenu(trayContextMenu)
  })
  ipc.handle('i18n-tray-label-musicIcon', async (event, current_music_name) => {
    tray_menu_label_music = get_tray_truncateText(current_music_name, 18)
    tray_template[0].label = tray_menu_label_music
    trayContextMenu.clear()
    trayContextMenu = Menu.buildFromTemplate(tray_template)
    tray.setToolTip(tray_menu_label_music)
  })
  ipc.handle('i18n-tray-music-pause', async (event, music_play) => {
    tray_music_play = music_play
  })
  ipc.handle('i18n-tray-music-order', async (event, order) => {
    tray_music_order = String(order)
  })
  ipc.handle('i18n-tray-label-menu', async (event, i18n_menu_label) => {
    try {
      tray_menu_label_play = String(i18n_menu_label[0])
      tray_menu_label_pause = String(i18n_menu_label[1])
      tray_menu_label_prev = String(i18n_menu_label[2])
      tray_menu_label_next = String(i18n_menu_label[3])
      tray_menu_label_lyric = String(i18n_menu_label[4])
      tray_menu_label_shut = String(i18n_menu_label[5])
      tray_menu_label_order1 = String(i18n_menu_label[6])
      tray_menu_label_order2 = String(i18n_menu_label[7])
      tray_menu_label_order3 = String(i18n_menu_label[8])
      tray_menu_label_order4 = String(i18n_menu_label[9])

      get_tray_Icon()
      tray_template = get_tray_template()
      trayContextMenu.clear()
      trayContextMenu = Menu.buildFromTemplate(tray_template)
    } catch (e) {
      console.error(e)
    }
  })
}

/// electron-window-normal
let originalBounds: any = null
let isFullscreen = false
async function createWindow() {
  /// init BrowserWindow
  if (process.platform != 'darwin') {
    context_MainWin.mainWindow = await new BrowserWindow({
      width: 1100,
      height: 720,
      minWidth: 1100,
      minHeight: 720,
      frame: false,
      resizable: true,
      alwaysOnTop: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
      },
    })
  } else {
    context_MainWin.mainWindow = await new BrowserWindow({
      width: 1100,
      height: 720,
      minWidth: 1100,
      minHeight: 720,
      frame: false,
      resizable: true,
      alwaysOnTop: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
      },
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 6, y: 12 },
    })
  }

  context_MainWin.mainWindow.on('close', (event) => {
    if (!context_MainWin.allowQuitting) {
      event.preventDefault()
      hideWindow(context_MainWin.mainWindow)
    } else {
      context_MainWin.mainWindow = undefined
    }
  })
  context_MainWin.mainWindow.setMenu(null)
  context_MainWin.mainWindow.setMaximizable(false)
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
  if (process.argv[2]) {
    context_MainWin.mainWindow.loadURL(process.argv[2])
  } else {
    context_MainWin.mainWindow.loadFile('index.html')
  }
  ///
  ipc.handle('window-get-node-env', async (event) => {
    return process.env.NODE_ENV === 'development'
  })
  /// electron
  ipc.on('window-min', function () {
    context_MainWin.mainWindow.minimize()
  })
  ipc.on('window-max', function () {
    if (isFullscreen) {
      context_MainWin.mainWindow.setBounds(originalBounds)
      originalBounds = null
      isFullscreen = false
      context_MainWin.mainWindow.restore()
    } else if (context_MainWin.mainWindow.isMaximized()) {
      isFullscreen = false
      context_MainWin.mainWindow.restore()
    } else {
      isFullscreen = false
      context_MainWin.mainWindow.maximize()
    }
  })
  ipc.on('window-fullscreen', function () {
    if (isFullscreen) {
      context_MainWin.mainWindow.setBounds(originalBounds)
      originalBounds = null
      isFullscreen = false
    } else {
      context_MainWin.mainWindow.restore()
      originalBounds = context_MainWin.mainWindow.getBounds()

      const cursorScreenPoint = screen.getCursorScreenPoint()
      const currentDisplay = screen.getDisplayNearestPoint(cursorScreenPoint)
      const { width, height, x, y } = currentDisplay.bounds

      context_MainWin.mainWindow.setBounds({
        x: x - 1,
        y: y - 1,
        width: width + 2,
        height: height + 2,
      })
      isFullscreen = true
    }
  })
  ipc.on('window-close', function () {
    if (process.platform === 'win32') {
      hideWindow(context_MainWin.mainWindow)
    } else if (process.platform === 'darwin') {
      hideWindow(context_MainWin.mainWindow)
    } else if (process.platform === 'linux') {
      app.quit()
    }
  })
  ipc.on('window-gc', function () {
    context_MainWin.mainWindow.webContents.session.flushStorageData()
    setTimeout(clearSessionClearCache, 5000)
  })
  let lastResetTime: number | null = null
  const RESET_DEBOUNCE_TIME = 6000
  ipc.on('window-reset-data', function () {
    const currentTime = Date.now()
    if (!lastResetTime || currentTime - lastResetTime >= RESET_DEBOUNCE_TIME) {
      lastResetTime = currentTime
      context_MainWin.mainWindow.webContents.loadURL('about:blank')
      if (process.argv[2]) {
        context_MainWin.mainWindow.loadURL(process.argv[2])
      } else {
        context_MainWin.mainWindow.loadFile('index.html')
      }
    }
  })
  ipc.on('window-reset-context.mainWindow', function () {
    context_MainWin.mainWindow.close()
    createWindow()
  })
  ipc.on('window-reset-all', () => {
    app.relaunch()
    app.exit()
  })

  ipc.handle('window-get-memory', async (event) => {
    try {
      return process.memoryUsage()
    } catch {
      return 0
    }
  })
  ipc.handle('window-get-system-theme', async (event) => {
    try {
      if (!nativeTheme.shouldUseDarkColors) {
        return 'lightTheme'
      } else {
        return 'darkTheme'
      }
    } catch {
      return 'lightTheme'
    }
  })

  /// db get
  ipc.handle('window-init-db', async (event) => {
    try {
      await initSqlite3()
      return true
    } catch {
      return false
    }
  })
  ipc.handle('window-get-navidrome-db', async (event) => {
    try {
      return navidrome_db
    } catch {
      return ''
    }
  })
  ipc.handle('window-get-nsmusics-db', async (event) => {
    try {
      return nsmusics_db
    } catch {
      return ''
    }
  })

  /// local model of data
  ipc.handle('window-get-imagePath', (event, imagePath) => {
    try {
      // clear file://
      const filePath = decodeURIComponent(imagePath.replace(/^file:\/\//, '').replace(/^\/+/, ''))
      if (fs.existsSync(filePath)) {
        return filePath
      }

      const coverFiles = [
        'cover.jpg',
        'cover.png',
        'cover.jpeg',
        'cover.gif',
        'cover.bmp',
        'cover.svg',
      ]
      for (const coverFile of coverFiles) {
        const coverPath = path.join(dir, coverFile)
        if (fs.existsSync(coverPath)) {
          return coverPath
        }
      }

      const commonImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg']
      const dir = path.dirname(filePath)
      const baseName = path.basename(filePath, path.extname(filePath))
      for (const ext of commonImageExtensions) {
        const newPath = path.join(dir, `${baseName}${ext}`)
        if (fs.existsSync(newPath)) {
          return newPath
        }
      }

      const files = fs.readdirSync(dir)
      for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (
          stat.isFile() &&
          commonImageExtensions.some((ext) => file.toLowerCase().endsWith(ext))
        ) {
          if (fs.existsSync(filePath)) {
            return filePath
          }
        }
      }

      const medium_image_url = `${driveTempPath}/${encodeURIComponent(
        imagePath
          .split(/[\\/]/)
          .pop()
          .replace(/\.(mp3|flac)$/i, '.jpg')
      )}`
      console.log(medium_image_url)
      if (fs.existsSync(medium_image_url)) return filePath
      else return ''
    } catch {
      return ''
    }
  })
  ipc.handle('window-get-LyricPath', (event, mediaPath) => {
    try {
      const filePath = decodeURIComponent(mediaPath.replace(/^file:\/\//, '').replace(/^\/+/, ''))
      const dir = path.dirname(filePath)
      const baseName = path.basename(filePath, path.extname(filePath))
      const lrcPath = path.join(dir, `${baseName}.lrc`)
      if (fs.existsSync(lrcPath)) {
        const lrcContent = fs.readFileSync(lrcPath, 'utf-8')
        return lrcContent
      }
      const files = fs.readdirSync(dir)
      for (const file of files) {
        if (file.toLowerCase().endsWith('.lrc')) {
          const filePath = path.join(dir, file)
          if (fs.existsSync(filePath)) {
            const lrcContent = fs.readFileSync(filePath, 'utf-8')
            return lrcContent
          }
        }
      }
      return ''
    } catch (error) {
      console.error('Error handling window-get-LyricPath:', error)
      return ''
    }
  })
  ipc.handle('library-select-folder', async (event) => {
    const { dialog } = require('electron')
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    if (result.canceled) {
      return null
    } else {
      return result.filePaths[0]
    }
  })
  ipc.handle('node-taglib-sharp-get-directory-filePath', async (event, data: any) => {
    cover_model = data.cover
    file_name_model = data.file_name_model
    const folderPaths = [data.folderPath]
    console.log('Received directoryPath:')
    try {
      await Set_ReadLocalMusicInfo_Add_LocalSqlite(folderPaths)
      percentage = 100
      return 'Processing completed, percentage set to 100'
    } catch (e) {
      percentage = 0
      console.error(e)
      return ('Error processing directoryPath:', e)
    }
  })
  ipc.handle('node-taglib-sharp-percentage', async (event) => {
    try {
      return percentage
    } catch {
      return 0
    }
  })
  ipc.handle('node-taglib-sharp-clear', async (event) => {
    try {
      async function deleteFolder() {
        const files = fs.readdirSync(driveTempPath)
        for (const file of files) {
          const filePath = path.join(driveTempPath, file)
          fs.unlinkSync(filePath)
          await new Promise((resolve) => setTimeout(resolve, 0)) // 让出事件循环
        }
        fs.rmdirSync(driveTempPath)
        console.log('文件夹删除成功:', driveTempPath)
      }
      deleteFolder().catch((err) => {
        console.error('删除文件夹失败:', err)
      })
    } catch {
      return false
    }
  })
  ipc.handle('reset-nsmusics-use-data', async (event) => {
    try {
      const resourcesPath =
        process.env.NODE_ENV === 'development'
          ? path.resolve('resources')
          : path.join(process.resourcesPath)
      const platform = os.platform()
      if (platform === 'win32') {
        fs.copyFile(path.join(resourcesPath, 'nsmusics.db'), driveDbPath_2, (copyErr) => {})
      } else if (platform === 'linux') {
        const linuxDbDir = path.join(os.homedir(), '.NSMusicS') // Linux 路径
        fs.copyFile(
          path.join(resourcesPath, 'nsmusics.db'),
          path.join(linuxDbDir, 'nsmusics.db'),
          (copyErr) => {}
        )
      } else if (platform === 'darwin') {
        const macosDbDir = path.join(os.homedir(), 'Applications', 'NSMusicS') // macOS 路径
        fs.copyFile(
          path.join(resourcesPath, 'nsmusics.db'),
          path.join(macosDbDir, 'nsmusics.db'),
          (copyErr) => {}
        )
      }
      await initSqlite3()
    } catch {
      return false
    }
  })
}
/// electron-window-miniplayer
ipc.on('window-state-miniplayer-open', function () {
  context_MainWin.mainWindow.setResizable(false)
  context_MainWin.mainWindow.setAlwaysOnTop(true, 'screen-saver')
  context_MainWin.mainWindow.setVisibleOnAllWorkspaces(true)
  context_MainWin.mainWindow.setMinimumSize(346, 620)
  const { x, y } = context_MainWin.mainWindow.getBounds()
  context_MainWin.mainWindow.setBounds({
    x: x,
    y: y,
    width: 346,
    height: 620,
  })
  context_MainWin.mainWindow.setOpacity(1)
  isFullscreen = false
})
ipc.on('window-state-miniplayer-hidden', function () {
  context_MainWin.mainWindow.setResizable(true)
  context_MainWin.mainWindow.setAlwaysOnTop(false)
  context_MainWin.mainWindow.setVisibleOnAllWorkspaces(false)
  context_MainWin.mainWindow.setMinimumSize(1100, 720)
  const { x, y } = context_MainWin.mainWindow.getBounds()
  context_MainWin.mainWindow.setBounds({
    x: x,
    y: y,
    width: 1100,
    height: 720,
  })
  context_MainWin.mainWindow.setOpacity(1)
})
ipc.handle('window-state-miniplayer-show', async (event) => {
  const { x, y } = context_MainWin.mainWindow.getBounds()
  context_MainWin.mainWindow.setMinimumSize(346, 620)
  context_MainWin.mainWindow.setBounds({
    x: x,
    y: y,
    width: 346,
    height: 620,
  })
  context_MainWin.mainWindow.setOpacity(1)
})
ipc.handle('window-state-miniplayer-card-show', async (event) => {
  context_MainWin.mainWindow.setMinimumSize(346, 150)
  const { x, y } = context_MainWin.mainWindow.getBounds()
  context_MainWin.mainWindow.setBounds({
    x: x,
    y: y,
    width: 346,
    height: 150,
  })
  context_MainWin.mainWindow.setOpacity(1)
})
ipc.handle('window-state-miniplayer-desktop-lyric-show', async (event) => {
  context_MainWin.mainWindow.setMinimumSize(1100, 200)
  const { x, y } = context_MainWin.mainWindow.getBounds()
  context_MainWin.mainWindow.setBounds({
    x: x,
    y: y,
    width: 1100,
    height: 200,
  })
  context_MainWin.mainWindow.setOpacity(0.75)
})
ipc.handle('window-state-miniplayer-album-show', async (event) => {
  context_MainWin.mainWindow.setMinimumSize(346, 334)
  const { x, y } = context_MainWin.mainWindow.getBounds()
  context_MainWin.mainWindow.setBounds({
    x: x,
    y: y,
    width: 346,
    height: 334,
  })
  context_MainWin.mainWindow.setOpacity(1)
})

/// node-mpv
const mpvAPI = require('node-mpv')
let mpv = null

/// node-db-sqlite3
const resourcesPath =
  process.env.NODE_ENV === 'development'
    ? path.resolve('resources')
    : path.join(process.resourcesPath)
let navidrome_db = path.join(resourcesPath, 'navidrome.db')
let nsmusics_db = path.join(resourcesPath, 'nsmusics.db')
const driveDbPath_1 = 'C:\\Users\\Public\\Documents\\NSMusicS\\navidrome.db'
const driveDbPath_2 = 'C:\\Users\\Public\\Documents\\NSMusicS\\nsmusics.db'
let driveDbPath = 'C:\\Users\\Public\\Documents\\NSMusicS'
const driveTempPath = 'C:\\Users\\Public\\Documents\\NSMusicS\\temp'
async function initSqlite3() {
  try {
    if (process.platform === 'win32') {
      const ensureDirectoryExists = (dirPath: string) => {
        return new Promise((resolve, reject) => {
          if (!fs.existsSync(dirPath)) {
            try {
              fs.mkdirSync(dirPath, { recursive: true })
              console.log(`目录 ${dirPath} 已创建`)
              resolve()
            } catch (err) {
              reject(err)
            }
          } else {
            resolve()
          }
        })
      }
      const copyIfNotExists = (sourcePath: string, destPath: string) => {
        return new Promise((resolve, reject) => {
          ensureDirectoryExists(driveDbPath) // 确保目标文件夹存在
            .then(() => {
              fs.access(destPath, fs.constants.F_OK, (err) => {
                if (err) {
                  fs.copyFile(sourcePath, destPath, (copyErr) => {
                    if (copyErr) {
                      reject(copyErr)
                    } else {
                      resolve(destPath)
                    }
                  })
                } else {
                  resolve(destPath)
                }
              })
            })
            .catch((err) => {
              reject(err)
            })
          ensureDirectoryExists(driveTempPath) // 确保目标文件夹存在
            .then(() => {
              fs.access(destPath, fs.constants.F_OK, (err) => {
                if (err) {
                  fs.copyFile(sourcePath, destPath, (copyErr) => {
                    if (copyErr) {
                      reject(copyErr)
                    } else {
                      resolve(destPath)
                    }
                  })
                } else {
                  resolve(destPath)
                }
              })
            })
            .catch((err) => {
              reject(err)
            })
        })
      }
      await ensureDirectoryExists(driveDbPath) // 确保目标文件夹存在
        .then(async () => {
          await Promise.all([
            copyIfNotExists(path.join(resourcesPath, 'navidrome.db'), driveDbPath_1).then(
              (newPath) => (navidrome_db = newPath)
            ),
            copyIfNotExists(path.join(resourcesPath, 'nsmusics.db'), driveDbPath_2).then(
              (newPath) => (nsmusics_db = newPath)
            ),
          ]).catch((err) => {
            console.error('复制文件时出错:', err)
          })
        })
        .catch((err) => {
          console.error('创建目录时出错:', err)
        })
    } else if (process.platform === 'darwin') {
      const ensureDirectoryExists = (dirPath: string) => {
        return new Promise((resolve, reject) => {
          if (!fs.existsSync(dirPath)) {
            try {
              fs.mkdirSync(dirPath, { recursive: true })
              console.log(`目录 ${dirPath} 已创建`)
              resolve()
            } catch (err) {
              reject(err)
            }
          } else {
            resolve()
          }
        })
      }
      const copyIfNotExists = (sourcePath: string, destPath: string) => {
        return new Promise((resolve, reject) => {
          ensureDirectoryExists(path.dirname(destPath)) // 确保目标文件夹存在
            .then(() => {
              fs.access(destPath, fs.constants.F_OK, (err) => {
                if (err) {
                  fs.copyFile(sourcePath, destPath, (copyErr) => {
                    if (copyErr) {
                      reject(copyErr)
                    } else {
                      resolve(destPath)
                    }
                  })
                } else {
                  resolve(destPath)
                }
              })
            })
            .catch((err) => {
              reject(err)
            })
        })
      }
      const initializeSqlite = async () => {
        try {
          // const targetDir = path.join(os.homedir(), 'Library', 'Application Scripts', 'NSMusicS');
          // const sourceDir = path.join(os.homedir(), 'Applications', 'NSMusicS');
          // if (!fs.existsSync(targetDir)) {
          //     fs.mkdirSync(targetDir, { recursive: true, mode: 0o755 }); // 设置文件夹权限为 755
          //     console.log(`目标文件夹已创建: ${targetDir}`);
          // } else {
          //     console.log(`目标文件夹已存在: ${targetDir}`);
          // }
          // if (fs.existsSync(sourceDir)) {
          //     const files = fs.readdirSync(sourceDir);
          //     if (files.length > 0) {
          //         console.log(`原文件夹中有文件，开始迁移...`);
          //         files.forEach((file) => {
          //             const sourceFile = path.join(sourceDir, file);
          //             const targetFile = path.join(targetDir, file);
          //             fs.renameSync(sourceFile, targetFile);
          //             console.log(`已移动文件: ${file}`);
          //             fs.chmodSync(targetFile, 0o666);
          //             console.log(`已设置文件权限: ${file}`);
          //         });
          //         fs.rmdirSync(sourceDir);
          //         console.log(`原文件夹已删除: ${sourceDir}`);
          //     } else {
          //         console.log(`原文件夹为空，无需迁移。`);
          //     }
          // } else {
          //     console.log(`原文件夹不存在: ${sourceDir}`);
          // }
          // driveDbPath = targetDir;
          // console.log(`最终路径: ${driveDbPath}`);
          driveDbPath = path.join(os.homedir(), 'Applications', 'NSMusicS')

          await ensureDirectoryExists(driveDbPath)

          const resourcesPath =
            process.env.NODE_ENV === 'development'
              ? path.resolve('resources')
              : path.join(process.resourcesPath)

          await Promise.all([
            copyIfNotExists(
              path.join(resourcesPath, 'navidrome.db'),
              path.join(driveDbPath, 'navidrome.db')
            ).then((newPath) => console.log(`navidrome.db 已复制到 ${newPath}`)),
            copyIfNotExists(
              path.join(resourcesPath, 'nsmusics.db'),
              path.join(driveDbPath, 'nsmusics.db')
            ).then((newPath) => console.log(`nsmusics.db 已复制到 ${newPath}`)),
          ])

          console.log('初始化资源完成')
        } catch (err) {
          console.error('初始化资源出错:', err)
        }
      }
      await initializeSqlite()
    } else if (process.platform === 'linux') {
      const ensureDirectoryExists = (dirPath: string) => {
        return new Promise((resolve, reject) => {
          if (!fs.existsSync(dirPath)) {
            try {
              fs.mkdirSync(dirPath, { recursive: true })
              console.log(`目录 ${dirPath} 已创建`)
              resolve()
            } catch (err) {
              reject(err)
            }
          } else {
            resolve()
          }
        })
      }
      const copyIfNotExists = (sourcePath: string, destPath: string) => {
        return new Promise((resolve, reject) => {
          ensureDirectoryExists(path.dirname(destPath)) // 确保目标文件夹存在
            .then(() => {
              fs.access(destPath, fs.constants.F_OK, (err) => {
                if (err) {
                  fs.copyFile(sourcePath, destPath, (copyErr) => {
                    if (copyErr) {
                      reject(copyErr)
                    } else {
                      resolve(destPath)
                    }
                  })
                } else {
                  resolve(destPath)
                }
              })
            })
            .catch((err) => {
              reject(err)
            })
        })
      }
      const initializeLinuxResources = async () => {
        try {
          // 定义 Linux 上的目标目录
          const linuxDbDir = path.join(os.homedir(), '.NSMusicS') // 使用用户主目录下的隐藏文件夹
          await ensureDirectoryExists(linuxDbDir)

          const resourcesPath =
            process.env.NODE_ENV === 'development'
              ? path.resolve('resources')
              : path.join(process.resourcesPath)

          await Promise.all([
            copyIfNotExists(
              path.join(resourcesPath, 'navidrome.db'),
              path.join(linuxDbDir, 'navidrome.db')
            ).then((newPath) => console.log(`navidrome.db 已复制到 ${newPath}`)),
            copyIfNotExists(
              path.join(resourcesPath, 'nsmusics.db'),
              path.join(linuxDbDir, 'nsmusics.db')
            ).then((newPath) => console.log(`nsmusics.db 已复制到 ${newPath}`)),
          ])

          console.log('Linux 资源初始化完成')
        } catch (err) {
          console.error('Linux 资源初始化出错:', err)
        }
      }

      await initializeLinuxResources()
    }
  } catch {
    navidrome_db = path.join(resourcesPath, 'navidrome.db')
    nsmusics_db = path.join(resourcesPath, 'nsmusics.db')
  }
}

/// node-mpv init
let currentMediaPath = ''
let currentFade = 0
let currentVolume = 0
let currentParameters = null
let isPlaying = false
async function initNodeMpv() {
  if (process.platform === 'win32') {
    mpv = new mpvAPI({
      audio_only: true,
      auto_restart: true,
      binary: path.resolve('resources/mpv-x86_64-20241124/mpv.exe'),
      debug: true,
      verbose: true,
    })
  } else if (process.platform === 'darwin') {
    const resourcesPath =
      process.env.NODE_ENV === 'development'
        ? path.resolve('resources')
        : path.join(process.resourcesPath)
    mpv = new mpvAPI({
      audio_only: true,
      auto_restart: true,
      binary: path.resolve(path.join(resourcesPath, 'mpv-0.39.0/mpv.app/Contents/MacOS', 'mpv')),
      debug: true,
      verbose: true,
    })
  } else if (process.platform === 'linux') {
  }
  if (mpv != undefined) {
    await mpv.start()
    await mpv.pause()
    mpv.on('stopped', () => {
      context_MainWin.mainWindow.webContents.send('mpv-stopped', true)
    })
  }
}
async function createNodeMpv() {
  ////// mpv services for context_MainWin.mainWindow
  ipc.handle('mpv-init', async (event, filePath) => {
    await initNodeMpv()
  })
  ipc.handle('mpv-quit', async (event, filePath) => {
    try {
      if (mpv != undefined) {
        if (mpv.isRunning()) {
          await mpv.pause()
          isPlaying = false
          if (tray_loading_state) {
            tray_music_play = false
            context_MainWin.mainWindow.webContents.send('tray-music-pause', tray_music_play)
          }
          ///
          ///
          await mpv.quit()
        }
      }
    } catch {}
    isPlaying = false
  })
  ipc.handle('mpv-fade', async (event, fade) => {
    currentFade = fade !== 0 ? fade / 1000 : 0
  })
  ipc.handle('mpv-parameters', async (event, parameters: any) => {
    currentParameters = parameters
    if (currentParameters.player_samp_value < 8000) {
      currentParameters.player_samp_value = 48000
    }
  })
  ipc.handle('mpv-load', async (event, filePath) => {
    try {
      if (fadeIntervalId !== null) {
        clearInterval(fadeIntervalId)
      }
      if (currentMediaPath === filePath && tray_menu_label_music_check_enter) {
        tray_menu_label_music_check_enter = false
      } else {
        currentMediaPath = filePath
        await mpv.load(filePath)

        const properties: Record<string, any> = {
          'audio-channels': currentParameters.player_audio_channel,
          'gapless-audio': currentParameters.player_gaplessAudio, // no, yes, weak
          'audio-samplerate':
            currentParameters.player_samp_value === 0
              ? undefined
              : currentParameters.player_samp_value,
          'audio-exclusive': currentParameters.player_audioExclusiveMode ? 'yes' : 'no', // no, yes
          replaygain: currentParameters.player_replayGainMode, // "track" | "album" | "no"
          'replaygain-preamp': currentParameters.player_replayGainPreamp,
          'replaygain-clip': currentParameters.player_replayGainClip ? 'yes' : 'no', // no, yes
          'replaygain-fallback': currentParameters.player_replayGainFallback,
        }
        currentParameters.player_mpvExtraParameters.split('\n').forEach((prop: string) => {
          const [key, value] = prop.split('=')
          if (key && value) {
            properties[key] = isNaN(Number(value)) ? value : Number(value)
          }
        })
        mpv.setMultipleProperties(properties)

        await mpv.play()
        isPlaying = true
        tray_music_play = true

        // if(currentFade !== 0){
        //     await startFadeIn(currentVolume)
        // }
      }
      return true
    } catch (error) {
      console.error('Error loading file in mpv:', error)
      return false
    }
  })
  ipc.handle('mpv-isPlaying', async (event) => {
    return isPlaying
  })
  ipc.handle('mpv-play', async (event) => {
    if (mpv != undefined && mpv.isRunning()) {
      await mpv.resume()
      isPlaying = true
      tray_music_play = true
    }
  })
  ipc.handle('mpv-pause', async (event) => {
    if (mpv != undefined && mpv.isRunning()) {
      await mpv.pause()
      isPlaying = false
      tray_music_play = false
    }
  })
  ipc.handle('mpv-stopped', async (event, volume) => {
    if (mpv != undefined && mpv.isRunning()) {
      await mpv.pause()
      tray_music_play = false
    }
  })
  ipc.handle('mpv-get-duration', async (event) => {
    try {
      if (mpv != undefined && mpv.isRunning()) return await mpv.getDuration()
      else return -1
    } catch {
      return -1
    }
  })
  ipc.handle('mpv-get-time-pos', async (event) => {
    try {
      if (mpv != undefined && mpv.isRunning()) return await mpv.getTimePosition()
      else return -1
    } catch {
      return -1
    }
  })
  ipc.handle('mpv-set-time-pos', async (event, timePos) => {
    if (mpv != undefined && mpv.isRunning()) {
      await mpv.resume()
      isPlaying = true
      await mpv.seek(timePos, 'absolute')
    }
  })
  ipc.handle('mpv-set-volume', async (event, volume) => {
    if (mpv != undefined && mpv.isRunning()) {
      await mpv.volume(volume)
      currentVolume = volume
    }
  })

  ////// 进程通信BUG，已禁用此淡入淡出效果 | 手动实现 mpv 播放/暂停 淡入淡出效果
  let fadeIntervalId = null
  ipc.handle('mpv-startFadeIn', async (event, volume) => {
    try {
      if (currentFade >= 1) {
        await startFadeIn(volume)
      } else {
        await mpv.resume()
        isPlaying = true
        tray_music_play = true
      }
    } catch {}
  })
  async function startFadeIn(play_volume: number) {
    if (fadeIntervalId !== null) {
      clearInterval(fadeIntervalId)
    }
    // 防止爆音
    setTimeout(async () => {
      await mpv.volume(0)
    }, 200)
    await mpv.resume()
    isPlaying = true
    tray_music_play = true
    const targetVolume = Number(play_volume)
    const stepVolume = targetVolume / ((currentFade * 1000) / 10)
    let currentVolume = 20
    fadeIntervalId = setInterval(async () => {
      currentVolume += stepVolume
      if (currentVolume >= targetVolume) {
        currentVolume = targetVolume
        clearInterval(fadeIntervalId)
        fadeIntervalId = null
      }
      await mpv.volume(currentVolume)
    }, 10)
  }
  ipc.handle('mpv-startFadeOut', async (event, volume) => {
    try {
      if (currentFade >= 1) {
        await startFadeOut(volume)
      } else {
        await mpv.pause()
        isPlaying = false
        tray_music_play = false
      }
    } catch {}
  })
  async function startFadeOut(play_volume: number) {
    if (fadeIntervalId !== null) {
      clearInterval(fadeIntervalId)
    }
    tray_music_play = false
    const currentVolume = Number(play_volume)
    const stepVolume = currentVolume / ((currentFade * 1000) / 10)
    let volume = currentVolume
    fadeIntervalId = setInterval(async () => {
      volume -= stepVolume
      if (volume <= 0) {
        volume = 0
        clearInterval(fadeIntervalId)
        fadeIntervalId = null
        await mpv.pause()
        isPlaying = false
        await mpv.volume(play_volume)
      }
      await mpv.volume(volume)
    }, 10)
  }
}

/// node-taglib-sharp tag
async function initModifyMediaTag() {
  ipc.handle('node-taglib-sharp-get-media-tag', async (event, _path) => {
    try {
      const taglibFile = File.createFromPath(_path)
      const tag = {
        path: _path,

        title: taglibFile.tag.title,
        albumArtists: taglibFile.tag.albumArtists,
        artist: taglibFile.tag.performers,
        album: taglibFile.tag.album,
        discCount: taglibFile.tag.discCount,
        trackCount: taglibFile.tag.trackCount,
        year: taglibFile.tag.year,
        genres: taglibFile.tag.genres,

        duration: formatTime(taglibFile.properties.durationMilliseconds / 1000 || 0),
        isCompilation: taglibFile.tag.isCompilation,
        codec: taglibFile.properties.codecs,
        audioBitrate: taglibFile.properties.audioBitrate,
        audioChannels: taglibFile.properties.audioChannels,
        sizeOnDisk: taglibFile.tag.sizeOnDisk,
        albumPeak: taglibFile.tag.replayGainAlbumPeak || undefined,
        trackPeak: taglibFile.tag.replayGainTrackPeak || undefined,

        comment: taglibFile.tag.comment,
        lyrics: taglibFile.tag.lyrics,
      }
      taglibFile.dispose()
      return tag
    } catch {
      return ''
    }
  })
  ipc.handle('node-taglib-sharp-set-media-tag', async (event, args) => {
    try {
      const { _path, _tag } = args
      if (_path != undefined && _path.length > 0) {
        const taglibFile = File.createFromPath(_path)
        taglibFile.tag.title = _tag.title
        taglibFile.tag.albumArtists = _tag.albumArtists
        taglibFile.tag.performers = _tag.artist
        taglibFile.tag.album = _tag.album
        taglibFile.tag.discCount = _tag.discCount
        taglibFile.tag.trackCount = _tag.trackCount
        taglibFile.tag.year = _tag.year
        taglibFile.tag.genres = _tag.genres
        taglibFile.tag.comment = _tag.comment
        taglibFile.tag.lyrics = _tag.lyrics
        taglibFile.save()
        taglibFile.dispose()
        //
        const Database = require('better-sqlite3')
        const db = new Database(navidrome_db, {
          nativeBinding: path.join(resourcesPath, 'better_sqlite3.node'),
        })
        db.pragma('journal_mode = WAL')
        // 处理 _tag.albumArtists 和 _tag.artist
        const albumArtistsStr = Array.isArray(_tag.albumArtists)
          ? _tag.albumArtists.join('、')
          : _tag.albumArtists || ''
        const artistStr = Array.isArray(_tag.artist) ? _tag.artist.join('、') : _tag.artist || ''
        const genresStr = Array.isArray(_tag.genres) ? _tag.genres.join('、') : _tag.genres || ''
        // table media_file
        const sql_media_file = `UPDATE media_file 
                    SET title = ?, album_artist = ?, artist = ?, album = ?, 
                        disc_number = ?, track_number = ?, 
                        year = ?, genre = ?, comment = ?, 
                        lyrics = ? 
                    WHERE path = ?`
        db.prepare(sql_media_file).run(
          _tag.title || '',
          albumArtistsStr,
          artistStr,
          _tag.album || '',
          _tag.discCount || 0,
          _tag.trackCount || 0,
          _tag.year || 0,
          genresStr,
          _tag.comment || '',
          _tag.lyrics || '',
          _path
        )
        db.close()
      }
    } catch (error) {
      console.error('Error setting media tag:', error)
      return false
    }
    return true
  })
  ipc.handle('node-taglib-sharp-get-media-path', async (event, _path) => {
    try {
      const isAbsolutePath = path.isAbsolute(_path)
      const isValidPath = path.parse(_path).root !== ''
      return isAbsolutePath && isValidPath
    } catch {
      return false
    }
  })
}
function formatTime(currentTime: number): string {
  const minutes = Math.floor(currentTime / 60)
  const seconds = Math.floor(currentTime % 60)

  let formattedMinutes = String(minutes)
  let formattedSeconds = String(seconds)

  if (formattedMinutes.length == 1) formattedMinutes = '0' + formattedMinutes

  if (formattedSeconds.length == 1) formattedSeconds = '0' + formattedSeconds

  return `${formattedMinutes}:${formattedSeconds}`
}
/// node-local-media-library
let percentage = 0
let cover_model = false
let file_name_model = true
async function Set_ReadLocalMusicInfo_Add_LocalSqlite(directoryPath: any[]) {
  const Database = require('better-sqlite3')
  const db = new Database(navidrome_db, {
    nativeBinding: path.join(resourcesPath, 'better_sqlite3.node'),
  })
  db.pragma('journal_mode = WAL')

  const directories: any[] = []
  directoryPath.forEach((_path) => {
    directories.push(walkDirectory(_path))
  })
  percentage = 10

  const allCommons: any[] = []
  for (const directory of directories) {
    for (const _path of directory) {
      try {
        const taglibFile = File.createFromPath(_path)
        allCommons.push({ taglibFile, _path })
      } catch (e) {
        console.error(e)
        const taglibFile: any = undefined
        allCommons.push({ taglibFile, _path })
      }
    }
  }
  percentage = 20

  const artistMap = new Map()
  const albumMap = new Map()
  const processChunk = (chunk) => {
    for (const { taglibFile, _path } of chunk) {
      try {
        // pic resource
        let medium_image_url_local = path.join(path.join(path.dirname(_path), 'cover') + '.jpg')
        if (!fs.existsSync(medium_image_url_local)) {
          medium_image_url_local = medium_image_url_local.replace('.jpg', '.png')
          if (!fs.existsSync(medium_image_url_local)) {
            medium_image_url_local = medium_image_url_local.replace('.png', '.jpeg')
            if (!fs.existsSync(medium_image_url_local)) {
              medium_image_url_local = ''
            }
          }
        }
        // tag import
        const result_file_name = extractArtistAndTitle(_path)
        let artistName = ''
        if (taglibFile.tag != undefined && taglibFile.tag.performers != undefined) {
          artistName =
            (taglibFile.tag.performers || []).join('、') || file_name_model
              ? (result_file_name?.artist ? result_file_name.artist.split('、') : []).join('、') ||
                'undefined'
              : result_file_name?.title || 'undefined'
        } else {
          artistName = file_name_model
            ? (result_file_name?.artist ? result_file_name.artist.split('、') : []).join('、') ||
              'undefined'
            : result_file_name?.title || 'undefined'
        }
        const albumName = taglibFile.tag.album || 'undefined'
        const artistId = artistName
        const albumId = `${artistName}-${albumName}`
        // album
        let album_artist = ''
        if (taglibFile.tag.albumArtists != undefined) {
          album_artist =
            taglibFile.tag.albumArtists || file_name_model
              ? result_file_name?.artist || 'undefined'
              : result_file_name?.title || 'undefined'
        } else {
          album_artist = file_name_model
            ? result_file_name?.artist || 'undefined'
            : result_file_name?.title || 'undefined'
        }
        const min_year = taglibFile.tag.year || ''
        const max_year = taglibFile.tag.year || ''
        const sort_album_name = taglibFile.tag.albumSort || ''
        const sort_artist_name = taglibFile.tag.albumArtistsSort || ''
        const sort_album_artist_name = taglibFile.tag.albumArtistsSort || ''
        const comment = taglibFile.tag.comment || ''
        const description = taglibFile.tag.description || ''
        // media
        let title = ''
        if (taglibFile.tag.performers != undefined) {
          title =
            taglibFile.tag.title ||
            (file_name_model
              ? result_file_name?.title || _path.match(/[^\\/]+$/) || 'undefined'
              : (result_file_name?.artist ? result_file_name.artist.split('、') : []).join('、') ||
                _path.match(/[^\\/]+$/) ||
                'undefined')
        } else {
          title = file_name_model
            ? result_file_name?.title || _path.match(/[^\\/]+$/) || 'undefined'
            : (result_file_name?.artist ? result_file_name.artist.split('、') : []).join('、') ||
              _path.match(/[^\\/]+$/) ||
              'undefined'
        }
        const track_number = taglibFile.tag.track || 0
        const disc_number = taglibFile.tag.discCount || ''
        const year = taglibFile.tag.year || ''
        const size = taglibFile.tag.sizeOnDisk || ''
        const duration = taglibFile.properties.durationMilliseconds / 1000 || 0
        const bit_rate = taglibFile.properties.audioBitrate || 0
        const genre = taglibFile.tag.genres || ''
        const compilation = taglibFile.tag.isCompilation || ''
        const sort_title = taglibFile.tag.titleSort || ''
        const disc_subtitle = taglibFile.tag.subtitle || ''
        const lyrics = taglibFile.tag.lyrics || ''
        const channels = taglibFile.properties.audioChannels || ''
        /// import
        try {
          /// artist
          if (!artistMap.has(artistId)) {
            const artist = {
              id: getUniqueId_Artist(db),
              name: artistName,
              album_count: 0,
              full_text: '',
              order_artist_name: '',
              sort_artist_name: '',
              song_count: 0,
              size: 0,
              mbz_artist_id: '',
              biography: '',
              small_image_url: '',
              medium_image_url: medium_image_url_local,
              large_image_url: '',
              similar_artists: '',
              external_url: '',
              external_info_updated_at: '',
            }
            artistMap.set(artistId, artist)
          }
          /// album
          if (!albumMap.has(albumId)) {
            const artistObj = artistMap.get(artistId)
            const album = {
              id: getUniqueId_Album(db),
              name: albumName,
              artist_id: artistObj.id,
              embed_art_path: _path,
              artist: artistName,
              album_artist: album_artist,
              min_year: min_year,
              max_year: max_year,
              compilation: 0,
              song_count: 0,
              duration: 0,
              genre: '',
              created_at: getCurrentDateTime(),
              updated_at: getCurrentDateTime(),
              full_text: '',
              album_artist_id: '',
              order_album_name: '',
              order_album_artist_name: '',
              sort_album_name: sort_album_name,
              sort_artist_name: sort_artist_name,
              sort_album_artist_name: sort_album_artist_name,
              size: 0,
              mbz_album_id: '',
              mbz_album_artist_id: '',
              mbz_album_type: '',
              mbz_album_comment: '',
              catalog_num: '',
              comment: comment,
              all_artist_ids: '',
              image_files: '',
              paths: '',
              description: description,
              small_image_url: '',
              medium_image_url: medium_image_url_local,
              large_image_url: '',
              external_url: '',
              external_info_updated_at: '',
            }
            albumMap.set(albumId, album)
            artistObj.album_count++
          }
          /// media
          const albumObj = albumMap.get(albumId)
          const media = {
            id: getUniqueId_Media(db),
            path: _path,
            title: title,
            artist: artistName,
            album: albumName,
            artist_id: albumObj.artist_id,
            album_id: albumObj.id,
            album_artist: artistName,
            has_cover_art: 0,
            track_number: track_number,
            disc_number: disc_number,
            year: year,
            size: size,
            suffix: '',
            duration: duration,
            bit_rate: bit_rate,
            genre: genre,
            compilation: compilation,
            created_at: getCurrentDateTime(),
            updated_at: getCurrentDateTime(),
            full_text: title,
            album_artist_id: '',
            order_album_name: '',
            order_album_artist_name: '',
            order_artist_name: '',
            sort_album_name: sort_album_name,
            sort_artist_name: sort_artist_name,
            sort_album_artist_name: sort_album_artist_name,
            sort_title: sort_title,
            disc_subtitle: disc_subtitle,
            mbz_track_id: '',
            mbz_album_id: '',
            mbz_artist_id: '',
            mbz_album_artist_id: '',
            mbz_album_type: '',
            mbz_album_comment: '',
            catalog_num: '',
            comment: comment,
            lyrics: lyrics,
            bpm: 0,
            channels: channels,
            order_title: '',
            mbz_release_track_id: '',
            rg_album_gain: 0,
            rg_album_peak: 0,
            rg_track_gain: 0,
            rg_track_peak: 0,
            medium_image_url: medium_image_url_local,
          }
          ///
          albumObj.media = albumObj.media || []
          albumObj.media.push(media)
          albumObj.song_count++
          albumObj.duration += taglibFile.properties.durationMilliseconds / 1000 || 0
        } catch (e) {
          console.error(e)
        }
        // cover output driveDbPath
        try {
          if (cover_model) {
            if (taglibFile.tag.pictures && taglibFile.tag.pictures.length > 0) {
              const fileName = path.basename(_path, path.extname(_path)) + '.jpg' // 生成文件名
              const imagePath = path.join(driveTempPath, fileName) // 完整路径

              if (!fs.existsSync(driveTempPath)) {
                fs.mkdirSync(driveTempPath, { recursive: true })
              }
              if (!fs.existsSync(imagePath)) {
                fs.writeFileSync(imagePath, Buffer.from(taglibFile.tag.pictures[0].data))
              }
            }
          }
        } catch (e) {
          console.error(e)
        }
        taglibFile.dispose()
      } catch (e) {
        console.error('_path: ' + _path + '\nerror:' + e)
      }
    }
  }

  const chunkSize = 10
  const totalChunks = Math.ceil(allCommons.length / chunkSize)
  for (let i = 0; i < allCommons.length; i += chunkSize) {
    const chunk = allCommons.slice(i, i + chunkSize)
    processChunk(chunk)
    setImmediate(() => {}) // 让出事件循环

    const currentChunk = i / chunkSize + 1
    percentage = 10 + (80 - 10) * (currentChunk / totalChunks)
  }
  percentage = 100

  const resultArray = Array.from(artistMap.values()).map((artist) => {
    return {
      artist: {
        ...artist,
        albums: Array.from(albumMap.values())
          .filter((album) => album.artist_id === artist.id)
          .map((album) => {
            const albumMediasCount = album.media.length
            return {
              ...album,
              song_count: albumMediasCount,
              media: album.media.map((media) => ({
                ...media,
                album_id: album.id,
              })),
            }
          }),
      },
    }
  })

  // 计算每个艺术家的歌曲总数和专辑总数
  resultArray.forEach((music) => {
    let song_count = 0
    music.artist.albums.forEach((album) => {
      song_count += album.media.length
    })
    music.artist.song_count = song_count
    music.artist.album_count = music.artist.albums.length
  })

  // 处理艺术家
  resultArray.forEach((music) => {
    if (!isArtistExists(db, music.artist.name)) {
      // 如果艺术家不存在，插入艺术家
      insertData(db, 'artist', music.artist)
    } else {
      // 如果艺术家已存在，获取其 ID 并更新关联关系
      music.artist.id = getArtistExists(db, music.artist.name)
      music.artist.albums.forEach((album) => {
        album.artist_id = music.artist.id
        album.media.forEach((media) => {
          media.artist_id = music.artist.id
        })
      })
    }
  })

  // 处理专辑和歌曲
  resultArray.forEach((music) => {
    music.artist.albums.forEach((album) => {
      if (!isAlbumExists(db, album.name, album.artist)) {
        // 如果专辑不存在，插入专辑
        insertData(db, 'album', album)
        album.media.forEach((media) => {
          if (!isMediaExists(db, media.path)) {
            // 如果歌曲不存在，插入歌曲
            insertData(db, 'media_file', media)
          } else {
            // 如果歌曲已存在，获取其 ID
            media.id = getMediaExists(db, media.path)
          }
        })
      } else {
        // 如果专辑已存在，获取其 ID 并更新关联关系
        album.id = getAlbumExists(db, album.name, album.artist)
        album.media.forEach((media) => {
          media.album_id = album.id
          if (!isMediaExists(db, media.path)) {
            // 如果歌曲不存在，插入歌曲
            insertData(db, 'media_file', media)
          } else {
            // 如果歌曲已存在，获取其 ID
            media.id = getMediaExists(db, media.path)
          }
        })
      }
    })
  })
  db.close()
}
/// node-better-sqlite r/w
function getUniqueId_Media(db: any) {
  const { v4: uuidv4 } = require('uuid')
  let id = uuidv4().replace(/-/g, '')
  while (db.prepare(`SELECT COUNT(*) FROM media_file WHERE id = ?`).pluck().get(id) > 0) {
    id = uuidv4().replace(/-/g, '')
  }
  return id
}
function getUniqueId_Album(db: any) {
  const { v4: uuidv4 } = require('uuid')
  let id = uuidv4().replace(/-/g, '')
  while (db.prepare(`SELECT COUNT(*) FROM album WHERE id = ?`).pluck().get(id) > 0) {
    id = uuidv4().replace(/-/g, '')
  }
  return id
}
function getUniqueId_Artist(db: any) {
  const { v4: uuidv4 } = require('uuid')
  let id = uuidv4().replace(/-/g, '')
  while (db.prepare(`SELECT COUNT(*) FROM artist WHERE id = ?`).pluck().get(id) > 0) {
    id = uuidv4().replace(/-/g, '')
  }
  return id
}
function getCurrentDateTime() {
  return new Date()
    .toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/\//g, '-')
}
function walkDirectory(directory: any) {
  const files: any[] = []
  const walkSync = (dir: any) => {
    fs.readdirSync(dir).forEach((file: any) => {
      const filePath = path.join(dir, file)
      if (fs.statSync(filePath).isDirectory()) {
        walkSync(filePath)
      } else if (
        filePath.endsWith('.mp3') ||
        filePath.endsWith('.flac') ||
        filePath.endsWith('.aac') ||
        filePath.endsWith('.mp1') ||
        filePath.endsWith('.mp2') ||
        filePath.endsWith('.m4a') ||
        filePath.endsWith('.ape') ||
        filePath.endsWith('.oga') ||
        filePath.endsWith('.ogg') ||
        filePath.endsWith('.opus') ||
        filePath.endsWith('.wav') ||
        filePath.endsWith('.webm')
      ) {
        files.push(filePath)
      }
    })
  }
  walkSync(directory)
  return files
}
function insertData(db: any, table: any, data_old: any) {
  if (Object.keys(data_old).length === 0) return
  const data = { ...data_old }
  if (table === 'artist' && data.hasOwnProperty('albums')) delete data.albums
  if (table === 'album' && data.hasOwnProperty('media')) delete data.media
  const columns = Object.keys(data).join(', ')
  const values = Object.values(data).map((value) => {
    if (typeof value === 'object' && value !== null && 'id' in value) {
      return value.id
    }
    return String(value)
  })
  const sql = `INSERT INTO ${table} (${columns}) VALUES (${columns
    .split(', ')
    .map(() => '?')
    .join(', ')})`
  const stmt = db.prepare(sql)
  try {
    const result = stmt.run(values)
    console.log(`Inserted ${result.changes} row(s)`)
  } catch (error) {
    console.error('Error inserting data:', error)
  }
}
function isMediaExists(db: any, path: any) {
  const sql = `SELECT COUNT(*) FROM media_file WHERE path = ?`
  const result = db.prepare(sql).get(path)
  return result['COUNT(*)'] > 0
}
function getMediaExists(db: any, path: any) {
  const sql = `SELECT id FROM media_file WHERE path = ?`
  const id = db.prepare(sql).get(path)
  return id
}
function isAlbumExists(db: any, album_name: any, album_artist: any) {
  const sql = `SELECT COUNT(*) FROM album WHERE name = ? AND artist = ?`
  const result = db.prepare(sql).get(album_name, album_artist)
  return result['COUNT(*)'] > 0
}
function getAlbumExists(db: any, album_name: any, album_artist: any) {
  const sql = `SELECT id FROM album WHERE name = ? AND artist = ?`
  const id = db.prepare(sql).get(album_name, album_artist)
  return id
}
function isArtistExists(db: any, artist_name: any) {
  const sql = `SELECT COUNT(*) FROM artist WHERE name = ?`
  const result = db.prepare(sql).get(artist_name)
  return result['COUNT(*)'] > 0
}
function getArtistExists(db: any, artist_name: any) {
  const sql = `SELECT id FROM artist WHERE name = ?`
  const id = db.prepare(sql).get(artist_name)
  return id
}
function extractArtistAndTitle(filePath: string): { artist: string; title: string } | null {
  const regex = /^(.*?)\\([^\\]*?)\s*-\s*(.*?)\.\w+$/
  const match = filePath.match(regex)
  if (match) {
    const artist = match[2].trim()
    const title = match[3].trim()
    return { artist, title }
  }
  return null
}
