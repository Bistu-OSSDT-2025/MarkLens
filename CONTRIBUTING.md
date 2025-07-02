# 贡献指南

感谢您对 MarkLens 项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告错误
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ⭐ 添加新功能

## 开发环境设置

### 前置要求
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### 本地开发设置

1. **Fork 项目**
   ```bash
   # 在 GitHub 上 fork 项目，然后克隆到本地
   git clone https://github.com/yourusername/marklens.git
   cd marklens
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   打开浏览器访问 `http://localhost:5173`

## 开发规范

### 代码风格
- 使用 TypeScript 进行开发
- 遵循 ESLint 和 Prettier 规范
- 组件使用函数式组件 + React Hooks
- 样式使用 Tailwind CSS

### 提交规范
我们使用约定式提交（Conventional Commits）规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型说明：**
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

**示例：**
```bash
git commit -m "feat(editor): 添加自动编号功能"
git commit -m "fix(sidebar): 修复文件搜索Bug"
git commit -m "docs: 更新README安装说明"
```

### 分支策略
- `main`: 主分支，保持稳定
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支

## 贡献流程

### 1. 创建 Issue（可选但推荐）
在开始开发前，建议先创建一个 Issue 来讨论：
- 描述问题或功能需求
- 讨论实现方案
- 获得维护者的反馈

### 2. 开发流程

1. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-fix-name
   ```

2. **进行开发**
   - 编写代码
   - 添加必要的测试
   - 确保代码通过 lint 检查

3. **测试代码**
   ```bash
   npm run lint        # 检查代码规范
   npm run build       # 确保构建成功
   npm run dev         # 本地测试
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

5. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

### 3. 创建 Pull Request

1. 在 GitHub 上创建 Pull Request
2. 填写 PR 模板，包括：
   - 变更说明
   - 相关 Issue 链接
   - 测试步骤
   - 截图（如有 UI 变更）

3. 等待代码审查和合并

## Pull Request 指南

### PR 标题格式
```
<type>: <简短描述>
```

### PR 描述模板
```markdown
## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 样式调整
- [ ] 代码重构
- [ ] 性能优化

## 变更说明
<!-- 描述此次变更的内容 -->

## 相关 Issue
<!-- 关联的 Issue 编号，如 #123 -->

## 测试
<!-- 描述如何测试这些变更 -->

## 截图
<!-- 如有 UI 变更，请提供截图 -->

## 检查清单
- [ ] 代码已通过 lint 检查
- [ ] 已测试所有变更
- [ ] 已更新相关文档
- [ ] 已添加必要的注释
```

## 代码审查标准

### 代码质量
- 代码逻辑清晰，易于理解
- 适当的注释和文档
- 遵循项目的代码风格
- 没有明显的性能问题

### 功能要求
- 功能实现完整
- 边界情况处理恰当
- 用户体验良好
- 兼容现有功能

## 问题报告

### Bug 报告模板
创建 Bug 报告时，请包含以下信息：

```markdown
**Bug 描述**
简明扼要地描述遇到的问题。

**复现步骤**
1. 访问 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**期望行为**
描述您期望发生的情况。

**实际行为**
描述实际发生的情况。

**截图**
如果可能，添加截图来帮助解释您的问题。

**环境信息**
- 操作系统: [如 Windows 10, macOS 12]
- 浏览器: [如 Chrome 91, Firefox 89]
- 版本: [如 v1.0.0]
```

### 功能请求模板
```markdown
**功能描述**
清晰简洁地描述您想要的功能。

**问题解决**
这个功能将解决什么问题？

**替代方案**
您是否考虑过其他替代解决方案？

**附加信息**
任何其他有助于理解功能请求的信息。
```

## 社区行为准则

为了维护一个友好、包容的社区环境，我们期望所有参与者：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

## 获得帮助

如果您有任何问题或需要帮助：

1. 查看已有的 Issues 和文档
2. 在 GitHub 上创建新的 Issue
3. 参与社区讨论

## 许可证

通过贡献代码，您同意您的贡献将在 [MIT License](./LICENSE) 下授权。

---

再次感谢您的贡献！🎉 