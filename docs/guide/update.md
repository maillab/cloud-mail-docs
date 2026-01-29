# 项目更新

## Action 部署更新
同步仓库代码到最新，GitHub Action 会自动更新部署更新

## 界面署更新
1. 同步代码后，worker会自动更新
2. 绑定的数据库会掉，需要绑定`d1`,`kv`数据库
3. 执行 `https://worker自定义域/api/init/你的jwt_secret`  更新数据库 (只会更新不会覆盖已有数据)

