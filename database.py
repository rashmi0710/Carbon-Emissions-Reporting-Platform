from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "mysql+pymysql://root:rashmiAkku060710%40@localhost:3306/carbon_reporting"

engine = create_engine(DATABASE_URL, echo=True)  # echo=True => SQL logs dikhega
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
