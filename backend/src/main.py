from fastapi import FastAPI, HTTPException
from openai import OpenAIError
from pydantic import BaseModel

from ModelRequester import RouterAIClient

app = FastAPI(title="Entrepreneur Assistant API")


class StatusResponse(BaseModel):
    status: str
    message: str


@app.get("/api/health", response_model=StatusResponse)
async def health_check():
    return StatusResponse(status="ok", message="Связь с FastAPI успешно установлена!")


@app.get("/api/ai")
def get_ai_response():
    try:
        client = RouterAIClient()
        return client.create()
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except OpenAIError as exc:
        raise HTTPException(status_code=502, detail="Не удалось получить ответ модели") from exc
