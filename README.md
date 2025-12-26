# Cline v3.38.3 魔改版

gemini模型增加 gemini-3-flash-preview 模型

## 修改部分
src/shared/api.ts
增加 gemini-3-flash-preview 模型

src/core/prompts/system-prompt/variants/gemini-3/config.ts
src/core/prompts/system-prompt/variants/gemini-3/template.ts
src/core/prompts/system-prompt/variants/next-gen/config.ts
src/core/prompts/system-prompt/variants/next-gen/template.ts
修改prompt，USER_INSTRUCTIONS 放到 AGENT_ROLE 之后。
没有启用 Native Tool Calls，导致 Cline 回退到了 NEXT_GEN 变体，所以需要修改next-gen

## 打包命令

rm -rf dist && rm -rf dist-standalone && npm install && cd webview-ui && npm install && rm -rf build && npm run build && cd .. && npm run package && npx vsce package --allow-package-secrets sendgrid
