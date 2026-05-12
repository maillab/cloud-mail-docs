# 邮件发送
:::warning
Cloudflare 目前不支持发件，封禁25端口，只能使用第三方服务
:::

1. [注册Resend](https://resend.com/login)，并添加域名，完成DNS验证
<img src="../public/images/send/1.png" class="article-img">

2.  创建 API Key 并复制
<img src="../public/images/send/3.png" class="article-img">

3. 设置发送状态回调 `https://worker自定义域/api/webhooks`
<img src="../public/images/send/2.png" class="article-img">

4. 选择对应选项
<img src="../public/images/send/4.png" class="article-img">

5. 系统设置
<img src="../public/images/send/5.png" class="article-img">