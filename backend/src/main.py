from typing import Any

from fastapi import FastAPI, HTTPException
from openai import OpenAIError
from pydantic import BaseModel

from ModelRequester import RouterAIClient

app = FastAPI(title="Entrepreneur Assistant API")


class StatusResponse(BaseModel):
    status: str
    message: str


class AiResponse(BaseModel):
    content: str
    model: str


# Тестовые ответы в формате формы на /recommend.
TEST_INPUT: dict[str, Any] = {
    "founders": "one",
    "revenue": "micro",
    "employees": False,
    "investors": False,
    "limitedLiability": False,
    "priority": "simplicity",
}


@app.get("/api/health", response_model=StatusResponse)
async def health_check():
    return StatusResponse(status="ok", message="Связь с FastAPI успешно установлена!")


@app.get("/api/ai", response_model=AiResponse)
def get_ai_response():
    try:
        client = RouterAIClient()
        return AiResponse(content=client.ask(payload=TEST_INPUT), model=client.model_name)
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except OpenAIError as exc:
        raise HTTPException(status_code=502, detail="Не удалось получить ответ модели") from exc
