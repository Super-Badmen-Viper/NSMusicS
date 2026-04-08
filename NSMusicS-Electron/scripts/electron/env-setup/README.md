# Environment setup scripts

此文件夹包含各平台的环境准备示例脚本（仅示例/说明），用于在目标架构下安装 `nvm`、切换到合适的 Node 架构并准备构建环境。

注意：这些脚本**不自动修改项目源代码**，只是提供一键化的环境准备命令。请在运行前阅读并确认。

Scripts:
- macos-x64.sh — 在 macOS 下通过 Rosetta 切换到 x86_64，并安装/切换到 x64 Node（示例）
- macos-arm64.sh — 在 macOS 原生 arm64 下安装/切换 Node（示例）
- linux.sh — 在常见 Linux 发行版上安装 nvm、Node 与构建依赖（Debian/Ubuntu 风格示例）
- windows.ps1 — Windows (PowerShell) 下的 nvm-windows / Node 安装提示

使用示例（mac x64，手动运行）：

```bash
# 在 mac 上启动 Rosetta shell
arch -x86_64 zsh
# 然后在交互 shell 中运行脚本
scripts/electron/env-setup/macos-x64.sh
```
