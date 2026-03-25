# 🔐 AUTHENTICATION SETUP

## ⚠️ IMPORTANT: Start MongoDB First!

Before running the application, you MUST start MongoDB:

### Windows:
```bash
mongod
```

### Or use MongoDB Atlas:
Edit `backend/.env` and add your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/costguard-ai
```

---

## 🚀 OPTION 1: Use Dummy Credentials (Recommended)

### Step 1: Start MongoDB
```bash
mongod
```

### Step 2: Seed Database
```bash
cd backend
npm run seed
```

### Step 3: Login
- Email: **admin@costguard.ai**
- Password: **admin123**

---

## 🚀 OPTION 2: Register New Account

If seeding doesn't work or you prefer to create your own account:

### Step 1: Start Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 2: Register
1. Go to http://localhost:5173
2. Click "Register" tab
3. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: yourpassword
4. Click "Register"
5. You'll be logged in automatically

### Step 3: Login Next Time
Use the email and password you registered with.

---

## 🐛 TROUBLESHOOTING

### "Authentication failed" error?

**Cause:** MongoDB is not running or user doesn't exist

**Fix:**
1. Make sure MongoDB is running: `mongod`
2. Seed the database: `cd backend && npm run seed`
3. Or register a new account

### "MongooseServerSelectionError"?

**Cause:** MongoDB is not running

**Fix:**
```bash
# Start MongoDB
mongod

# In a new terminal, seed database
cd backend
npm run seed
```

### Can't connect to MongoDB?

**Option A - Local MongoDB:**
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Run `mongod`

**Option B - MongoDB Atlas (Cloud):**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/costguard-ai
   ```

---

## ✅ VERIFICATION

After seeding, you should see:
```
✅ Admin user created successfully!
Email: admin@costguard.ai
Password: admin123

✅ Demo user created successfully!
Email: user@costguard.ai
Password: user123
```

Now you can login with these credentials!

---

## 📝 QUICK CHECKLIST

- [ ] MongoDB is running (`mongod`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Database seeded (`cd backend && npm run seed`)
- [ ] Backend running (`cd backend && npm start`)
- [ ] Frontend running (`cd frontend && npm run dev`)
- [ ] Browser open at http://localhost:5173
- [ ] Login with admin@costguard.ai / admin123

---

## 🎯 COMPLETE STARTUP SEQUENCE

```bash
# 1. Start MongoDB (Terminal 1)
mongod

# 2. Seed Database (Terminal 2)
cd backend
npm run seed

# 3. Start Backend (same terminal)
npm start

# 4. Start Frontend (Terminal 3)
cd frontend
npm run dev

# 5. Open Browser
# Go to: http://localhost:5173
# Login: admin@costguard.ai / admin123
```

---

**That's it! You're ready to go! 🚀**
