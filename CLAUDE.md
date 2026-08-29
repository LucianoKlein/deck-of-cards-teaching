# 项目开发日志

## 项目概述
扑克牌教学工具 - 用于演示不同扑克游戏变体的牌型比较和教学

- **项目地址**: https://reg-board-teacher.web.app
- **GitHub**: https://github.com/LucianoKlein/deck-of-cards-teaching
- **技术栈**: Vanilla JavaScript, Firebase (Firestore + Hosting), deck.js

## 最近更新 (2026-08-19)

### 🔐 密码保护功能
- 使用 SHA-256 哈希算法保护应用访问
- 密码哈希存储在 Firestore (`passwordHash` collection)
- 自定义密码输入对话框，美观且安全
- 密码: `1026`
- 文件: `docs/auth.js`, `docs/init-password.html`

**实现细节**:
- 页面加载时隐藏内容 (`display: none`)
- 通过 `auth.js` 验证密码后才显示页面
- 使用 Web Crypto API 进行客户端哈希验证
- 对话框样式统一，支持移动端

### 📋 预设牌型管理系统
完整的 CRUD 功能，支持多游戏模式独立预设库

**功能**:
- ✅ **加载预设**: 从下拉菜单选择并快速加载牌型配置
- ✅ **保存预设**: 保存当前 Board 和 Hand 配置为预设
- ✅ **删除预设**: 删除不需要的预设
- ✅ **导出预设**: 导出当前游戏模式的所有预设为 JSON
- ✅ **导入预设**: 从 JSON 文件批量导入预设
- ✅ **游戏模式隔离**: 每个游戏模式有独立的预设库
  - Hold'em (2 cards)
  - Omaha (4 cards)
  - Big O (5 cards)
  - 5 Card Draw (5 cards)
  - A-5 Lowball (5 cards)
  - 2-7 Lowball (5 cards)
  - Badugi (4 cards)

**数据结构**:
```javascript
{
  id: "preset_timestamp_random",
  name: "预设名称",
  gameMode: "holdem|omaha|bigo|...",
  state: {
    gameMode: "holdem",
    board1: "AsKdQcJhTs",
    board2: "",
    hands: ["AhKh", "QsJs", ...]
  },
  createdAt: "ISO timestamp"
}
```

**文件**:
- `docs/firebase-config.js`: Firestore 集成
- `docs/example.js`: 预设管理逻辑（4570+ 行）
- `docs/index.html`: UI 结构
- `docs/example.css`: 样式

### 🎨 UI/UX 优化

#### 预设选择器美化
- 金色标签 (`#ffd700`) + 大写字母 + 字间距
- 渐变深色背景 (`linear-gradient`)
- 自定义金色 SVG 下拉箭头
- 悬停发光效果 (`box-shadow: 0 0 8px rgba(255, 215, 0, 0.3)`)
- 焦点高亮增强

#### 游戏模式选择器优化
- **从 7 个 radio 单选按钮改为 1 个下拉菜单**
- 节省约 **40-50% 的垂直空间**
- 样式与预设选择器统一
- 所有 JS 代码从 `input[name="gameMode"]` 迁移到 `#gameModeSelect`

#### Sidebar 紧凑化
- 减小所有 padding: `0.3rem → 0.25rem`
- 减小字体: `0.65rem → 0.6rem`
- 减小输入框宽度: `100px → 90px`
- 减小最小高度: `26px → 22px`
- 减小所有 gap 间距
- 增加 hand-row 的 `margin-bottom: 0.15rem`

### 🐛 问题修复
- 添加详细的 `[PRESET]` 调试日志
- 修复游戏模式切换时预设过滤问题
- 优化事件监听器，确保实时响应

## Git 提交历史

```
dbb177a - fix: 添加预设加载调试日志，优化游戏模式切换
6bbf663 - feat: 游戏模式改为下拉菜单，优化 sidebar 紧凑度
433e503 - feat: 添加预设牌型管理功能和密码保护
a664601 - feat: 面板功能完成
```

## Firebase 配置

### Firestore Collections
1. **passwordHash** - 存储密码哈希
   ```javascript
   {
     hash: "SHA-256 hex string"
   }
   ```

2. **pokerPresets** - 存储预设牌型
   ```javascript
   {
     id: "preset_timestamp_random",
     name: string,
     gameMode: string,
     state: object,
     createdAt: string
   }
   ```

### Hosting
- 部署目录: `docs/`
- 配置文件: `firebase.json`, `.firebaserc`

## 开发注意事项

### 代码规范
- 使用 vanilla JavaScript (ES5 兼容语法)
- 函数式编程风格
- 使用 `var` 而非 `let/const`
- 回调函数而非 async/await (兼容旧浏览器)

### 关键函数
- `getCurrentGameMode()`: 获取当前选择的游戏模式
- `refreshPresetSelect()`: 刷新预设下拉菜单
- `captureCurrentState()`: 捕获当前牌面状态
- `applyState(state)`: 应用预设状态到 UI
- `getGameModeCardCount()`: 获取当前模式手牌数量
- `needsBoardCards()`: 判断当前模式是否需要公共牌

### 游戏模式逻辑
- **Hold'em**: 2 张手牌 + 5 张公共牌
- **Omaha/Big O**: 必须用恰好 2 张手牌 + 恰好 3 张公共牌
- **5 Card Draw/Lowball/Badugi**: 仅用手牌，无公共牌

## 部署流程

```bash
# 部署到 Firebase Hosting
firebase deploy --only hosting

# 提交到 Git
git add -A
git commit -m "描述"
git push origin master
```

## 未来改进方向
- [ ] 添加更多预设模板（经典场景）
- [ ] 移动端优化
- [ ] 快捷键支持
- [ ] 历史记录功能
- [ ] 预设分类/标签系统
- [ ] 多用户支持（账号系统）
- [ ] 预设分享功能（生成链接）
