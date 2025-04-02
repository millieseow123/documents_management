# 📄 Documents Management System

This is a full-stack document management system built with Next.js (App Router), TypeScript, MySQL, and MUI. Users can view, search, sort, upload files, and create folders in a table UI.

## 🛠 Tech Stack

- **Frontend**: Next.js App Router, TypeScript, MUI
- **Backend**: Next.js API routes
- **Database**: MySQL
---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/vistra-docs-management.git
cd vistra-docs-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up DB and seed data
```bash
mysql -u root -p < schema.sql
npx tsx scripts/seed.ts
```

### 4. Create a `.env` file in the root folder with your local MySQL credentials
```bash
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=management_db
```

### 5. Run App
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
