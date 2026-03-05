import { exec } from 'node:child_process'
import path from 'node:path'
import type { Plugin } from 'vite'

interface Options {
  /** 微信开发者工具安装目录，默认 D:\微信web开发者工具 */
  devtoolsDir?: string
}

/**
 * Vite 插件：首次构建完成后通过 CLI 自动打开微信开发者工具
 *
 * 使用 cli.bat open --project 命令，支持冷启动（开发者工具未运行时自动启动）
 * 前置条件：需在微信开发者工具中开启「设置 → 安全 → 服务端口」
 */
export function autoOpenWeixinDevtools(options: Options = {}): Plugin {
  const { devtoolsDir = 'D:\\微信web开发者工具' } = options
  let opened = false

  return {
    name: 'auto-open-weixin-devtools',
    apply: 'build',

    closeBundle() {
      if (opened) return
      opened = true

      const cliBat = path.join(devtoolsDir, 'cli.bat')
      const projectPath = path.resolve(process.cwd(), 'dist/dev/mp-weixin')

      console.log(`\n🚀 正在通过 CLI 打开微信开发者工具...`)
      console.log(`   项目路径: ${projectPath}`)

      // Windows 下 .bat 文件必须通过 cmd.exe 执行
      const command = `"${cliBat}" open --project "${projectPath}"`

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.warn(
            `\n⚠️  打开微信开发者工具失败`,
            `\n   CLI 路径: ${cliBat}`,
            `\n   请确认开发者工具已安装且已开启服务端口`,
            `\n   错误: ${error.message}`,
          )
          return
        }
        console.log(`\n✅ 微信开发者工具已打开`)
        if (stdout.trim()) console.log(`   ${stdout.trim()}`)
        if (stderr.trim()) console.warn(`   ${stderr.trim()}`)
      })
    },
  }
}
