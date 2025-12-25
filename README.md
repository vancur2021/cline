# Cline v3.38.3 魔改版

gemini模型增加 gemini-3-flash-preview 模型

## 修改部分
src/shared/api.ts
增加 gemini-3-flash-preview 模型

## 打包命令

npm install
cd webview-ui && npm install && npm run build && cd ..
npm run package && npx vsce package --allow-package-secrets sendgrid
