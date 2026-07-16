# Page Memory Manager

一个基于 React 和 Vite 的页面置换算法可视化工具。它模拟 FIFO 与 LRU 两种策略，并逐步展示页框状态、缺页和被替换页面。

## 功能

- 输入逗号分隔的页面访问序列。
- 设置并校验页框数量。
- 随机生成访问序列。
- 在 FIFO 和 LRU 之间切换。
- 展示每一步的缺页、被替换页面和帧历史。

## 技术栈

- React 18
- Vite
- React Bootstrap

## 本地开发

仓库包含 pnpm 锁文件，建议使用 pnpm：

    pnpm install
    pnpm dev

其他常用命令：

    pnpm build
    pnpm lint
    pnpm preview

## 使用说明

在页面中输入页面访问序列和页框数量后，选择 FIFO 或 LRU 运行模拟。表格记录的是算法状态变化，不是操作系统或浏览器的真实内存状态。

## 适用范围

适合操作系统课程、算法演示和小规模实验。它不用于操作系统内存管理、性能压测或生产监控。

## 许可证

仓库当前未声明许可证。