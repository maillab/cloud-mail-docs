# 接口文档

::: tip
有些请求参数支持模糊匹配，可以传入%， 示例：'admin' 等值匹配， 'admin%' 开头匹配，  '%@example.com' 结尾匹配， '%admin%' 包含匹配
:::

## 生成Token

**接口说明**：用于生成确认身份的令牌，填入Authorization请求头，全局只有一个，重新生成旧的会失效

**接口地址**：`POST /api/public/genToken`

**请求参数**

| 参数     | 类型   | 必填 | 说明       |
| -------- | ------ | ---- | ---------- |
| email    | string | 是   | 管理员邮箱 |
| password | string | 是   | 邮箱密码   |

**返回示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
      "token": "9f4e298e-7431-4c76-bc15-4931c3a73984"
  }
}

```


## 邮件查询



**接口地址**：`POST /api/public/emailList`

**请求头**

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

**请求参数**

| 参数      | 类型    | 必填 | 默认值  | 说明                                     |
| --------- | ------- | ---- |------| ---------------------------------------- |
| toEmail   | string  | 否   |      | 收件人邮箱，支持模糊                     |
| sendName  | string  | 否   |      | 发件人名字，支持模糊                     |
| sendEmail | sting   | 否   |      | 发件人邮箱，支持模糊                     |
| subject   | sting   | 否   |      | 邮件主题，支持模糊                       |
| content   | string  | 否   |      | 邮件html，支持模糊                       |
| timeSort  | string  | 否   | desc | 时间排序（asc 最旧，desc 最新） |
| type      | integer | 否   |      | 邮件类型 （0 收件，1发件，空 全部）      |
| isDel     | integer | 否   |      | 是否删除 （0 正常，2删除，空 全部）      |
| num       | integer | 否   | 1    | 页码                                     |
| size      | integer | 否   | 20   | 每页数量                                 |

**返回示例**

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


## 添加用户


**接口地址**：`POST /api/public/addUser`

**请求头**

| Header        | 必填 | 说明     |
| ------------- | ---- | -------- |
| Authorization | 是   | 身份令牌 |

**请求参数**

| 参数        | 类型                 | 必填 | 描述                                 |
| ----------- | -------------------- | ---- | ------------------------------------ |
| list        | array &lt;object&gt; | 用户 | 数组                                 |
| └─ email    | string               | 是   | 邮箱地址                             |
| └─ password | sting                | 否   | 密码，不填自动生成                   |
| └─ roleName | sting                | 否   | 权限身份名，不填自动选择默认权限身份 |

**返回示例**

```json
{
  "code": 200,
  "message": "success",
  "data": null
}

```


