# 界面部署

## 准备账号

[注册Cloudflare](https://dash.cloudflare.com/)，并添加域名

不会的可以看这个教程：[域名接入Cloudflare](https://cloud.tencent.cn/developer/article/2518586?from=15425&policyId=undefined&traceId=&frompage=seopage)
<img src="../public/images/action/1.png" class="article-img">


## 创建项目
1. 克隆仓库到自己的GitHub账号 [https://github.com/maillab/cloud-mail](https://github.com/maillab/cloud-mail)
<img src="../public/images/dashboard/0.png" class="article-img" />
2. 创建worker项目
<img src="../public/images/dashboard/1.png" class="article-img" />
3. 选择GitHub导入
<img src="../public/images/dashboard/2.png" class="article-img" />
4. 设置目录 `mail-worker`，并部署
<img src="../public/images/dashboard/3.png" class="article-img" />

## 设置环境变量

| 变量名                   | 必需 | 用途                                             |
|-----------------------|:--:|------------------------------------------------|
| domain                | ✅  | 邮箱域名,多域名用（例如 `["example.com","example2.com"]`） |
| admin                 | ✅  | 管理员邮箱地址（例如 `admin@example.com`）                |
| jwt_secret            | ✅  | JWT密钥 随便输入一串字符串，不要输入特殊字符                       |

<img src="../public/images/dashboard/5.png" class="article-img" />

## 绑定数据库
1. 创建KV和D1数据库
<img src="../public/images/dashboard/4-4.png" class="article-img" />
2. 添加绑定，<span style="color: red" class="article-img">变量名必须为`kv`和`db`</span>
<img src="../public/images/dashboard/4.png" class="article-img" />

## 设置转发
<img src="../public/images/dashboard/6.png" class="article-img" />
<img src="../public/images/dashboard/7.png" class="article-img" />
<img src="../public/images/dashboard/8.png" class="article-img" />

## 登录网站
1. 浏览器输入 `https://你的worker自定义域/api/init/你的jwt_secret` 初始化数据库
<img src="../public/images/dashboard/10.png" class="article-img" />

2. 浏览器输入自定义域名，<span style="color: red" class="article-img">注册管理员账号</span>，登录网站
<img src="../public/images/dashboard/9.png" class="article-img" />