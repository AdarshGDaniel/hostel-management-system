# Hostel Management System

A full-stack **Hostel Management System** built to manage student accommodation, room allocation, leave management, queries, and staff administration in a streamlined and transparent way.

---

## 📌 Features

### 👨‍🎓 Student Module
- Login & authentication
- View assigned room details
- Apply for room allocation, room change, leave, and hostel mess
- Raise queries to hostel staff
- View query history with status & replies
- View leave history (approved / rejected / pending)
- Session auto-expiry with logout popup

### 👩‍💼 Staff / Admin Module
- Approve / reject room requests
- Approve / reject leave requests
- Reply to student queries (close / escalate / irrelevant)
- Live room status dashboard
- Guest room management
- Student search with real-time dropdown
- Complete student request history
- Staff action history

### 🏠 Room Management
- Room grid with capacity, occupancy, and availability
- Color-coded room status
- Prevent deletion of occupied rooms
- Guest assignment with date range

---

## 🛠 Tech Stack

**Frontend**
- React.js
- React Router DOM
- Axios
- React Toastify

**Backend**
- Node.js
- Express.js
- MySQL (phpMyAdmin)
- JWT Authentication

---

## 📂 Project Structure

```
hostel-management-system/
├── frontend/
├── backend/
├── README.md
└── .gitignore
```

---

## ⚙️ Setup Instructions

### Backend
```bash
<Run MySQL DB using XAMPP>
<create a DB and add the details to .env>

cd hostel_backend_node
<make sure to add a file named .env in /hostel_backend_node/.env with the following details:>
    <DB_HOST=hostname>
    <DB_USER=username>
    <DB_PASS=password>
    <DB_NAME=db_name>
    <JWT_SECRET=random number eg: 76348734687346874363443434343443333333333>
npm i init
npm run dev
```

### Frontend
```bash
cd hostel-coordination
npm i init
npm run dev
```

---

## 🔐 Security
- JWT authentication
- Role-based access
- Protected routes
- Session expiry handling

---

## 📈 Future Enhancements
- Email notifications
- Reports export
- Mobile UI
- Analytics dashboard

---

## 👨‍💻 Author
**Adarsh G Daniel**

