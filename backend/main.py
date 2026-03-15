from fastapi import FastAPI
from app.routers import clothes

app = FastAPI() 
app.include_router(clothes.router)

@app.get('/')
async def root():  
    return "HAHHAhAHAH"

