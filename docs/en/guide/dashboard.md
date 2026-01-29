# Dashboard Deployment

## Account Preparation

Register a Cloudflare account at https://dash.cloudflare.com and add your domain.
<img src="../../public/images/en/action/1.png" class="article-img">


## Create the Project

1. Fork or clone the repository to your own GitHub account: [https://github.com/maillab/cloud-mail](https://github.com/maillab/cloud-mail)

<img src="../../public/images/dashboard/0.png" class="article-img" />

2. Create a new Worker project

<img src="../../public/images/dashboard/1.png" class="article-img" />

3. Choose **Import from GitHub**

<img src="../../public/images/dashboard/2.png" class="article-img" />

4. Set the directory to `mail-worker` and deploy the project

<img src="../../public/images/dashboard/3.png" class="article-img" />

## Configure Environment Variables

| Variable Name | Required | Description                                                                               |
| ------------- | :------: | ----------------------------------------------------------------------------------------- |
| domain        |     ✅    | Email domain(s). Multiple domains are supported (e.g., `["example.com", "example2.com"]`) |
| admin         |     ✅    | Administrator email address (e.g., `admin@example.com`)                                   |
| jwt_secret    |     ✅    | JWT secret key. Use any random string; do not include special characters                  |

<img src="../../public/images/dashboard/5.png" class="article-img" />

## Bind Databases

1. Create the KV and D1 databases

<img src="../../public/images/dashboard/4-4.png" class="article-img" />

2. Add bindings. <span style="color: red">The variable names must be `kv` and `db`</span>

<img src="../../public/images/dashboard/4.png" class="article-img" />

## Configure Email Forwarding

<img src="../../public/images/dashboard/6.png" class="article-img" />
<img src="../../public/images/dashboard/7.png" class="article-img" />
<img src="../../public/images/dashboard/8.png" class="article-img" />

## Log In to the Website

1. Open the following URL in your browser to initialize the database:

   `https://<your_worker_domain>/api/init/<your_jwt_secret>`

<img src="../../public/images/dashboard/10.png" class="article-img" />

2. Open your worker domain in the browser, <span style="color: red">register the administrator account</span>, and sign in to the website

<img src="../../public/images/dashboard/9.png" class="article-img" />
