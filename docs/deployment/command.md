# 部署教程

## 部署准备

Nodejs v20.19.6

Cloudflare 账号 (需要绑定域名)


**克隆项目到本地**
``` shell
git clone https://github.com/maillab/cloud-mail #拉取代码
cd cloud-mail/mail-worker #进入worker目录
```

**安装依赖**
```shell
pnpm i
```

## 项目配置 

mail-worker/wrangler.toml

```toml
[[d1_databases]]
binding = "db"			#d1数据库绑定名默认不可修改
database_name = ""		#d1数据库名字
database_id = ""		#d1数据库id

[[kv_namespaces]]
binding = "kv"			#kv绑定名默认不可修改
id = ""			        #kv数据库id


[[r2_buckets]]
binding = "r2"                  #r2对象存储绑定名默认不可修改
bucket_name = ""	        #r2对象存储桶的名字
	

[assets]
binding = "assets"		#静态资源绑定名默认不可修改
directory = "./dist"	        #前端vue项目打包的静态资源存放位置,默认dist

[triggers]
crons = ["0 16 * * *"]	#定时任务每天晚上12点执行（Asia/Shanghai）

[vars]
orm_log = false
domain = []			#邮件域名可以配置多个示例: ["example1.com","example2.com"]
admin = ""		        #管理员的邮箱 示例: "admin@example.com"
jwt_secret = ""			#登录身份令牌的密钥,随便填一串字符串

```



## 远程部署

1. 在 Cloudflare 控制台创建KV，D1数据库
2. 在项目目录 `mail-worker/wrangler.toml` 配置数据库和环境变量
3. 执行远程部署命令

    ```shell
    pnpm run deploy 
    ```

4. 在Cloudflare→账户主页→你的域名→电子邮件→电子邮件路由→路由规则→Catch-all地址，编辑发送到worker

5. 浏览器输入  `https://worker自定义域/api/init/你的jwt_secret`   初始化或更新数据库