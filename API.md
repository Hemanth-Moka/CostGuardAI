# 🔌 CostGuard AI - API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

---

## 📊 Data Management

### Upload Data
**POST** `/data/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <CSV or JSON file>
```

**Response:**
```json
{
  "message": "Data uploaded successfully",
  "count": 15,
  "records": [...]
}
```

### Get All Data
**GET** `/data`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional): saas, vendor, cloud
- `status` (optional): active, inactive, cancelled

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "type": "saas",
    "name": "Slack",
    "vendor": "Slack Technologies",
    "cost": 50000,
    "frequency": "monthly",
    "licenses": 100,
    "activeUsers": 45,
    "department": "Engineering",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## 🔍 Insights

### Analyze Data
**POST** `/insights/analyze`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Analysis completed",
  "insightsCount": 5,
  "insights": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "type": "unused_licenses",
      "title": "Unused Licenses: Adobe Creative Cloud",
      "description": "18 unused licenses detected. Utilization: 40.0%",
      "severity": "high",
      "estimatedSavings": 36000,
      "confidence": 90,
      "affectedRecords": ["507f1f77bcf86cd799439011"],
      "status": "active",
      "createdAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

### Get Insights
**GET** `/insights`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): active, resolved, dismissed
- `type` (optional): duplicate_tools, unused_licenses, cost_anomaly, sla_risk

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "type": "unused_licenses",
    "title": "Unused Licenses: Adobe Creative Cloud",
    "description": "18 unused licenses detected. Utilization: 40.0%",
    "severity": "high",
    "estimatedSavings": 36000,
    "confidence": 90,
    "affectedRecords": [...],
    "status": "active"
  }
]
```

---

## 💡 Recommendations

### Get Recommendations
**GET** `/recommendations`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): pending, approved, rejected, executed

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "insightId": "507f1f77bcf86cd799439012",
    "title": "Reduce Adobe Creative Cloud licenses",
    "description": "Remove 18 unused licenses. Keep 12 active licenses.",
    "actionType": "reduce_licenses",
    "estimatedSavings": 36000,
    "monthlySavings": 36000,
    "yearlySavings": 432000,
    "riskLevel": "low",
    "affectedRecords": ["507f1f77bcf86cd799439011"],
    "status": "pending",
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
]
```

### Get Recommendation by ID
**GET** `/recommendations/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "insightId": {...},
  "title": "Reduce Adobe Creative Cloud licenses",
  "description": "Remove 18 unused licenses. Keep 12 active licenses.",
  "actionType": "reduce_licenses",
  "estimatedSavings": 36000,
  "monthlySavings": 36000,
  "yearlySavings": 432000,
  "riskLevel": "low",
  "affectedRecords": [...],
  "status": "pending"
}
```

---

## ✅ Actions

### Request Action
**POST** `/actions/request`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recommendationId": "507f1f77bcf86cd799439013"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "recommendationId": "507f1f77bcf86cd799439013",
  "actionType": "reduce_licenses",
  "description": "Remove 18 unused licenses. Keep 12 active licenses.",
  "estimatedSavings": 36000,
  "status": "pending",
  "requestedBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-15T10:40:00.000Z"
}
```

### Approve/Reject Action
**POST** `/actions/:actionId/approve`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "approved": true
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "status": "approved",
  "approvedBy": "507f1f77bcf86cd799439011",
  "approvedAt": "2024-01-15T10:45:00.000Z"
}
```

### Execute Action
**POST** `/actions/:actionId/execute`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Action executed successfully",
  "action": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "executed",
    "executedAt": "2024-01-15T10:50:00.000Z",
    "result": {
      "affectedRecords": ["507f1f77bcf86cd799439011"],
      "details": {
        "message": "Licenses reduced successfully",
        "recordsUpdated": 1
      }
    }
  },
  "log": {
    "_id": "507f1f77bcf86cd799439015",
    "actionId": "507f1f77bcf86cd799439014",
    "actionType": "reduce_licenses",
    "status": "success",
    "savingsRealized": 36000
  }
}
```

### Get Actions
**GET** `/actions`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): pending, approved, rejected, executing, executed, failed

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "recommendationId": {...},
    "actionType": "reduce_licenses",
    "description": "Remove 18 unused licenses. Keep 12 active licenses.",
    "estimatedSavings": 36000,
    "status": "executed",
    "requestedBy": {...},
    "approvedBy": {...},
    "executedAt": "2024-01-15T10:50:00.000Z"
  }
]
```

---

## 💰 Impact & Metrics

### Get Impact Metrics
**GET** `/impact/metrics`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): YYYY-MM format (default: current month)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "period": "2024-01",
  "totalSpend": 1023000,
  "savingsIdentified": 150000,
  "savingsRealized": 75000,
  "monthlySavings": 75000,
  "yearlySavings": 900000,
  "roi": 0,
  "actionsExecuted": 3,
  "breakdown": {
    "duplicateTools": 48000,
    "unusedLicenses": 20000,
    "costAnomalies": 7000,
    "optimizations": 0
  },
  "updatedAt": "2024-01-15T10:50:00.000Z"
}
```

### Get Execution Logs
**GET** `/impact/logs`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "actionId": "507f1f77bcf86cd799439014",
    "actionType": "reduce_licenses",
    "description": "Remove 18 unused licenses. Keep 12 active licenses.",
    "status": "success",
    "savingsRealized": 36000,
    "affectedRecords": [...],
    "executedBy": {...},
    "result": {
      "affectedRecords": ["507f1f77bcf86cd799439011"],
      "details": {
        "message": "Licenses reduced successfully",
        "recordsUpdated": 1
      }
    },
    "executedAt": "2024-01-15T10:50:00.000Z"
  }
]
```

### Get Log by ID
**GET** `/impact/logs/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "actionId": {...},
  "actionType": "reduce_licenses",
  "description": "Remove 18 unused licenses. Keep 12 active licenses.",
  "status": "success",
  "savingsRealized": 36000,
  "affectedRecords": [...],
  "executedBy": {...},
  "result": {...},
  "executedAt": "2024-01-15T10:50:00.000Z"
}
```

---

## 🏥 Health Check

### Health Check
**GET** `/health`

**No authentication required**

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:50:00.000Z"
}
```

---

## 🔒 Authentication

All endpoints except `/auth/register`, `/auth/login`, and `/health` require authentication.

**Include JWT token in headers:**
```
Authorization: Bearer <your_jwt_token>
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## 📝 Data Models

### User
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (enum: ['admin', 'user']),
  createdAt: Date
}
```

### DataRecord
```javascript
{
  type: String (enum: ['saas', 'vendor', 'cloud']),
  name: String (required),
  vendor: String,
  cost: Number (required),
  frequency: String (enum: ['monthly', 'yearly', 'one-time']),
  licenses: Number,
  activeUsers: Number,
  department: String,
  startDate: Date,
  endDate: Date,
  status: String (enum: ['active', 'inactive', 'cancelled']),
  metadata: Mixed,
  uploadedBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Insight
```javascript
{
  type: String (enum: ['duplicate_tools', 'unused_licenses', 'cost_anomaly', 'sla_risk', 'optimization']),
  title: String (required),
  description: String (required),
  severity: String (enum: ['low', 'medium', 'high', 'critical']),
  estimatedSavings: Number,
  confidence: Number (0-100),
  affectedRecords: [ObjectId] (ref: DataRecord),
  status: String (enum: ['active', 'resolved', 'dismissed']),
  metadata: Mixed,
  createdAt: Date
}
```

### Recommendation
```javascript
{
  insightId: ObjectId (ref: Insight, required),
  title: String (required),
  description: String (required),
  actionType: String (enum: ['cancel_subscription', 'reduce_licenses', 'downgrade_plan', 'consolidate_tools', 'renegotiate']),
  estimatedSavings: Number (required),
  monthlySavings: Number (required),
  yearlySavings: Number (required),
  riskLevel: String (enum: ['low', 'medium', 'high']),
  affectedRecords: [ObjectId] (ref: DataRecord),
  status: String (enum: ['pending', 'approved', 'rejected', 'executed']),
  createdAt: Date
}
```

### Action
```javascript
{
  recommendationId: ObjectId (ref: Recommendation, required),
  actionType: String (required),
  description: String (required),
  estimatedSavings: Number (required),
  status: String (enum: ['pending', 'approved', 'rejected', 'executing', 'executed', 'failed']),
  requestedBy: ObjectId (ref: User),
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  executedAt: Date,
  result: Mixed,
  createdAt: Date
}
```

### ExecutionLog
```javascript
{
  actionId: ObjectId (ref: Action, required),
  actionType: String (required),
  description: String (required),
  status: String (enum: ['success', 'failed', 'partial']),
  savingsRealized: Number,
  affectedRecords: [ObjectId] (ref: DataRecord),
  executedBy: ObjectId (ref: User),
  result: Mixed,
  errorMessage: String,
  executedAt: Date
}
```

### ImpactMetrics
```javascript
{
  period: String (required, format: YYYY-MM),
  totalSpend: Number,
  savingsIdentified: Number,
  savingsRealized: Number,
  monthlySavings: Number,
  yearlySavings: Number,
  roi: Number,
  actionsExecuted: Number,
  breakdown: {
    duplicateTools: Number,
    unusedLicenses: Number,
    costAnomalies: Number,
    optimizations: Number
  },
  updatedAt: Date
}
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Upload Data
```bash
curl -X POST http://localhost:5000/api/data/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@sample-data.csv"
```

### Analyze
```bash
curl -X POST http://localhost:5000/api/insights/analyze \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Insights
```bash
curl http://localhost:5000/api/insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**API Version:** 1.0.0  
**Last Updated:** 2024-01-15
