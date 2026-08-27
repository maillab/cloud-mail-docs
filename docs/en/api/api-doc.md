# API Document

::: tip
Except for Sign In, send the token from Sign In in the `Authorization` header (do not add a Bearer prefix). Admin APIs require the matching permission; Admin accounts are unrestricted.
:::

## Sign-In API

### Sign In

**Description**: Sign in with Email and Password, returns an auth token

**Endpoint**: `POST /api/login`

#### Request Parameters

| Parameter | Type   | Default | Required | Description                                      |
| --------- | ------ | ------- | -------- | ------------------------------------------------ |
| email     | string |         | Yes      | Full email address, e.g. `admin@example.com`     |
| password  | string |         | Yes      | Email Password                                   |

#### Request Example

```bash
curl -X POST "https://skymail.ink/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Current User Info

**Description**: Get the current signed-in user's account, Role, and permission list

**Endpoint**: `GET /api/my/loginUserInfo`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Example

```bash
curl -X GET "https://skymail.ink/api/my/loginUserInfo" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": {
      "userId": 1,                          // User id
      "email": "admin@example.com",         // User Email
      "name": "admin",                      // Username
      "type": 0,                            // Role id (Admin is 0)
      "sendCount": 0,                       // Sent count
      "permKeys": ["*"],                    // Permission list, Admin is ["*"]
      "account": {
          "accountId": 1,                   // Address id
          "email": "admin@example.com",
          "name": "admin"
      },
      "role": {
          "name": "admin",                  // Role name
          "sendCount": 0,                   // Send limit, 0 is Unlimited
          "sendType": "count",              // Send limit type (count total, day Daily)
          "accountCount": 0                 // Address quota, 0 is Unlimited
      }
  }
}
```

## User - Email

### Email List

**Description**: Query emails of the current signed-in user, using `emailId` cursor pagination

**Endpoint**: `GET /api/email/list`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter  | Type    | Default | Required | Description                                                                                          |
| ---------- | ------- | ------- | -------- | ---------------------------------------------------------------------------------------------------- |
| accountId  | integer |         | Yes      | Address id                                                                                           |
| type       | integer | 0       | No       | Email type (0 Received, 1 Sent)                                                                      |
| emailId    | integer |         | No       | Cursor email id, optional for the first query. When `timeSort` is 0 fetch older emails, when 1 fetch newer emails |
| size       | integer | 10      | No       | Page size, max 50                                                                                    |
| timeSort   | integer |         | No       | Time sort (0 newest, 1 oldest)                                                                       |
| allReceive | integer |         | No       | Whether to query all addresses of this user (0 No, 1 Yes). If omitted, uses this Address's own receive-all setting |
| full       | integer | 1       | No       | Whether to return full fields (0 summary, 1 full body and Attachments)                               |

#### Request Example

```bash
curl -X GET "https://skymail.ink/api/email/list?accountId=1&size=10" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

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
        "emailId": 999,                       // Email id
        "sendEmail": "hello@example.com",     // Sender email
        "name": "hello",                      // Sender name
        "subject": "Hello word",              // Subject
        "toEmail": "admin@example.com",       // To email
        "accountId": 1,                       // Address id
        "type": 0,                            // Email type (0 Received, 1 Sent)
        "status": 0,                          // Email status (0 Received, 1 Sent, 2 Delivered, 3 Bounced, 4 Complained, 5 Delayed, 6 Saving, 7 No recipient, 8 Failed)
        "unread": 0,                          // Unread (0 unread, 1 read)
        "isDel": 0,                           // Deleted (0 Normal, 1 Deleted)
        "isStar": 0,                          // Starred (0 No, 1 Yes)
        "content": "<div>Hello word</div>",   // Email HTML, returned when full=1
        "text": "Hello word",                 // Email plain text
        "createTime": "2099-12-30 23:59:59",  // Received or Sent time (UTC)
        "attList": [                          // Attachments list, returned when full=1
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

### Send Email

**Description**: Send email using the current user's Address. Maximum 10 Attachments, maximum 10 inline images in the body

**Endpoint**: `POST /api/email/send`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter      | Type                 | Default | Required | Description                                                          |
| -------------- | -------------------- | ------- | -------- | -------------------------------------------------------------------- |
| accountId      | integer              |         | Yes      | From Address id                                                      |
| receiveEmail   | array &lt;string&gt; |         | Yes      | To email list                                                        |
| subject        | string               |         | Yes      | Subject                                                              |
| content        | string               |         | Yes      | Email HTML                                                           |
| text           | string               |         | No       | Email plain text                                                     |
| name           | string               |         | No       | Sender name, auto-extracted from email prefix if omitted             |
| sendType       | string               |         | No       | Send type (empty new email, `reply` Reply, `forward` Forward)        |
| emailId        | integer              |         | No       | Original email id, required when `sendType` is `reply`               |
| attachments    | array &lt;object&gt; |         | No       | Attachments list                                                     |
| └─ filename    | string               |         | Yes      | Filename                                                             |
| └─ content     | string               |         | Yes      | File content, Base64                                                 |
| └─ contentType | string               |         | No       | File MIME type                                                       |
| └─ size        | integer              |         | No       | File size                                                            |

#### Request Example

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

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "emailId": 999,                         // Email id
      "sendEmail": "admin@example.com",       // Sender email
      "name": "admin",                        // Sender name
      "subject": "Hello word",                // Subject
      "content": "<div>Hello word</div>",     // Email HTML
      "text": "Hello word",                   // Email plain text
      "type": 1,                              // Email type (1 Sent)
      "status": 1,                            // Email status (1 Sent, 2 Delivered)
      "accountId": 1,
      "userId": 1,
      "createTime": "2099-12-30 23:59:59",
      "attList": []
    }
  ]
}
```

### Delete Email

**Description**: Delete the current user's emails. Marks as deleted by default; permanently deletes when system Sync Delete is enabled

**Endpoint**: `DELETE /api/email/delete`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type   | Default | Required | Description                                      |
| --------- | ------ | ------- | -------- | ------------------------------------------------ |
| emailIds  | string |         | Yes      | Email ids, multiple values separated by commas   |

#### Request Example

```bash
curl -X DELETE "https://skymail.ink/api/email/delete?emailIds=1,2" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## User - Address

### Address List

**Description**: Query email addresses of the current signed-in user, paginated by Pin order

**Endpoint**: `GET /api/account/list`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type    | Default | Required | Description                                                                                          |
| --------- | ------- | ------- | -------- | ---------------------------------------------------------------------------------------------------- |
| size      | integer |         | No       | Page size, max 30                                                                                    |
| accountId | integer |         | No       | Cursor Address id, optional for the first query                                                      |
| lastSort  | integer |         | No       | Cursor sort value, optional for the first query. For the next page, pass `sort` and `accountId` of the last item from the previous page |

#### Request Example

```bash
curl -X GET "https://skymail.ink/api/account/list?size=15" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "accountId": 1,                         // Address id
      "email": "admin@example.com",           // Email
      "name": "admin",                        // Address name
      "userId": 1,                            // Owner user id
      "allReceive": 0,                        // Receive all (0 No, 1 Yes)
      "sort": 0,                              // Sort value, larger means more Pin
      "isDel": 0,                             // Deleted (0 Normal, 1 Deleted)
      "createTime": "2099-12-30 23:59:59"     // Created time
    }
  ]
}
```

### Add Email Address

**Description**: Add an email address for the current user. The email domain must be a configured email domain. Cannot add an Address that already exists or has been cancelled

**Endpoint**: `POST /api/account/add`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type   | Default | Required | Description                                                          |
| --------- | ------ | ------- | -------- | -------------------------------------------------------------------- |
| email     | string |         | Yes      | Full email address, e.g. `hello@example.com`                         |
| token     | string |         | No       | Captcha token, required when the system has Add Email Verification enabled |

#### Request Example

```bash
curl -X POST "https://skymail.ink/api/account/add" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hello@example.com"
  }'
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "accountId": 2,                           // Address id
    "email": "hello@example.com",             // Email
    "name": "hello",                          // Address name, auto-extracted from email prefix
    "userId": 1,
    "allReceive": 0,
    "sort": 0,
    "isDel": 0,
    "createTime": "2099-12-30 23:59:59",
    "addVerifyOpen": false                    // Whether captcha is required for the next add
  }
}
```

### Delete Address

**Description**: Delete the current user's Address. Cannot delete the Sign-In primary email. Marks as deleted by default; permanently deletes when system Sync Delete is enabled

**Endpoint**: `DELETE /api/account/delete`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type    | Default | Required | Description |
| --------- | ------- | ------- | -------- | ----------- |
| accountId | integer |         | Yes      | Address id  |

#### Request Example

```bash
curl -X DELETE "https://skymail.ink/api/account/delete?accountId=2" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## Admin - All Users

### User List

**Description**: Paginated user query, filterable by Email, status, and deletion status

**Endpoint**: `GET /api/user/list`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type    | Default | Required | Description                                                                                          |
| --------- | ------- | ------- | -------- | ---------------------------------------------------------------------------------------------------- |
| num       | integer | 1       | No       | Page number                                                                                          |
| size      | integer | 50      | No       | Page size, max 50                                                                                    |
| email     | string  |         | No       | Email, prefix fuzzy match                                                                            |
| timeSort  | integer |         | No       | Time sort (0 newest, 1 oldest)                                                                       |
| status    | integer |         | No       | User status (0 Normal, 1 Disabled). When 0 or 1, only returns non-deleted users; omit or -1 to not filter by status |
| isDel     | integer |         | No       | Deleted (0 Normal, 1 Deleted)                                                                        |

#### Request Example

```bash
curl -X GET "https://skymail.ink/api/user/list?num=1&size=50" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "list": [
      {
        "userId": 1,                          // User id
        "email": "admin@example.com",         // User Email
        "type": 0,                            // Role id (Admin is 0)
        "status": 0,                          // User status (0 Normal, 1 Disabled)
        "isDel": 0,                           // Deleted (0 Normal, 1 Deleted)
        "sendCount": 0,                       // Sent count
        "createTime": "2099-12-30 23:59:59",  // Registration time
        "activeTime": "2099-12-30 23:59:59",  // Recent Activity time
        "createIp": "127.0.0.1",              // Registration IP
        "activeIp": "127.0.0.1",              // Recent IP
        "os": "Windows",                      // OS
        "browser": "Chrome",                  // Browser
        "device": "Desktop",                  // Device
        "receiveEmailCount": 10,              // Received count
        "sendEmailCount": 2,                  // Sent count
        "accountCount": 1,                    // Address count
        "delReceiveEmailCount": 0,            // Deleted Received count
        "delSendEmailCount": 0,               // Deleted Sent count
        "delAccountCount": 0,                 // Deleted Address count
        "username": null,                     // Third-party login Username
        "name": null,                         // Third-party login nickname
        "avatar": null,                       // Third-party login avatar
        "platform": null,                     // Third-party login platform
        "trustLevel": null,                   // Third-party login Level
        "sendAction": {
          "hasPerm": true,                    // Has send permission
          "sendType": "count",                // Send limit type (count total, day Daily)
          "sendCount": 0                      // Send limit, 0 is Unlimited
        }
      }
    ]
  }
}
```

### Add User

**Description**: Admin adds a user. The email domain must be a configured email domain. Password must be at least 6 characters

**Endpoint**: `POST /api/user/add`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type    | Default | Required | Description                                      |
| --------- | ------- | ------- | -------- | ------------------------------------------------ |
| email     | string  |         | Yes      | Full email address, e.g. `user@example.com`      |
| password  | string  |         | Yes      | Password, at least 6 characters                  |

#### Request Example

```bash
curl -X POST "https://skymail.ink/api/user/add" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### Change Status

**Description**: Enable or Disable a user. After Disabled, all of that user's Sign-In sessions become invalid

**Endpoint**: `PUT /api/user/setStatus`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type    | Default | Required | Description                          |
| --------- | ------- | ------- | -------- | ------------------------------------ |
| userId    | integer |         | Yes      | User id                              |
| status    | integer |         | Yes      | User status (0 Normal, 1 Disabled)   |

#### Request Example

```bash
curl -X PUT "https://skymail.ink/api/user/setStatus" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "status": 1
  }'
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### Delete User

**Description**: Permanently delete a user and their addresses, emails, Starred items, and third-party login bindings. Cannot be recovered

**Endpoint**: `DELETE /api/user/delete`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type   | Default | Required | Description                                    |
| --------- | ------ | ------- | -------- | ---------------------------------------------- |
| userIds   | string |         | Yes      | User ids, multiple values separated by commas  |

#### Request Example

```bash
curl -X DELETE "https://skymail.ink/api/user/delete?userIds=1,2" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## Admin - All Mail

### Email List

**Description**: Query emails of all users, using `emailId` cursor pagination. Filterable by type, Sender, Subject, user Email, and send/receive Address

**Endpoint**: `GET /api/allEmail/list`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter    | Type    | Default   | Required | Description                                                                                          |
| ------------ | ------- | --------- | -------- | ---------------------------------------------------------------------------------------------------- |
| emailId      | integer |           | No       | Cursor email id, optional for the first query. When `timeSort` is 0 fetch older emails, when 1 fetch newer emails |
| size         | integer | 10        | No       | Page size, max 50                                                                                    |
| timeSort     | integer |           | No       | Time sort (0 newest, 1 oldest)                                                                       |
| type         | string  | `receive` | No       | Email type (`all` All, `receive` Received, `send` Sent, `delete` Deleted, `noone` No recipient)      |
| name         | string  |           | No       | Sender name, prefix fuzzy match                                                                      |
| subject      | string  |           | No       | Subject, prefix fuzzy match                                                                          |
| userEmail    | string  |           | No       | User Email, prefix fuzzy match                                                                       |
| accountEmail | string  |           | No       | Sender or To email, prefix fuzzy match                                                               |
| full         | integer | 1         | No       | Whether to return full fields (0 summary, 1 full body and Attachments)                               |

#### Request Example

```bash
curl -X GET "https://skymail.ink/api/allEmail/list?type=receive&size=10" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "latestEmail": {
      "emailId": 999,                         // Latest Received email id, used for polling refresh
      "accountId": 1,
      "userId": 1
    },
    "list": [
      {
        "emailId": 999,                       // Email id
        "sendEmail": "hello@example.com",     // Sender email
        "name": "hello",                      // Sender name
        "subject": "Hello word",              // Subject
        "toEmail": "admin@example.com",       // To email
        "toName": "admin",                    // To name
        "userEmail": "admin@example.com",     // User Email
        "accountId": 1,                       // Address id
        "userId": 1,                          // User id
        "type": 0,                            // Email type (0 Received, 1 Sent)
        "status": 0,                          // Email status (0 Received, 1 Sent, 2 Delivered, 3 Bounced, 4 Complained, 5 Delayed, 6 Saving, 7 No recipient, 8 Failed)
        "unread": 0,                          // Unread (0 unread, 1 read)
        "isDel": 0,                           // Deleted (0 Normal, 1 Deleted)
        "content": "<div>Hello word</div>",   // Email HTML, returned when full=1
        "text": "Hello word",                 // Email plain text
        "cc": "[]",                           // CC
        "bcc": "[]",                          // BCC
        "createTime": "2099-12-30 23:59:59",  // Received or Sent time (UTC)
        "attList": [                          // Attachments list, returned when full=1
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

### Delete Email

**Description**: Permanently delete specified emails and their Attachments and Starred items. Cannot be recovered

**Endpoint**: `DELETE /api/allEmail/delete`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type   | Default | Required | Description                                      |
| --------- | ------ | ------- | -------- | ------------------------------------------------ |
| emailIds  | string |         | Yes      | Email ids, multiple values separated by commas   |

#### Request Example

```bash
curl -X DELETE "https://skymail.ink/api/allEmail/delete?emailIds=1,2" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## Admin - Invite Code

### Invite Code List

**Description**: Query all Invite Codes, filterable by Invite Code prefix. Expired Invite Codes return `null` for `expireTime`

**Endpoint**: `GET /api/regKey/list`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type   | Default | Required | Description                       |
| --------- | ------ | ------- | -------- | --------------------------------- |
| code      | string |         | No       | Invite Code, prefix fuzzy match   |

#### Request Example

```bash
curl -X GET "https://skymail.ink/api/regKey/list?code=Ab12" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "regKeyId": 1,                          // Invite Code id
      "code": "Ab12Cd34",                     // Invite Code
      "count": 10,                            // Remaining Uses
      "roleId": 1,                            // Role id
      "roleName": "user",                     // Role name
      "userId": 1,                            // Creator user id
      "expireTime": "2099-12-30 00:00:00",    // Valid Until, null if Expired
      "createTime": "2099-12-30 23:59:59"     // Created time
    }
  ]
}
```

### Add Invite Code

**Description**: Create an Invite Code. Invite Codes cannot be duplicated. Users who sign up with this Invite Code receive the corresponding Role

**Endpoint**: `POST /api/regKey/add`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter  | Type    | Default | Required | Description                          |
| ---------- | ------- | ------- | -------- | ------------------------------------ |
| code       | string  |         | Yes      | Invite Code                          |
| roleId     | integer |         | Yes      | Role id                              |
| count      | integer |         | Yes      | Available uses                       |
| expireTime | string  |         | Yes      | Valid Until, e.g. `2099-12-30`       |

#### Request Example

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

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### History

**Description**: Query the list of users who completed sign-up with this Invite Code

**Endpoint**: `GET /api/regKey/history`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type    | Default | Required | Description     |
| --------- | ------- | ------- | -------- | --------------- |
| regKeyId  | integer |         | Yes      | Invite Code id  |

#### Request Example

```bash
curl -X GET "https://skymail.ink/api/regKey/history?regKeyId=1" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "email": "user@example.com",            // Registered user Email
      "createTime": "2099-12-30 23:59:59"     // Registration time
    }
  ]
}
```

### Delete Invite Code

**Description**: Delete specified Invite Codes

**Endpoint**: `DELETE /api/regKey/delete`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type   | Default | Required | Description                                           |
| --------- | ------ | ------- | -------- | ----------------------------------------------------- |
| regKeyIds | string |         | Yes      | Invite Code ids, multiple values separated by commas  |

#### Request Example

```bash
curl -X DELETE "https://skymail.ink/api/regKey/delete?regKeyIds=1,2" \
  -H "Authorization: YOUR_TOKEN"
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## Open API (Deprecated)

::: tip
Some request parameters support fuzzy matching using %. Examples: 'admin' for exact match, 'admin%' for prefix match, '%@example.com' for suffix match, and '%admin%' for contains match.
:::

### Generate Token

**Description**: Generates an authentication token for the Authorization header. Only one global token is active; regenerating it invalidates the previous one

**Endpoint**: `POST /api/public/genToken`

#### Request Parameters

| Parameter | Type   | Default | Required | Description  |
| --------- | ------ | ------- | -------- | ------------ |
| email     | string |         | Yes      | Admin Email  |
| password  | string |         | Yes      | Email Password |

#### Request Example

```bash
curl -X POST "https://skymail.ink/api/public/genToken" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": {
      "token": "9f4e298e-7431-4c76-bc15-4931c3a73984"
  }
}
```

### Email Query

**Endpoint**: `POST /api/public/emailList`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter | Type    | Default | Required | Description                                          |
| --------- | ------- | ------- | -------- | ---------------------------------------------------- |
| toEmail   | string  |         | No       | To email, supports fuzzy matching                    |
| sendName  | string  |         | No       | Sender name, supports fuzzy matching                 |
| sendEmail | string  |         | No       | Sender email, supports fuzzy matching                |
| subject   | string  |         | No       | Subject, supports fuzzy matching                     |
| content   | string  |         | No       | Email HTML, supports fuzzy matching                  |
| timeSort  | string  | desc    | No       | Time sort (`asc` oldest, `desc` newest)              |
| type      | integer |         | No       | Email type (0 Received, 1 Sent, empty All)           |
| isDel     | integer |         | No       | Deleted (0 Normal, 2 Deleted, empty All)             |
| num       | integer | 1       | No       | Page number                                          |
| size      | integer | 20      | No       | Page size                                            |

#### Request Example

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

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "emailId": 999,                         // Email id
      "sendEmail": "hello@example.com",       // Sender email
      "sendName": "hello",                    // Sender name
      "subject": "Hello word",                // Subject
      "toEmail": "admin@example.com",         // To email
      "toName": "admin",                      // To name
      "createTime": "2099-12-30 23:99:99",    // Received or Sent time (UTC)
      "type": 0,                              // Email type (0 Received, 1 Sent)
      "content": "<div>Hello word</div>",     // Email HTML
      "text": "Hello word",                   // Email plain text
      "isDel": 0                              // Deleted (0 Normal, 1 Deleted)
    }
  ]
}
```

### Add User

**Endpoint**: `POST /api/public/addUser`

#### Request Header

| Header        | Required | Description |
| ------------- | -------- | ----------- |
| Authorization | Yes      | Auth token  |

#### Request Parameters

| Parameter     | Type                 | Default | Required | Description                                          |
| ------------- | -------------------- | ------- | -------- | ---------------------------------------------------- |
| list          | array &lt;object&gt; |         | Yes      | Array                                                |
| └─ email      | string               |         | Yes      | Email                                                |
| └─ password   | string               |         | No       | Password, auto-generated if omitted                  |
| └─ roleName   | string               |         | No       | Role name, uses the default Role if omitted          |

#### Request Example

```bash
curl -X POST "https://skymail.ink/api/public/addUser" \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "list": [
      {
        "email": "user@example.com",
        "password": "password",
        "roleName": "user"
      }
    ]
  }'
```

#### Response Example

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```
