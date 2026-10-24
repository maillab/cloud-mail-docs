# Cloudflare Email Sending
:::warning
Sending email this way requires Workers Paid.
:::

1. Add the domain used to send email.
   <img src="../../public/images/en/sending/cf/cf.png" class="article-img">

2. Bind the email service to an Action Secret or a Workers binding. The variable value is fixed as `email`.

   | Worker Binding Name | Action Secret | Required | Description        |
   |---------------------|---------------|:--------:|--------------------|
   | email               | EMAIL         |    ✅    | Always enter `email` |

   <img src="../../public/images/en/sending/cf/cf1.png" class="article-img">

3. Cloudflare Email will be enabled in System Settings.
   <img src="../../public/images/sending/cf/cf2.png" class="article-img">
