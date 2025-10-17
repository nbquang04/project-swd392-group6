# FlowerShop Spring Boot Backend

Reads and writes the existing `../database.json` and exposes REST APIs compatible with the current frontend expectations.

## Run

```bash
cd backend-spring
mvn spring-boot:run
```

App runs at `http://localhost:8080`.

## Endpoints

- GET `/api/products` `?category_id=&q=&_limit=`
- GET `/api/products/{id}`
- GET `/api/category`
- GET `/api/reviews`
- GET `/api/reviews/{productId}`
- POST `/api/reviews`
- PUT `/api/reviews/{reviewId}`
- DELETE `/api/reviews/{reviewId}`
- GET `/api/users`
- GET `/api/cart`
- GET `/api/orders`
- GET `/api/products/{productId}/stats` (via reviews controller under the same base)

CORS is enabled for local dev origins.
