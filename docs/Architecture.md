# System Architecture

## 🏗️ Overall Architecture
![Alt text](/images/TaskManagerArch.png)


## 🔄 Data Flow

### Authentication Flow
1. User submits login/register form
2. Frontend sends request to `/api/auth/*` endpoints
3. Backend validates credentials and creates JWT token
4. Token stored in localStorage for subsequent requests
5. All protected routes include token in Authorization header

### Task Management Flow
1. User creates/updates task via form
2. Frontend sends POST/PUT request to `/api/tasks`
3. Backend validates data and saves to MongoDB
4. Efficiency score calculated automatically before save
5. Frontend updates UI with response data

### Data Retrieval Flow
1. Frontend requests tasks with pagination/filters
2. Backend queries MongoDB with conditions
3. Mongoose performs data validation
4. Response includes tasks and pagination metadata
5. Frontend renders tasks with filters applied

## 🗃️ Database Design
![Alt text](/images/DatabaseSchema.png)


## 🔐 Security Architecture
![Alt text](/images/SecurityArch.png)

## ⚡ Performance Architecture

### Frontend Optimization
- React component optimization
- Efficient re-rendering with proper state management
- CSS optimization and minimal bundle size
- Lazy loading potential

### Backend Optimization
- Database indexing for common queries
- Pagination to limit response size
- Efficient Mongoose queries
- Proper error handling and logging

### Deployment Optimization
- Vercel edge network for fast delivery
- MongoDB Atlas global clusters
- Environment-based configuration

## 🔄 API Architecture

### RESTful Design
- Resource-based endpoints
- Proper HTTP methods (GET, POST, PUT, DELETE)
- Consistent response format
- Proper status codes

### Error Handling
- Structured error responses
- Validation error details
- Graceful degradation
- Comprehensive logging
