# Cline v3.38.3 魔改版

gemini模型增加 gemini-3-flash-preview 模型

## 修改部分
### Gemini 3 Flash Preview 支持
src/shared/api.ts
增加 gemini-3-flash-preview 模型

### Next-Gen Prompt 优化 (移除 Thinking Tag)
为了适配具备原生推理链能力的模型（如 Gemini 3.0 pro），移除了 `next-gen` 变体中强制输出 `<thinking>` 标签的要求。

修改文件：
- `src/core/prompts/system-prompt/variants/next-gen/config.ts`: 引入并应用自定义组件覆盖。
- `src/core/prompts/system-prompt/variants/next-gen/overrides.ts`: 新增文件，定义不包含 thinking 标签要求的 `TOOL_USE` (Guidelines), `ACT_VS_PLAN`, 和 `OBJECTIVE` 模板。
- `src/core/prompts/system-prompt/tools/attempt_completion.ts`: 新增 `NEXT_GEN` 工具定义，移除 description 中的 `<thinking>` 标签要求。

### Agentic 架构大重构 (全面对齐 DeepMind)
对核心 Prompt 体系进行了深度解耦与 XML 语意重构：
1. **基础模板 XML 化**：彻底废弃基于 `====` 的文字隔离，通过 `<identity>`, `<capabilities>`, `<user_rules>`, `<user_information>` 重构了所有变体模板。
2. **规则组件 (Rules) 语义解耦**：
   - 抽出工具细则到独立组件 `<tool_use_guidelines>`。
   - 抽出沟通语气规范（如不准寒暄）到 `<communication_style>`。
   - `USER_INSTRUCTIONS` 现已合并并入更高权重的 `<user_rules>` 中。
3. **Turn-by-turn 分离机制**：在 Task 调度环上，用户发言与物理环境分离。自然命令现在以 `<USER_REQUEST>` 传输，当前工作目录、终端等状态在 `<ADDITIONAL_METADATA>` 传输，显著降低推理幻觉。
4. **底层幽灵通知 (Ephemeral Messages)**：拦截因模型缺少参数或正则失效导致的错误，全部替换为通过 `<EPHEMERAL_MESSAGE><system_warning>` 包裹的系统级注入，防止模型误当人类从而错误道歉或开启废话模式。
5. **身份默认修改**：将系统默认人设从 `Cline` 改为了 Google DeepMind 下的高度自动代理身份 `Antigravity`，进一步激发出大模型的 Agent 能力。

### Gemini 参数调整
src/core/api/providers/gemini.ts
强制设置 Gemini 模型的生成参数：
- `temperature`: 0
- `topP`: 1
- `thinkingConfig.includeThoughts`: false (禁用思考过程输出)

### Gemini 配置完善 (Thinking Tag & Thoughts)
完善了 Gemini 模型的配置项支持，解决了前端配置无法保存和生效的问题。

核心改动：
- **Proto 更新**:
  - `proto/cline/models.proto`: 在 `ModelsApiConfiguration` 和 `ModelsApiOptions` 中新增 `gemini_always_include_thoughts` 和 `gemini_use_thinking_tag` 字段。
  - 使用 `npm run protos` 重新生成了 TypeScript 代码 (`src/shared/proto/cline/models.ts`)。
- **状态管理**:
  - `src/shared/storage/state-keys.ts`: 在 `Settings` 接口中添加了字段定义。
  - `src/core/storage/StateManager.ts`: 完善了缓存读取和写入逻辑，支持新字段的持久化。
  - `src/core/storage/utils/state-helpers.ts`: 更新了磁盘状态读取逻辑。
- **转换逻辑**:
  - `src/shared/proto-conversions/models/api-configuration-conversion.ts`: 实现了新字段在应用层与 Proto 层之间的双向转换。

### Custom Roles (增加角色功能)
新增了自定义角色管理功能，允许用户添加、编辑和删除自定义角色，并在聊天界面切换使用。每个角色可以配置独立的 System Prompt。

核心改动：
- **Proto 更新**: 
  - `proto/cline/state.proto`: 定义了 `CustomRole`, `CustomRoleList` 消息，并在 `UpdateSettingsRequest` 中添加 `custom_roles` (Optional CustomRoleList) 和 `current_role` 字段。
- **UI 更新**:
  - `webview-ui/src/components/settings/sections/RoleSettingsSection.tsx`: 新增角色管理设置界面。
  - `webview-ui/src/components/chat/RoleSelector.tsx`: 新增聊天界面的角色切换器。
  - `webview-ui/src/components/chat/ChatTextArea.tsx`:集成 RoleSelector。
- **状态管理**:
  - `src/shared/extension-message.ts`, `src/shared/storage/state-keys.ts`: 扩展了 ExtensionState 支持 `customRoles` 和 `currentRole`。
  - `src/core/controller/index.ts`: 确保将 `customRoles` 和 `currentRole` 同步给前端。
  - `src/core/controller/state/updateSettings.ts`: 处理 `CustomRole` 的更新逻辑，并修复了 partial updates 导致的角色列表丢失问题。
- **System Prompt 注入**:
  - `src/core/task/index.ts`: 在任务初始化时，根据 `currentRole` 注入对应的自定义 System Prompt 到 `customRoleDescription` 上下文中。

## 打包命令

rm -rf claude-dev-3.38.3.vsix && rm -rf dist && rm -rf dist-standalone && npm install && cd webview-ui && npm install && rm -rf build && npm run build && cd .. && npm run package && npx vsce package --allow-package-secrets sendgrid && rm -rf node_modules && rm -rf webview-ui/node_modules
