# 🌍 Carbon Emissions Reporting Platform


A **FastAPI + React + MySQL** based platform to calculate and monitor **Scope 1 & Scope 2 GHG emissions (tCO₂)**.  
The system supports **emission factor mapping, data validation, analytics, and visualization dashboards**.

---

## 🚀 Tech Stack
- **Frontend**: React.js (Vite) + Recharts/Chart.js  
- **Backend**: FastAPI (Python)  
- **Database**: MySQL (SQLAlchemy ORM)  
- **Preprocessing**: Pandas (Jupyter Notebooks)  
- **Deployment**: Docker + Docker Compose  
- **Version Control**: Git + GitHub  

---

## 🏗️ System Architecture

![System Architecture](https://github.com/rashmi0710/Carbon-Emissions-Reporting-Platform/blob/main/_-%20visual%20selection.png)  

## 📂 Project Structure
│── data/ # CSV & ER diagram
│── frontend/green-house-gas-emission/
│ ├── public/ # Static files
│ ├── src/ # React source
│ │ ├── components/ # UI Components
│ │ ├── App.jsx # Root React component
│ │ └── main.jsx # React entry point
│ ├── package.json
│ ├── vite.config.js
│ └── tailwind.config.js
│
│── venv/ # Python Virtual Environment
│── data.ipynb # Data preprocessing notebook
│── database.py # SQLAlchemy connection
│── main.py # FastAPI entrypoint
│── models.py # ORM Models
│── requirements.txt # Python dependencies
│── README.md



---

## ⚙️ Backend Setup (FastAPI + MySQL)

1. **Clone the repo**
   ```bash
   git clone https://github.com/rashmi0710/Carbon-Emissions-Reporting-Platform.git
   cd Carbon-Emissions-Reporting-Platform
2. **Setup virtual environment**
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

3. **Install dependencies**
pip install -r requirements.txt

4. **Update Database URL**
DATABASE_URL = "mysql+pymysql://<username>:<password>@<host>:<port>/<db_name>"

5. **Start FastAPI server**
uvicorn main:app --reload


API available at 👉 http://127.0.0.1:8000
Swagger Docs 👉 http://127.0.0.1:8000/docs

**Frontend Setup (React + Vite + TailwindCSS)**
1. **Go to frontend folder**
cd frontend/green-house-gas-emission

2. **Install dependencies**
Install dependencies

3. **Start development server**
npm run dev
App available at 👉 http://localhost:5173

4. **Connecting Frontend & Backend**
Open frontend/green-house-gas-emission/src/api.js

Update API base URL:
    const API_BASE_URL = "http://127.0.0.1:8000"; // or your deployed backend
    export default API_BASE_URL;

5. **📊 Features**

✅ **Add & track emission records**

✅ **Map emission factors**

✅ **Interactive dashboards & charts**

✅ **SQLAlchemy ORM with MySQL**

✅ **REST API with FastAPI**

✅ **React + Tailwind + Vite frontend**


