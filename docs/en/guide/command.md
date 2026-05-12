# Command Deployment

## Deployment Prerequisites

Nodejs v20.19.6

A Cloudflare account (a domain must be added to the account)


**Clone the project locally**
``` shell
git clone https://github.com/maillab/cloud-mail #拉取代码
cd cloud-mail/mail-worker #进入worker目录
```

**Install dependencies**
```shell
pnpm i
```

## Project Configuration

mail-worker/wrangler.toml

```toml
[[d1_databases]]
binding = "db"            # D1 database binding name (must not be changed)
database_name = ""        # D1 database name
database_id = ""          # D1 database ID

[[kv_namespaces]]
binding = "kv"            # KV binding name (must not be changed)
id = ""                   # KV namespace ID

[[r2_buckets]]
binding = "r2"            # R2 bucket binding name (must not be changed)
bucket_name = ""          # R2 bucket name

[assets]
binding = "assets"        # Static assets binding name (must not be changed)
directory = "./dist"      # Directory containing built frontend assets (default: dist)

[triggers]
crons = ["0 16 * * *"]    # Scheduled task, runs daily at 00:00 (Asia/Shanghai)

[vars]
orm_log = false
domain = []               # Email domains, multiple domains supported, for example: ["example1.com","example2.com"]
admin = ""                # Administrator email address, for example: "admin@example.com"
jwt_secret = ""           # JWT secret key for authentication, any random string

```



## Remote Deployment

1. Create a KV namespace and a D1 database in the Cloudflare dashboard.
2. Configure the database bindings and environment variables in mail-worker/wrangler.toml.
3. Run the remote deployment command:

    ```shell
    pnpm run deploy 
    ```

4. In Cloudflare, go to
   Account Home → Your Domain → Email → Email Routing → Routing Rules → Catch-all Address,
   and edit the rule to forward emails to the Worker.

5. Open the following URL in a browser to initialize or update the database: https://your-worker-domain/api/init/your_jwt_secret