from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Entrepreneur Assistant API")


class StatusResponse(BaseModel):
    status: str
    message: str


@app.get("/api/health", response_model=StatusResponse)
async def health_check():
    return StatusResponse(status="ok", message="Связь с FastAPI успешно установлена!")
