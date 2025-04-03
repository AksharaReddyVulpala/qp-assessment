
# Grocery Booking API 


This Repo provides backend functionality for a grocery store management system with user authentication, admin product management, and shopping cart operations.




## Features

- User Authentication: Signup and login functionality
- Admin Controls: Full CRUD operations for grocery items
- Shopping Cart: Add/remove items, view cart, and checkout
- Inventory Management: Update product inventory levels


## API Reference

### Authentication Routes
| Endpoint           | Method | Description       |
|--------------------|--------|-------------------|
| `/api/auth/signup` | POST   | User registration |
| `/api/auth/login`  | POST   | User login        |

#### Sample Request Body for Signup:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "isAdmin": false
}
```

#### Sample Request Body for login:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Admin Routes
| Endpoint                     | Method | Description            | Auth Required | Permissions |
|------------------------------|--------|------------------------|---------------|-------------|
| `/api/admin/items`           | GET    | Get all grocery items  | Yes           | Admin       |
| `/api/admin/items`           | POST   | Add new grocery item   | Yes           | Admin       |
| `/api/admin/items/:id`       | DELETE | Remove grocery item    | Yes           | Admin       |
| `/api/admin/items/:id`       | PUT    | Update grocery item    | Yes           | Admin       |
| `/api/admin/items/:id/inventory` | PUT | Update inventory | Yes           | Admin       |


#### Sample Request Body to add/Update New Item:
```json
{
   
    "name": "Mangoes",
    "price": 2.99,
    "quantity": 100,
    "category": "fruits",
    "description": "Fresh organic Mangoes from local farm",
    "isActive":true
  
}
```

#### Sample Request Body to Update inventory  Item:
```json
{
    "action":"add",
    "quantity":100
}
```

### Cart Routes
| Endpoint                     | Method | Description                | Auth Required | Permissions |
|------------------------------|--------|----------------------------|---------------|-------------|
| `/api/cart/allitems`         | GET    | Get available grocery items | Yes           | User        |
| `/api/cart`                  | GET    | Get user's cart             | Yes           | User        |
| `/api/cart/cartitems`        | POST   | Add item to cart            | Yes           | User        |
| `/api/cart/cartitems/:itemId`| DELETE | Remove item from cart       | Yes           | User        |
| `/api/cart/checkout`         | POST   | Place order                 | Yes           | User        |


#### Sample Request Body to Add Item to Cart:
```json
{
    "itemId":9, 
    "quantity":4
}
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/AksharaReddyVulpala/qp-assignment.git
```

Go to the project directory

```bash
  cd qp-assignment
```

Install dependencies

```bash
  npm install
```

Change DB Credentials in .env

```bash
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="add_your_pwd"
DB_NAME="grocery_buying"
```


Start the server

```bash
  npm run dev

```

