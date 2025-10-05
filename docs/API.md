# 🔌 API Documentation

## Authentication Endpoints
## Register a new user account.
bash 
```
POST /api/auth/register
```

### Request Body
bash
```
{
  "username": "string (3-30 chars)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

### Response
bash 
```
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt-token",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}

```


## Login To Existing Account
bash
```
POST /api/auth/login
{
  "email": "string",
  "password": "string"
}
```

## Task Endpoints

## Get tasks with pagination and filtering.
bash
```
GET /api/tasks
```
### Query Parameters:

    page - Page number (default: 1)

    limit - Items per page (default: 8)

    status - Filter by status

    priority - Filter by priority

    isUrgent - Filter by urgency

    search - Search in title/description

### Response:
bash
```

{
  "success": true,
  "tasks": [Task],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 35,
    "hasNext": true,
    "hasPrev": false
  }
}
```


## Create a new task.
bash
```
POST /api/tasks
```

### Request Body:
bash
```

{
  "title": "string (required)",
  "description": "string (required)",
  "status": "string (optional)",
  "priority": "string (optional)",
  "isUrgent": "boolean (optional)",
  "estimatedHours": "number (optional)",
  "actualHours": "number (optional)",
  "dueDate": "date (optional)"
}
```
### Update an existing task.
bash
```
PUT /api/tasks/:id
```

### Delete a task.
bash 
```
DELETE /api/tasks/:id
```


### Get task statistics.
bash
```
GET /api/tasks/stats/summary
```
