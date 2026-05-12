---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Cloud Mail"
  text: ""
  tagline: "基于 Cloudflare 的简约响应式邮箱服务，支持邮件发送、附件收发，部署到 Worker 降低服务器成本 🎉"
  actions:
    - theme: brand
      text: 在线演示
      link:  https://skymail.ink
    - theme: alt
      text: 界面部署
      link: /guide/dashboard.md
    - theme: alt
      text: Action 部署
      link: /guide/action.md

features:
  - title: 💰 低成本使用
    details: 部署到 Cloudflare Workers 降低服务器成本
  - title: 📧 邮件发送
    details: 集成 Resend 发送邮件，支持群发，内嵌图片和附件发送，状态查看
  - title: 📈 数据可视化
    details: 使用 Echarts 对系统数据详情，用户邮件增长可视化显示
  - title: 🛡️ 管理员功能
    details: 可以对用户，邮件进行管理，RABC权限控制对功能及使用资源限制
  - title: 🔀 多号模式
    details: 开启后多号模式后可以一个用户可以添加多个邮箱
  - title: 📦 附件收发
    details: 支持收发附件，使用R2对象存储保存和下载文件
  - title: 🎨 个性化设置
    details: 可以自定义网站标题，登录背景，透明度
  - title: 🤖 人机验证
    details: 集成 Turnstile 人机验证，防止人机批量注册
---

