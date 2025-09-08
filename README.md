# 🌍 Carbon Emissions Reporting Platform

![System Architecture]([C:\Users\dongr\Downloads\power-forecasting\_- visual selection.png](https://github.com/rashmi0710/Carbon-Emissions-Reporting-Platform/blob/main/_-%20visual%20selection.png))  


A **FastAPI + React + MySQL** based platform to calculate and monitor **Scope 1 & Scope 2 GHG emissions (tCO₂)**.  
The system supports **emission factor mapping, data validation, analytics, and visualization dashboards**.

---

## 🚀 Tech Stack
- **Frontend**: React.js + Recharts/Chart.js  
- **Backend**: FastAPI (Python)  
- **Database**: MySQL (SQLAlchemy ORM)  
- **Preprocessing**: Pandas (Jupyter Notebooks)  
- **Deployment**: Docker + Docker Compose  
- **Version Control**: Git + GitHub  

---

## 🏗️ System Architecture
```mermaid
flowchart TD
    A[User: Web UI] -->|Data Entry| B[Frontend: React]
    B -->|REST API| C[Backend: FastAPI]
    C -->|SQLAlchemy| D[(MySQL Database)]
    C -->|Calculations| E[Analytics Engine]
    E -->|Charts & Reports| B

