# Expense Tracker API
A REST API for managing personal expenses with MongoDB.

- **Live Demo**: https://expense-tracker-api-dfhy.onrender.com
- **Endpoints**:
  - `GET /`: Welcome message
  - `GET /expenses`: List all expenses
  - `GET /expenses/category/:category`: Filter by category
  - `POST /expenses`: Create expense (body: `{ "description": "string", "amount": number, "category": "string" }`)
  - `PUT /expenses/:id`: Update expense
  - `DELETE /expenses/:id`: Delete expense
- **Test with**: `curl` or Postman