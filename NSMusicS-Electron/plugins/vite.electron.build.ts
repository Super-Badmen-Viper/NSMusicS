import type { Plugin } from 'vite'
import * as electronBuilder from 'electron-builder'
import path from 'path'
import fs from 'fs'

const resolveBuilderArch = (arch?: string) => {
  if (!arch) {
    return undefined
  }

  switch (arch) {
    case 'x64':
      return electronBuilder.Arch.x64
    case 'ia32':
    case 'x86':
      return electronBuilder.Arch.ia32
    case 'arm64':
      return electronBuilder.Arch.arm64
    default:
      throw new Error(
        `Unsupported NSMUSICS_ELECTRON_ARCH: ${arch}. Expected one of: x64, ia32, x86, arm64`
      )
  }
}

const resolveRequestedTargets = (platform: string, overrideTargets?: string) => {
  const requestedTargets = (overrideTargets || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (requestedTargets.length > 0) {
    return requestedTargets
  }

  switch (platform) {
    case 'win':
      return ['nsis', 'zip']
    case 'linux':
      return ['AppImage', 'deb', 'rpm', 'tar.gz']
    case 'mac':
      return ['dmg', 'zip']
    default:
      throw new Error(
        `Unsupported NSMUSICS_ELECTRON_PLATFORM: ${platform}. Expected one of: win, linux, mac`
      )
  }
}

const resolveBuildTargets = (platform?: string, arch?: string, overrideTargets?: string) => {
  if (!platform) {
    return undefined
  }

  const builderArch = resolveBuilderArch(arch)
  const requestedTargets = resolveRequestedTargets(platform, overrideTargets)

  switch (platform) {
    case 'win':
      return electronBuilder.Platform.WINDOWS.createTarget(requestedTargets, builderArch)
    case 'linux':
      return electronBuilder.Platform.LINUX.createTarget(requestedTargets, builderArch)
    case 'mac':
      return electronBuilder.Platform.MAC.createTarget(requestedTargets, builderArch)
    default:
      throw new Error(
        `Unsupported NSMUSICS_ELECTRON_PLATFORM: ${platform}. Expected one of: win, linux, mac`
      )
  }
}

const buildWindowsMpvFilters = () => [
  '**/*',
  '!7z{,/**}',
  '!doc{,/**}',
  '!installer{,/**}',
  '!**/*.7z',
  '!**/*.zip',
  '!**/*.pdf',
  '!**/*.ignore',
  '!**/chocolatey*',
  '!**/updater.bat',
  '!**/settings.xml',
]

const resolveWindowsMpvResourceDirectory = (targetArch?: string) => {
  const archAliases: Record<string, string[]> = {
    x64: ['x86_64'],
    ia32: ['i686'],
    arm64: ['aarch64', 'arm64'],
  }
  const archName = targetArch || process.arch
  const aliases = archAliases[archName] || [archName]
  const resourcesRoot = path.join(process.cwd(), 'resources')
  const candidates = fs
    .readdirSync(resourcesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^mpv[-_]/i.test(entry.name))
    .map((entry) => entry.name)
    .filter((name) => aliases.some((alias) => name.toLowerCase().includes(alias)))
    .sort((left, right) => right.localeCompare(left))

  if (candidates.length === 0) {
    throw new Error(
      `Missing Windows mpv runtime directory for arch ${archName} under ${resourcesRoot}`
    )
  }

  return candidates[0]
}

const ELECTRON_LANGUAGE_WHITELIST = [
  'zh-CN',
  'zh-TW',
  'en-US',
  'es',
  'fa',
  'fr',
  'ja',
  'pl',
  'de',
  'it',
  'ru',
  'pt-BR',
  'sr',
  'sv',
  'cs',
  'nl',
]

const MAC_LPROJ_WHITELIST = new Set([
  'base',
  'en',
  ...ELECTRON_LANGUAGE_WHITELIST.map((value) => value.replace(/_/g, '-').toLowerCase()),
])

const normalizeMacLprojName = (value: string) =>
  value
    .replace(/\.lproj$/i, '')
    .replace(/_/g, '-')
    .toLowerCase()

const pruneMacLprojDirectories = (rootDir: string) => {
  const removed: string[] = []

  const walk = (currentDir: string) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue
      }

      const fullPath = path.join(currentDir, entry.name)
      if (/\.lproj$/i.test(entry.name)) {
        const normalized = normalizeMacLprojName(entry.name)
        if (!MAC_LPROJ_WHITELIST.has(normalized)) {
          fs.rmSync(fullPath, { recursive: true, force: true })
          removed.push(path.relative(rootDir, fullPath).replace(/\\/g, '/'))
          continue
        }
      }

      walk(fullPath)
    }
  }

  if (fs.existsSync(rootDir)) {
    walk(rootDir)
  }

  return removed.sort()
}

const afterPack = async (context: { electronPlatformName?: string; appOutDir: string }) => {
  if ((context.electronPlatformName || '').toLowerCase() !== 'darwin') {
    return
  }

  const removed = pruneMacLprojDirectories(context.appOutDir)
  console.log(
    `[electron-builder] macOS lproj pruning removed ${removed.length} directories under ${context.appOutDir}`
  )
  for (const relativePath of removed.slice(0, 80)) {
    console.log(`[electron-builder] pruned lproj: ${relativePath}`)
  }
  if (removed.length > 80) {
    console.log(`[electron-builder] pruned lproj: ... ${removed.length - 80} more`)
  }
}

const PACKAGED_FILE_PATTERNS = [
  '**/*',
  '!**/*.map',
  '!**/.github{,/**}',
  '!**/{test,tests,__tests__,example,examples,doc,docs,benchmark,benchmarks}{,/**}',
  '!**/node_modules/better-sqlite3/deps{,/**}',
  '!**/node_modules/better-sqlite3/src{,/**}',
  '!**/node_modules/node-taglib-sharp/src{,/**}',
  '!**/node_modules/moment/src{,/**}',
  '!**/node_modules/moment/dist{,/**}',
  '!**/node_modules/moment/min{,/**}',
  '!**/node_modules/moment/ts3.1-typings{,/**}',
  '!**/node_modules/moment/{ender.js,moment.d.ts,CHANGELOG.md}',
]

const buildExtraResources = (platform?: string) => {
  const resources: Array<Record<string, any>> = [
    { from: './resources/better_sqlite3.node', to: 'better_sqlite3.node' },
    { from: './resources/navidrome.db', to: 'navidrome.db' },
    { from: './resources/nsmusics.db', to: 'nsmusics.db' },
    { from: './resources/icons', to: 'icons' },
    { from: './resources/config/NSMusicS.ico', to: 'config/NSMusicS.ico' },
    { from: './resources/config/png/256x256.png', to: 'config/png/256x256.png' },
  ]

  if (platform === 'win') {
    const mpvDir = resolveWindowsMpvResourceDirectory(
      process.env.NSMUSICS_ELECTRON_ARCH || process.arch
    )
    resources.push({
      from: `./resources/${mpvDir}`,
      to: mpvDir,
      filter: buildWindowsMpvFilters(),
    })
  }

  if (platform === 'mac') {
    resources.push({
      from: './resources/mpv-0.39.0',
      to: 'mpv-0.39.0',
    })
  }

  return resources
}

// 导出Vite插件函数
export const viteElectronBuild = (): Plugin => {
  return {
    name: 'vite-electron-build',
    // closeBundle是Vite的一个插件钩子函数，用于在Vite构建完成后执行一些自定义逻辑。
    async closeBundle() {
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
      fs.writeFileSync(
        path.join(process.cwd(), 'dist', 'package.json'),
        JSON.stringify(json, null, 2)
      )

      // 创建一个空的node_modules目录 不然会打包失败
      fs.mkdirSync(path.join(process.cwd(), 'dist/node_modules'), { recursive: true })

      const platform = process.env.NSMUSICS_ELECTRON_PLATFORM
      const targets = resolveBuildTargets(
        platform,
        process.env.NSMUSICS_ELECTRON_ARCH,
        process.env.NSMUSICS_ELECTRON_TARGETS
      )

      // 使用electron-builder打包Electron应用程序
      await electronBuilder.build({
        publish: 'never',
        targets,
        config: {
          appId: 'github.com.nsmusics.xiang.cheng',
          productName: 'NSMusicS',
          compression: 'maximum',
          electronLanguages: ELECTRON_LANGUAGE_WHITELIST,
          directories: {
            output: path.join(process.cwd(), 'release'), //输出目录
            app: path.join(process.cwd(), 'dist'), //app目录
          },
          asar: true,
          asarUnpack: ['**/*.node'],
          afterPack,
          files: PACKAGED_FILE_PATTERNS,
          win: {
            target: ['nsis', 'zip'],
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
            target: ['AppImage', 'deb', 'rpm', 'tar.gz'],
            icon: 'resources/config/png',
            desktop: {
              Icon: '/usr/share/icons/hicolor/512x512/apps/nsmusics.png',
            },
            category: 'Audio',
            maintainer: 'Xiang Cheng 1774148579@qq.com',
            artifactName: '${productName}-Linux-${version}-${arch}.${ext}',
          },
          deb: {
            depends: ['mpv'],
          },
          rpm: {
            depends: ['mpv'],
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
            target: ['dmg', 'zip'],
            icon: 'resources/config/NSMusicS.icns',
            artifactName: '${productName}-Mac-${version}-${arch}.${ext}',
            hardenedRuntime: true,
            gatekeeperAssess: false,
            entitlements: 'build/entitlements.mac.plist',
            entitlementsInherit: 'build/entitlements.mac.plist',
            identity: null, // 设置为null以跳过签名（适用于本地构建）
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
          extraResources: buildExtraResources(platform),
        },
      })
    },
  }
}
