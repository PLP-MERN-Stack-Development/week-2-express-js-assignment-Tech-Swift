# 🛒 Product API

A RESTful API built with **Express.js** and **MongoDB** for managing products, with features like authentication, pagination, category filtering, search, and error handling.

---

## 📦 Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- Custom Error Handling
- API Key Authentication Middleware

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/product-api.git
cd product-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

### 4. Start the Server

```bash
npm start
```

Server will run on: `http://localhost:3000`

---

## 🔐 API Key Authentication

All routes under `/api/products` are protected and require an `x-api-key` header.

```
x-api-key: Password@2027!
```

---

## 📘 API Endpoints

### Base URL: `/api/products`

| Method | Endpoint                | Description                           |
|--------|-------------------------|---------------------------------------|
| GET    | `/`                     | List all products                     |
| GET    | `/?category=value`      | Filter products by category           |
| GET    | `/?page=1&limit=10`     | Pagination                            |
| GET    | `/search?name=term`     | Search products by name               |
| GET    | `/stats`                | Get product statistics by category    |
| GET    | `/:id`                  | Get a single product by ID            |
| POST   | `/`                     | Create a new product                  |
| PUT    | `/:id`                  | Update a product                      |
| DELETE | `/:id`                  | Delete a product                      |
| GET    | `/error`                | Force a sync error (test)            |
| GET    | `/async-error`          | Force an async error (test)          |

---

## 🧪 Request & Response Examples

### 🔍 GET Products (with pagination)

```
GET /api/products?page=1&limit=2
```

**Response:**
```json
[
  {
    "_id": "664e1c123abc",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  }
]
```

---

### ➕ POST /api/products

**Headers:**
```
x-api-key: Password@2027!
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Blender",
  "description": "Powerful blender with glass jar",
  "price": 85,
  "category": "kitchen",
  "inStock": true
}
```

**Response:**
```json
{
  "_id": "664e8bcd1abc",
  "name": "Blender",
  "description": "Powerful blender with glass jar",
  "price": 85,
  "category": "kitchen",
  "inStock": true
}
```

---

### ❌ Error Response Example

```json
{
  "status": "error",
  "error": {
    "name": "NotFoundError",
    "message": "Product with ID xyz not found",
    "statusCode": 404
  }
}
```

---

## 📊 Stats Endpoint

```
GET /api/products/stats
```

**Response:**
```json
{
  "totalProducts": 7,
  "countByCategory": {
    "electronics": 4,
    "kitchen": 3
  }
}
```

---

## 🧪 Test Error Handling

| Route             | Purpose                     |
|------------------|-----------------------------|
| `/error`         | Throws a synchronous error  |
| `/async-error`   | Throws an async error       |

---

## 🧾 License

MIT © [Your Name]

---

## 🌐 Author

**Tech-Swift** 🚀