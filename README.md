# Inventory API - NNPTUD ST4

## Cai dat
npm install

## Chay chuong trinh
npm start

Server chay tai:
http://localhost:3000

## User APIs
### Register
POST /api/users/register

```json
{
  "name": "User One",
  "email": "user1@gmail.com",
  "password": "123456"
}
```

### Login
POST /api/users/login

```json
{
  "email": "user1@gmail.com",
  "password": "123456"
}
```

Login tra ve `_id`. Dung `_id` nay de gan vao header `x-user-id` khi test message.

## Message APIs
De bai chua co auth day du, nen user hien tai duoc lay tu header `x-user-id`.

### 1. Gui tin nhan
POST /api/messages

Gui text:
```json
{
  "to": "USER_2_ID",
  "text": "Xin chao"
}
```

Gui file:
```json
{
  "to": "USER_2_ID",
  "filePath": "uploads/files/document.pdf"
}
```

### 2. Lay toan bo tin nhan giua user hien tai va user khac
GET /api/messages/:userID

### 3. Lay tin nhan cuoi cung cua moi user tung nhan/gui
GET /api/messages

## Postman
Import file:
postman/message-api.postman_collection.json

Thu tu test:
1. Register User 1
2. Register User 2
3. Login User 1 va copy `_id`
4. Login User 2 va copy `_id`
5. Gan `_id` vao `x-user-id` va `to`
6. Test 3 router message

## Goi y nop bai Word
- Anh 1: Register thanh cong
- Anh 2: Login thanh cong va thay `_id`
- Anh 3: POST gui text thanh cong
- Anh 4: POST gui file thanh cong
- Anh 5: GET /api/messages/:userID
- Anh 6: GET /api/messages
- Kem hinh `git status` hoac commit hash neu giang vien yeu cau nop git
