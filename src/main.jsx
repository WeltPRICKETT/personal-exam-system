import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

try {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error(error);
  document.getElementById("root").innerHTML = `
    <div style="max-width: 900px; margin: 40px auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', sans-serif; background: #fff; border: 1px solid #fecaca; color: #991b1b;">
      <h1 style="margin: 0 0 12px; font-size: 20px;">页面启动失败</h1>
      <p style="margin: 0 0 12px;">前端渲染时发生错误，请保留当前窗口并联系开发者查看控制台。</p>
      <pre style="white-space: pre-wrap; background: #fef2f2; padding: 12px;">${String(error?.stack || error?.message || error)}</pre>
    </div>
  `;
}
