NSMusicS-Electron scripts layout

目录说明：

- scripts/electron/macos/x64/build.sh # 在 x86_64 (Rosetta) 下运行的自包含构建脚本
- scripts/electron/macos/arm64/build.sh # 在 arm64 下运行的自包含构建脚本
- scripts/electron/linux/build.sh # Linux 构建脚本
- scripts/electron/win/build.ps1 # Windows 构建脚本（PowerShell）

- scripts/electron/env-setup/ # 环境准备脚本（安装依赖、重建本机模块）

使用示例（mac x64, 在宿主机器上用 Rosetta 运行）：

```bash
# 从仓库根运行（使用 Rosetta）
arch -x86_64 bash -lc 'cd NSMusicS-Electron && bash scripts/electron/macos/x64/build.sh'
```

注意事项：

- 构建脚本假设 `nvm` 已安装并在对应架构下提供所需 Node 版本（默认 Node 18）。
- `env-setup` 目录包含可选的破坏性步骤（会删除 `node_modules`），请在执行前确认备份或同意删除。

发布前检查：

- 正式发版前先看 [docs/09-release-readiness-checklist.md](../../docs/09-release-readiness-checklist.md)
