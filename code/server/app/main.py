from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from .query import query_processing
from .timeSeries import get_timeseries_data
from .dataDA import get_da
from .user_query.router import router as chatbot_router

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.get("/")
def hello_world():
    return {"message": "Hello, World!"}

app.include_router(chatbot_router, tags=["Chatbot"])
app.include_router(query_processing.router)
app.include_router(get_timeseries_data.router)
app.include_router(get_da.router)

