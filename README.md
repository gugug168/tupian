<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="Stamp Splitter AI：把一张藏品照片自动识别并裁成多张单品图。">
</p>

React + TypeScript 应用。它先压缩图片供 Gemini Vision 检测对象，再用原始高分辨率图片按检测框裁切结果。

## 一眼看懂

| 价值 | 真实证据 |
| --- | --- |
| 把一张藏品照片自动识别并裁成多张单品图。 | 上传集合照片 · Gemini Vision · 高分辨率裁切 |

## 从这里开始

```text
npm install && npm run dev
```

## 配置

应用通过 `API_KEY` 使用 Gemini。请在本地环境中提供自己的密钥，切勿提交密钥文件。

```bash
npm install
npm run dev
```
