# 🚀 COSTGUARD AI - COMPLETE SETUP GUIDE

## ⚡ FASTEST WAY TO START (3 Steps)

### Step 1: Start MongoDB
```bash
mongod
```
**Leave this terminal running!**

### Step 2: Start Application
Double-click: **`start-simple.bat`**

### Step 3: Register Account
1. Open: http://localhost:5173
2. Click "Register" tab
3. Enter your details
4. Click "Register"
5. You're in! 🎉

---

## 🔐 AUTHENTICATION OPTIONS

### Option A: Register New Account (Easiest)
1. Go to http://localhost:5173
2. Click "Register"
3. Fill the form
4. Done!

### Option B: Use Pre-seeded Credentials
```bash
# In a new terminal:
cd backend
npm run seed

# Then login with:
Email: admin@costguard.ai
Password: admin123
```

---

## 📋 COMPLETE MANUAL SETUP

### 1. Install MongoDB (if not installed)
- Download: https://www.mongodb.com/try/download/community
- Install and run: `mongod`

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 3. Start MongoDB
```bash
# Terminal 1
mongod
```

### 4. Start Backend
```bash
# Terminal 2
cd backend
npm start
```

### 5. Start Frontend
```bash
# Terminal 3
cd frontend
npm run dev
```

### 6. Access Application
- Open: http://localhost:5173
- Register a new account
- Start using!

---

## 🐛 FIXING "AUTHENTICATION FAILED"

### Problem: Can't login with admin@costguard.ai

**Solution 1: Register New Account**
1. Click "Register" tab
2. Create your own account
3. Login with your credentials

**Solution 2: Seed Database**
```bash
# Make sure MongoDB is running first!
cd backend
npm run seed

# Then login with:
# Email: admin@costguard.ai
# Password: admin123
```

**Solution 3: Check MongoDB**
```bash
# Is MongoDB running?
mongod

# Check if it's accessible
mongo
# or
mongosh
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: "MongooseServerSelectionError"
**Problem:** MongoDB is not running

**Fix:**
```bash
# Start MongoDB
mongod
```

### Issue 2: "Port 5000 already in use"
**Problem:** Another app is using port 5000

**Fix:**
```bash
# Edit backend/.env
PORT=5001

# Update frontend/src/services/api.js
# Change: http://localhost:5000 to http://localhost:5001
```

### Issue 3: "Cannot find module"
**Problem:** Dependencies not installed

**Fix:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Issue 4: Frontend won't start
**Problem:** Vite configuration issue

**Fix:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue 5: Can't register/login
**Problem:** Backend not running or MongoDB not connected

**Fix:**
1. Check MongoDB is running: `mongod`
2. Check backend is running: `cd backend && npm start`
3. Check browser console (F12) for errors
4. Check backend terminal for errors

---

## ✅ VERIFICATION CHECKLIST

Before trying to login, verify:

- [ ] MongoDB is running (terminal shows "waiting for connections")
- [ ] Backend is running (shows "CostGuard AI Backend running on port 5000")
- [ ] Frontend is running (shows "Local: http://localhost:5173")
- [ ] Browser can access http://localhost:5173
- [ ] No errors in browser console (F12)
- [ ] No errors in backend terminal

---

## 🎯 RECOMMENDED STARTUP SEQUENCE

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend
npm install          # First time only
npm start

# Terminal 3: Frontend
cd frontend
npm install          # First time only
npm run dev

# Browser
# Open: http://localhost:5173
# Register new account
```

---

## 🌐 USING MONGODB ATLAS (Cloud)

If you don't want to install MongoDB locally:

### 1. Create Free Account
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up for free

### 2. Create Cluster
- Click "Build a Database"
- Choose "Free" tier
- Select region
- Create cluster

### 3. Get Connection String
- Click "Connect"
- Choose "Connect your application"
- Copy connection string

### 4. Update Backend
Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/costguard-ai?retryWrites=true&w=majority
```

Replace `username` and `password` with your Atlas credentials.

### 5. Start Application
```bash
cd backend
npm start

cd frontend
npm run dev
```

---

## 📊 TESTING THE APPLICATION

### Quick Test Flow:
1. **Register/Login**
2. **Upload Data**: Go to "Data Upload" → Upload `sample-data.csv`
3. **Analyze**: Click "Run Analysis"
4. **View Results**: Navigate through all pages
5. **Test Workflow**: Request → Approve → Execute actions

### Expected Results:
- 15 records uploaded
- 3-5 insights detected
- ₹50k-100k savings identified
- Multiple recommendations generated

---

## 🔍 DEBUGGING TIPS

### Check Backend Health
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Check MongoDB Connection
```bash
# Connect to MongoDB
mongo
# or
mongosh

# Switch to database
use costguard-ai

# Check collections
show collections

# Check users
db.users.find()
```

### Check Browser Console
1. Open browser (http://localhost:5173)
2. Press F12
3. Go to "Console" tab
4. Look for errors

### Check Backend Logs
Look at the terminal where backend is running for error messages.

---

## 💡 PRO TIPS

1. **Always start MongoDB first** before backend
2. **Use separate terminals** for MongoDB, backend, and frontend
3. **Keep terminals open** while using the app
4. **Register your own account** if seeding fails
5. **Check all terminals** for error messages
6. **Use MongoDB Atlas** if local MongoDB is problematic

---

## 🎓 FIRST TIME USER GUIDE

### Never used MongoDB before?

**Option 1: Use MongoDB Atlas (Easiest)**
- No installation needed
- Free tier available
- Follow "Using MongoDB Atlas" section above

**Option 2: Install MongoDB Locally**
- Download from mongodb.com
- Install with default settings
- Run `mongod` in terminal
- That's it!

### Never used Node.js apps before?

**Basic Commands:**
```bash
npm install    # Install dependencies (first time only)
npm start      # Start the application
npm run dev    # Start in development mode
```

**Stopping the app:**
- Press `Ctrl+C` in the terminal

---

## 📞 STILL HAVING ISSUES?

### Check These:
1. Node.js version: `node --version` (should be 16+)
2. npm version: `npm --version`
3. MongoDB running: Check terminal for "waiting for connections"
4. Ports available: 5000 (backend), 5173 (frontend), 27017 (MongoDB)
5. Firewall: Allow Node.js and MongoDB

### Quick Reset:
```bash
# Stop all terminals (Ctrl+C)
# Close all terminal windows
# Start fresh:

# Terminal 1
mongod

# Terminal 2
cd backend
npm start

# Terminal 3
cd frontend
npm run dev

# Browser
# Register new account
```

---

## ✨ SUCCESS!

Once you see:
- ✅ MongoDB: "waiting for connections on port 27017"
- ✅ Backend: "CostGuard AI Backend running on port 5000"
- ✅ Frontend: "Local: http://localhost:5173"

**You're ready to go!** 🚀

Open http://localhost:5173 and register your account!

---

**Need help? Check the error messages in your terminals - they usually tell you exactly what's wrong!**
