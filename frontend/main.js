const { app, BrowserWindow, screen } = require('electron')

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const win = new BrowserWindow({
    width: width,
    height: height,
  })
  win.setMenuBarVisibility(false)

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  // Open a window if none are open (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
