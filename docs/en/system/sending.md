# Email Sending
:::warning
Cloudflare does not currently support sending emails.
Port 25 is blocked, so a third-party email service must be used.
:::

1. Register at https://resend.com
   , add your domain, and complete DNS verification.
<img src="../../public/images/send/1.png" class="article-img">

2. Create an API key and copy it.
<img src="../../public/images/send/3.png" class="article-img">

3. Add the status callback URL: `https://worker自定义域/api/webhooks`
<img src="../../public/images/send/2.png" class="article-img">

4. Select the appropriate options.
<img src="../../public/images/send/4.png" class="article-img">

5. Open System Settings and configure the email sending service.
<img src="../../public/images/send/5.png" class="article-img">