import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: 'Main window',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // IPC 交互处理器
  ipcMain.on('to-main', (event, message) => {
    console.log('Received from renderer:', message)
    event.reply('from-main', `主进程已收到: ${message} (Time: ${new Date().toLocaleTimeString()})`)
  })

  // Windows 底层交互验证：打开资源管理器
  ipcMain.on('open-explorer', () => {
    shell.openExternal(process.cwd())
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile('dist/index.html')
  }
})
