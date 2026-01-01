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

### 其他 Prompt 调整
src/core/prompts/system-prompt/variants/gemini-3/config.ts
src/core/prompts/system-prompt/variants/gemini-3/template.ts
src/core/prompts/system-prompt/variants/next-gen/config.ts
src/core/prompts/system-prompt/variants/next-gen/template.ts
修改prompt，USER_INSTRUCTIONS 放到 AGENT_ROLE 之后。
没有启用 Native Tool Calls，导致 Cline 回退到了 NEXT_GEN 变体，所以需要修改next-gen

### Gemini 参数调整
src/core/api/providers/gemini.ts
强制设置 Gemini 模型的生成参数：
- `temperature`: 0
- `topP`: 1
- `thinkingConfig.includeThoughts`: false (禁用思考过程输出)

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

rm -rf dist && rm -rf dist-standalone && npm install && cd webview-ui && npm install && rm -rf build && npm run build && cd .. && npm run package && npx vsce package --allow-package-secrets sendgrid
