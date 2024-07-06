# React Ant Design Admin

React Ant Design Admin 是一个基于 React、Ant Design 和 Tailwind CSS 构建的现代化管理后台模板。它提供了一个灵活、可扩展的框架，适用于各种管理系统和仪表板应用。

## 特性

- 🚀 使用 Vite 构建，开发体验极速
- 💻 基于 React 18 和 TypeScript
- 🎨 集成 Ant Design 组件库，UI 美观统一
- 🌈 使用 Tailwind CSS 实现快速自定义样式
- 🔐 内置权限管理系统
- 🌐 支持国际化
- 📊 响应式设计，支持移动端
- 🔧 可配置的主题
- 📝 集成常用的管理后台功能模块

## 快速开始

### 前置条件

- Node.js (版本 14 或更高)
- npm 或 yarn

### 安装

1. 克隆仓库：

   ```bash
   git clone https://github.com/suijiafeng/my-react-antd-admin.git
   cd react-antd-admin
   ```

2. 安装依赖：

   ```bash
   npm install
   # 或
   yarn install
   ```

3. 启动开发服务器：

   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. 打开浏览器访问 `http://localhost:3000`

### 构建

要构建生产版本，运行：

```bash
npm run build
# 或
yarn build
```

构建后的文件将位于 `dist` 目录中。

## 项目结构

```
react-antd-admin/
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

## 定制化

### 主题定制

你可以在 `src/styles/theme.less` 文件中修改 Ant Design 的默认主题变量。

### Tailwind 配置

Tailwind CSS 的配置文件位于 `tailwind.config.js`，你可以根据需要进行修改。
