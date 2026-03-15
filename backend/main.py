from fastapi import FastAPI
from app.routers import clothes 

app = FastAPI()
app.include_router(clothes.router)

from fastapi.middleware.cors import CORSMiddleware


origins = [
    "https://localhost:3000",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
