# Inventory Service

API quản lý tồn kho với Express và Mongoose.

## Cài đặt

```bash
npm install
copy .env.example .env
npm run dev
```

## API

### Tạo product

`POST /api/products`

```json
{
  "name": "IPhone 16",
  "price": 25000,
  "description": "Phone"
}
```

Khi tạo product thành công, hệ thống tự tạo 1 inventory tương ứng.

### Get all inventories

`GET /api/inventories`

### Get inventory by ID

`GET /api/inventories/:id`

### Add stock

`POST /api/inventories/add-stock`

```json
{
  "product": "PRODUCT_ID",
  "quantity": 10
}
```

### Remove stock

`POST /api/inventories/remove-stock`

```json
{
  "product": "PRODUCT_ID",
  "quantity": 2
}
```

### Reservation

`POST /api/inventories/reservation`

```json
{
  "product": "PRODUCT_ID",
  "quantity": 3
}
```

### Sold

`POST /api/inventories/sold`

```json
{
  "product": "PRODUCT_ID",
  "quantity": 1
}
```
