# 接口文档

::: tip
除「登录」外，接口需在请求头 `Authorization` 中填入登录返回的身份令牌（不要加 Bearer 前缀）。管理类接口需要对应权限，管理员账号不受限制。
:::

## 登录接口

### 登录

**接口说明**：使用邮箱和密码登录，返回身份令牌

**接口地址**：`POST /api/login`

#### 请求参数

| 参数       | 类型     | 默认值 | 必填  | 说明                            |
| -------- | ------ | --- | --- | ----------------------------- |
| email    | string |     | 是   | 完整邮箱地址，例如 `admin@example.com` |
| password | string |     | 是   | 邮箱密码                          |

#### 请求示例

```bash
curl -X POST "https://skymail.ink/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 当前用户信息

**接口说明**：获取当前登录用户的账号、权限身份和权限列表

**接口地址**：`GET /api/my/loginUserInfo`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求示例

```bash
curl -X GET "https://skymail.ink/api/my/loginUserInfo" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
      "userId": 1,                          // 用户 id
      "email": "admin@example.com",         // 用户邮箱
      "name": "admin",                      // 用户名
      "type": 0,                            // 权限身份 id（管理员为 0）
      "sendCount": 0,                       // 已发件次数
      "permKeys": ["*"],                    // 权限列表，管理员为 ["*"]
      "account": {
          "accountId": 1,                   // 邮箱账号 id
          "email": "admin@example.com",
          "name": "admin"
      },
      "role": {
          "name": "admin",                  // 权限身份名
          "sendCount": 0,                   // 发件次数上限，0 为不限制
          "sendType": "count",              // 发件限制类型（count 总量，day 每日）
          "accountCount": 0                 // 可添加邮箱数量，0 为不限制
      }
  }
}
```

## 用户-邮件接口

### 邮件列表

**接口说明**：查询当前登录用户的邮件，使用 `emailId` 游标分页

**接口地址**：`GET /api/email/list`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数         | 类型      | 默认值 | 必填  | 说明                                                 |
| ---------- | ------- | --- | --- | -------------------------------------------------- |
| accountId  | integer |     | 是   | 邮箱账号 id                                            |
| type       | integer | 0   | 否   | 邮件类型（0 收件，1 发件）                                    |
| emailId    | integer |     | 否   | 游标邮件 id，首次查询可不传。`timeSort` 为 0 时查更早的邮件，为 1 时查更晚的邮件 |
| size       | integer | 10  | 否   | 每页数量，最大 50                                         |
| timeSort   | integer |     | 否   | 时间排序（0 最新，1 最旧）                                    |
| allReceive | integer |     | 否   | 是否查询该用户全部邮箱（0 否，1 是）。不传则使用该邮箱自己的全部收取设置             |
| full       | integer | 1   | 否   | 是否返回完整字段（0 摘要，1 完整正文和附件）                           |

#### 请求示例

```bash
curl -X GET "https://skymail.ink/api/email/list?accountId=1&size=10" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "latestEmail": {
      "emailId": 999,
      "accountId": 1,
      "userId": 1
    },
    "list": [
      {
        "emailId": 999,                       // 邮件 id
        "sendEmail": "hello@example.com",     // 发件人邮箱
        "name": "hello",                      // 发件人名字
        "subject": "Hello word",              // 邮件主题
        "toEmail": "admin@example.com",       // 收件人邮箱
        "accountId": 1,                       // 邮箱账号 id
        "type": 0,                            // 邮件类型（0 收件，1 发件）
        "status": 0,                          // 邮件状态（0 收件，1 已发送，2 已送达，3 退信，4 投诉，5 延迟，6 保存中，7 无人收件，8 失败）
        "unread": 0,                          // 是否未读（0 未读，1 已读）
        "isDel": 0,                           // 是否删除（0 正常，1 已删除）
        "isStar": 0,                          // 是否星标（0 否，1 是）
        "content": "<div>Hello word</div>",   // 邮件 HTML，full=1 时返回
        "text": "Hello word",                 // 邮件纯文本
        "createTime": "2099-12-30 23:59:59",  // 接收或发送时间（UTC）
        "attList": [                          // 附件列表，full=1 时返回
          {
            "attId": 1,
            "filename": "file.txt",
            "mimeType": "text/plain",
            "size": 1024
          }
        ]
      }
    ]
  }
}
```

### 发送邮件

**接口说明**：使用当前用户的邮箱账号发件。附件最多 10 个，正文内嵌图片最多 10 张

**接口地址**：`POST /api/email/send`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数             | 类型                   | 默认值 | 必填  | 说明                                  |
| -------------- | -------------------- | --- | --- | ----------------------------------- |
| accountId      | integer              |     | 是   | 发件邮箱账号 id                           |
| receiveEmail   | array &lt;string&gt; |     | 是   | 收件人邮箱列表                             |
| subject        | string               |     | 是   | 邮件主题                                |
| content        | string               |     | 是   | 邮件 HTML                             |
| text           | string               |     | 否   | 邮件纯文本                               |
| name           | string               |     | 否   | 发件人名字，不填自动截取邮箱前缀                    |
| sendType       | string               |     | 否   | 发件类型（空 新邮件，`reply` 回复，`forward` 转发） |
| emailId        | integer              |     | 否   | 原邮件 id，`sendType` 为 `reply` 时必填     |
| attachments    | array &lt;object&gt; |     | 否   | 附件列表                                |
| └─ filename    | string               |     | 是   | 文件名                                 |
| └─ content     | string               |     | 是   | 文件内容，Base64                         |
| └─ contentType | string               |     | 否   | 文件 MIME 类型                          |
| └─ size        | integer              |     | 否   | 文件大小                                |

#### 请求示例

```bash
curl -X POST "https://skymail.ink/api/email/send" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 1,
    "name": "admin",
    "receiveEmail": ["hello@example.com"],
    "subject": "Hello word",
    "content": "<div>Hello word</div>",
    "text": "Hello word",
    "sendType": "",
    "attachments": [
      {
        "filename": "file.txt",
        "contentType": "text/plain",
        "content": "SGVsbG8gd29yZA=="
      }
    ]
  }'
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "emailId": 999,                         // 邮件 id
      "sendEmail": "admin@example.com",       // 发件人邮箱
      "name": "admin",                        // 发件人名字
      "subject": "Hello word",                // 邮件主题
      "content": "<div>Hello word</div>",     // 邮件 HTML
      "text": "Hello word",                   // 邮件纯文本
      "type": 1,                              // 邮件类型（1 发件）
      "status": 1,                            // 邮件状态（1 已发送，2 已送达）
      "accountId": 1,
      "userId": 1,
      "createTime": "2099-12-30 23:59:59",
      "attList": []
    }
  ]
}
```

### 删除邮件

**接口说明**：删除当前用户的邮件。默认标记删除，系统开启同步删除时为永久删除

**接口地址**：`DELETE /api/email/delete`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数       | 类型     | 默认值 | 必填  | 说明              |
| -------- | ------ | --- | --- | --------------- |
| emailIds | string |     | 是   | 邮件 id，多个用英文逗号分隔 |

#### 请求示例

```bash
curl -X DELETE "https://skymail.ink/api/email/delete?emailIds=1,2" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 用户-邮箱地址

### 邮箱列表

**接口说明**：查询当前登录用户的邮箱地址，按置顶顺序分页

**接口地址**：`GET /api/account/list`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数        | 类型      | 默认值 | 必填  | 说明                                               |
| --------- | ------- | --- | --- | ------------------------------------------------ |
| size      | integer |     | 否   | 每页数量，最大 30                                       |
| accountId | integer |     | 否   | 游标邮箱 id，首次查询可不传                                  |
| lastSort  | integer |     | 否   | 游标排序值，首次查询可不传。下一页传入上一页最后一条的 `sort` 和 `accountId` |

#### 请求示例

```bash
curl -X GET "https://skymail.ink/api/account/list?size=15" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "accountId": 1,                         // 邮箱账号 id
      "email": "admin@example.com",           // 邮箱地址
      "name": "admin",                        // 邮箱名称
      "userId": 1,                            // 所属用户 id
      "allReceive": 0,                        // 是否全部收取（0 否，1 是）
      "sort": 0,                              // 排序值，越大越靠前
      "isDel": 0,                             // 是否删除（0 正常，1 已删除）
      "createTime": "2099-12-30 23:59:59"     // 创建时间
    }
  ]
}
```

### 添加邮箱

**接口说明**：为当前用户添加邮箱地址。邮箱域名必须是已配置的邮箱域名，不能添加已存在或已注销的地址

**接口地址**：`POST /api/account/add`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数    | 类型     | 默认值 | 必填  | 说明                            |
| ----- | ------ | --- | --- | ----------------------------- |
| email | string |     | 是   | 完整邮箱地址，例如 `hello@example.com` |
| token | string |     | 否   | 人机验证 token，系统开启添加邮箱验证时必填      |

#### 请求示例

```bash
curl -X POST "https://skymail.ink/api/account/add" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hello@example.com"
  }'
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "accountId": 2,                           // 邮箱账号 id
    "email": "hello@example.com",             // 邮箱地址
    "name": "hello",                          // 邮箱名称，自动截取邮箱前缀
    "userId": 1,
    "allReceive": 0,
    "sort": 0,
    "isDel": 0,
    "createTime": "2099-12-30 23:59:59",
    "addVerifyOpen": false                    // 下次添加是否需要人机验证
  }
}
```

### 删除邮箱

**接口说明**：删除当前用户的邮箱。不能删除登录主邮箱。默认标记删除，系统开启同步删除时为永久删除

**接口地址**：`DELETE /api/account/delete`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数        | 类型      | 默认值 | 必填  | 说明      |
| --------- | ------- | --- | --- | ------- |
| accountId | integer |     | 是   | 邮箱账号 id |

#### 请求示例

```bash
curl -X DELETE "https://skymail.ink/api/account/delete?accountId=2" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 管理-用户列表

### 用户列表

**接口说明**：分页查询用户，可按邮箱、状态、删除状态筛选

**接口地址**：`GET /api/user/list`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数       | 类型      | 默认值   | 必填  | 说明                                              |
| -------- | ------- | ----- | --- | ----------------------------------------------- |
| num      | integer | 1   | 否   | 页码                                              |
| size     | integer | 50  | 否   | 每页数量，最大 50                                     |
| email    | string  |       | 否   | 邮箱，前缀模糊匹配                                       |
| timeSort | integer |       | 否   | 时间排序（0 最新，1 最旧）                                 |
| status   | integer |       | 否   | 用户状态（0 正常，1 禁用）。传 0 或 1 时只返回未删除用户，不传或 -1 不按状态过滤 |
| isDel    | integer |       | 否   | 是否删除（0 正常，1 已删除）                                |

#### 请求示例

```bash
curl -X GET "https://skymail.ink/api/user/list?num=1&size=50" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "list": [
      {
        "userId": 1,                          // 用户 id
        "email": "admin@example.com",         // 用户邮箱
        "type": 0,                            // 权限身份 id（管理员为 0）
        "status": 0,                          // 用户状态（0 正常，1 禁用）
        "isDel": 0,                           // 是否删除（0 正常，1 已删除）
        "sendCount": 0,                       // 已发件次数
        "createTime": "2099-12-30 23:59:59",  // 注册时间
        "activeTime": "2099-12-30 23:59:59",  // 最近活跃时间
        "createIp": "127.0.0.1",              // 注册 IP
        "activeIp": "127.0.0.1",              // 最近活跃 IP
        "os": "Windows",                      // 操作系统
        "browser": "Chrome",                  // 浏览器
        "device": "Desktop",                  // 设备
        "receiveEmailCount": 10,              // 收件数量
        "sendEmailCount": 2,                  // 发件数量
        "accountCount": 1,                    // 邮箱数量
        "delReceiveEmailCount": 0,            // 已删除收件数量
        "delSendEmailCount": 0,               // 已删除发件数量
        "delAccountCount": 0,                 // 已删除邮箱数量
        "username": null,                     // 第三方登录用户名
        "name": null,                         // 第三方登录昵称
        "avatar": null,                       // 第三方登录头像
        "platform": null,                     // 第三方登录平台
        "trustLevel": null,                   // 第三方登录信任等级
        "sendAction": {
          "hasPerm": true,                    // 是否有发件权限
          "sendType": "count",                // 发件限制类型（count 总量，day 每日）
          "sendCount": 0                      // 发件次数上限，0 为不限制
        }
      }
    ]
  }
}
```

### 添加用户

**接口说明**：管理员添加用户，邮箱域名必须是已配置的邮箱域名，密码至少 6 位

**接口地址**：`POST /api/user/add`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数       | 类型      | 默认值 | 必填  | 说明                           |
| -------- | ------- | --- | --- | ---------------------------- |
| email    | string  |     | 是   | 完整邮箱地址，例如 `user@example.com` |
| password | string  |     | 是   | 密码，至少 6 位                    |

#### 请求示例

```bash
curl -X POST "https://skymail.ink/api/user/add" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 修改状态

**接口说明**：启用或禁用用户，禁用后该用户所有登录会话会失效

**接口地址**：`PUT /api/user/setStatus`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数     | 类型      | 默认值 | 必填  | 说明              |
| ------ | ------- | --- | --- | --------------- |
| userId | integer |     | 是   | 用户 id           |
| status | integer |     | 是   | 用户状态（0 正常，1 禁用） |

#### 请求示例

```bash
curl -X PUT "https://skymail.ink/api/user/setStatus" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "status": 1
  }'
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 删除用户

**接口说明**：永久删除用户及其邮箱、邮件、星标和第三方登录绑定，不可恢复

**接口地址**：`DELETE /api/user/delete`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数      | 类型     | 默认值 | 必填  | 说明              |
| ------- | ------ | --- | --- | --------------- |
| userIds | string |     | 是   | 用户 id，多个用英文逗号分隔 |

#### 请求示例

```bash
curl -X DELETE "https://skymail.ink/api/user/delete?userIds=1,2" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 管理-邮件列表

### 邮件列表

**接口说明**：查询全部用户的邮件，使用 `emailId` 游标分页，可按类型、发件人、主题、用户邮箱、收发邮箱筛选

**接口地址**：`GET /api/allEmail/list`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数           | 类型      | 默认值       | 必填  | 说明                                                              |
| ------------ | ------- | --------- | --- | --------------------------------------------------------------- |
| emailId      | integer |           | 否   | 游标邮件 id，首次查询可不传。`timeSort` 为 0 时查更早的邮件，为 1 时查更晚的邮件              |
| size         | integer | 10        | 否   | 每页数量，最大 50                                                      |
| timeSort     | integer |           | 否   | 时间排序（0 最新，1 最旧）                                                 |
| type         | string  | `receive` | 否   | 邮件类型（`all` 全部，`receive` 收件，`send` 发件，`delete` 已删除，`noone` 无人收件） |
| name         | string  |           | 否   | 发件人名字，前缀模糊匹配                                                    |
| subject      | string  |           | 否   | 邮件主题，前缀模糊匹配                                                     |
| userEmail    | string  |           | 否   | 所属用户邮箱，前缀模糊匹配                                                   |
| accountEmail | string  |           | 否   | 发件人或收件人邮箱，前缀模糊匹配                                                |
| full         | integer | 1         | 否   | 是否返回完整字段（0 摘要，1 完整正文和附件）                                        |

#### 请求示例

```bash
curl -X GET "https://skymail.ink/api/allEmail/list?type=receive&size=10" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "latestEmail": {
      "emailId": 999,                         // 最新一封收件 id，用于轮询刷新
      "accountId": 1,
      "userId": 1
    },
    "list": [
      {
        "emailId": 999,                       // 邮件 id
        "sendEmail": "hello@example.com",     // 发件人邮箱
        "name": "hello",                      // 发件人名字
        "subject": "Hello word",              // 邮件主题
        "toEmail": "admin@example.com",       // 收件人邮箱
        "toName": "admin",                    // 收件人名字
        "userEmail": "admin@example.com",     // 所属用户邮箱
        "accountId": 1,                       // 邮箱账号 id
        "userId": 1,                          // 所属用户 id
        "type": 0,                            // 邮件类型（0 收件，1 发件）
        "status": 0,                          // 邮件状态（0 收件，1 已发送，2 已送达，3 退信，4 投诉，5 延迟，6 保存中，7 无人收件，8 失败）
        "unread": 0,                          // 是否未读（0 未读，1 已读）
        "isDel": 0,                           // 是否删除（0 正常，1 已删除）
        "content": "<div>Hello word</div>",   // 邮件 HTML，full=1 时返回
        "text": "Hello word",                 // 邮件纯文本
        "cc": "[]",                           // 抄送
        "bcc": "[]",                          // 密送
        "createTime": "2099-12-30 23:59:59",  // 接收或发送时间（UTC）
        "attList": [                          // 附件列表，full=1 时返回
          {
            "attId": 1,
            "filename": "file.txt",
            "mimeType": "text/plain",
            "size": 1024
          }
        ]
      }
    ]
  }
}
```

### 删除邮件

**接口说明**：永久删除指定邮件及其附件、星标，不可恢复

**接口地址**：`DELETE /api/allEmail/delete`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数       | 类型     | 默认值 | 必填  | 说明              |
| -------- | ------ | --- | --- | --------------- |
| emailIds | string |     | 是   | 邮件 id，多个用英文逗号分隔 |

#### 请求示例

```bash
curl -X DELETE "https://skymail.ink/api/allEmail/delete?emailIds=1,2" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 管理-注册码

### 注册码列表

**接口说明**：查询全部注册码，可按注册码前缀筛选。已过期的注册码 `expireTime` 返回 `null`

**接口地址**：`GET /api/regKey/list`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数   | 类型     | 默认值 | 必填  | 说明         |
| ---- | ------ | --- | --- | ---------- |
| code | string |     | 否   | 注册码，前缀模糊匹配 |

#### 请求示例

```bash
curl -X GET "https://skymail.ink/api/regKey/list?code=Ab12" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "regKeyId": 1,                          // 注册码 id
      "code": "Ab12Cd34",                     // 注册码
      "count": 10,                            // 剩余使用次数
      "roleId": 1,                            // 权限身份 id
      "roleName": "普通用户",                  // 权限身份名
      "userId": 1,                            // 创建人用户 id
      "expireTime": "2099-12-30 00:00:00",    // 有效期，已过期为 null
      "createTime": "2099-12-30 23:59:59"     // 创建时间
    }
  ]
}
```

### 添加注册码

**接口说明**：创建注册码。注册码不能重复，使用该注册码注册的用户会获得对应权限身份

**接口地址**：`POST /api/regKey/add`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数         | 类型      | 默认值 | 必填  | 说明                  |
| ---------- | ------- | --- | --- | ------------------- |
| code       | string  |     | 是   | 注册码                 |
| roleId     | integer |     | 是   | 权限身份 id             |
| count      | integer |     | 是   | 可使用次数               |
| expireTime | string  |     | 是   | 有效期，例如 `2099-12-30` |

#### 请求示例

```bash
curl -X POST "https://skymail.ink/api/regKey/add" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "Ab12Cd34",
    "roleId": 1,
    "count": 10,
    "expireTime": "2099-12-30"
  }'
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 使用记录

**接口说明**：查询使用该注册码完成注册的用户列表

**接口地址**：`GET /api/regKey/history`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数       | 类型      | 默认值 | 必填  | 说明     |
| -------- | ------- | --- | --- | ------ |
| regKeyId | integer |     | 是   | 注册码 id |

#### 请求示例

```bash
curl -X GET "https://skymail.ink/api/regKey/history?regKeyId=1" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "email": "user@example.com",            // 注册用户邮箱
      "createTime": "2099-12-30 23:59:59"     // 注册时间
    }
  ]
}
```

### 删除注册码

**接口说明**：删除指定注册码

**接口地址**：`DELETE /api/regKey/delete`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数        | 类型     | 默认值 | 必填  | 说明               |
| --------- | ------ | --- | --- | ---------------- |
| regKeyIds | string |     | 是   | 注册码 id，多个用英文逗号分隔 |

#### 请求示例

```bash
curl -X DELETE "https://skymail.ink/api/regKey/delete?regKeyIds=1,2" \
  -H "Authorization: YOUR_TOKEN"
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 开放 API（已弃用）

::: tip
有些请求参数支持模糊匹配，可以传入%， 示例：'admin' 等值匹配， 'admin%' 开头匹配，  '%@example.com' 结尾匹配， '%admin%' 包含匹配
:::

### 生成Token

**接口说明**：用于生成确认身份的令牌，填入Authorization请求头，全局只有一个，重新生成旧的会失效

**接口地址**：`POST /api/public/genToken`

#### 请求参数

| 参数       | 类型     | 默认值 | 必填  | 说明    |
| -------- | ------ | --- | --- | ----- |
| email    | string |     | 是   | 管理员邮箱 |
| password | string |     | 是   | 邮箱密码  |

#### 请求示例

```bash
curl -X POST "https://skymail.ink/api/public/genToken" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
      "token": "9f4e298e-7431-4c76-bc15-4931c3a73984"
  }
}

```

### 邮件查询

**接口地址**：`POST /api/public/emailList`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数        | 类型      | 默认值  | 必填  | 说明                   |
| --------- | ------- | ---- | --- | -------------------- |
| toEmail   | string  |      | 否   | 收件人邮箱，支持模糊           |
| sendName  | string  |      | 否   | 发件人名字，支持模糊           |
| sendEmail | sting   |      | 否   | 发件人邮箱，支持模糊           |
| subject   | sting   |      | 否   | 邮件主题，支持模糊            |
| content   | string  |      | 否   | 邮件html，支持模糊          |
| timeSort  | string  | desc | 否   | 时间排序（asc 最旧，desc 最新） |
| type      | integer |      | 否   | 邮件类型 （0 收件，1发件，空 全部） |
| isDel     | integer |      | 否   | 是否删除 （0 正常，2删除，空 全部） |
| num       | integer | 1    | 否   | 页码                   |
| size      | integer | 20   | 否   | 每页数量                 |

#### 请求示例

```bash
curl -X POST "https://skymail.ink/api/public/emailList" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "toEmail": "admin@example.com",
    "sendName": "hello",
    "sendEmail": "hello@example.com",
    "subject": "Hello",
    "timeSort": "desc",
    "type": 0,
    "num": 1,
    "size": 20
  }'
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "emailId": 999,                         // 邮件id
      "sendEmail": "hello@example.com",       // 发件人邮箱
      "sendName": "hello",                    // 发件人名字
      "subject": "Hello word",                // 邮件主题
      "toEmail": "admin@example.com",         // 收件人邮箱
      "toName": "admin",                      // 收件人名字
      "createTime": "2099-12-30 23:99:99",    // 接收或发送的时间（UTC 时间）
      "type": 0,                              // 邮件类型 （0 收件 1 发件）
      "content": "<div>Hello word</div>",     // 邮件HTML
      "text": "Hello word",                   // 邮件纯文本
      "isDel": 0                              // 是否删除 （0 正常 1 删除）
    }
  ]
}

```

### 添加用户

**接口地址**：`POST /api/public/addUser`

#### 请求头

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

#### 请求参数

| 参数          | 类型                   | 默认值 | 必填  | 说明                 |
| ----------- | -------------------- | --- | --- | ------------------ |
| list        | array &lt;object&gt; |     | 用户  | 数组                 |
| └─ email    | string               |     | 是   | 邮箱地址               |
| └─ password | sting                |     | 否   | 密码，不填自动生成          |
| └─ roleName | sting                |     | 否   | 权限身份名，不填自动选择默认权限身份 |

#### 请求示例

```bash
curl -X POST "https://skymail.ink/api/public/addUser" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "list": [
      {
        "email": "user@example.com",
        "password": "password",
        "roleName": "普通用户"
      }
    ]
  }'
```

#### 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": null
}

```

