# GitHub Actions Deployment

## API Token Creation

1. create a token using a template.
   <img src="../../public/images/en/action/4.png" class="article-img">

2. Configure the required permissions.
   <img src="../../public/images/en/action/5.png" class="article-img">

3. Copy the generated API token.
   <img src="../../public/images/en/action/6.png" class="article-img">

4. Copy the Cloudflare account ID.
   <img src="../../public/images/en/action/7.png" class="article-img">


## Environment Setup

1. Fork the repository: [https://github.com/maillab/cloud-mail](https://github.com/maillab/cloud-mail)
   <img src="../../public/images/en/action/8.png" class="article-img">

2. Configure GitHub Actions secrets.

| Secret Name           | Required | Description                                            |
|-----------------------|:--------:|--------------------------------------------------------|
| CLOUDFLARE_API_TOKEN  |    ✅     | Cloudflare API token                                   |
| CLOUDFLARE_ACCOUNT_ID |    ✅     | Cloudflare account ID                                  |
| CUSTOM_DOMAIN         |    ✅     | Worker custom domain, e.g., `skymail.ink`              |
| DOMAIN                |    ✅     | Email domains, e.g., `["example.com", "example2.com"]`      |
| ADMIN                 |    ✅     | Administrator email address, e.g., `admin@example.com` |
| JWT_SECRET            |    ✅     | JWT secret key (any random string, do not use special characters)                    |
| NAME                  |    ❌     | Worker project name  (optional)                                   |
| D1_DATABASE_ID        |    ❌     | D1 database ID (optional)                                       |
| KV_NAMESPACE_ID       |   ❌      | KV namespace ID (optional)                                        |

<img src="../../public/images/en/action/9.png" class="article-img" />

## Deployment

1. Run the GitHub Actions workflow.
   <img src="../../public/images/en/action/10.png" class="article-img" />

2. Wait for the workflow to complete.
   <img src="../../public/images/en/action/11.png" class="article-img" />

## Configure Email Forwarding

1. Refer to the Dashboard deployment steps: [Configure Email Forwarding](dashboard.html#configure-email-forwarding) 

2. Open the custom domain in a browser and create an admin account to log in.
   <img src="../../public/images/en/action/13.png" class="article-img" />

