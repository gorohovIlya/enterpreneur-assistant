from typing import Any, Literal

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


class RecommendationRequest(BaseModel):
    founders: Literal["one", "couple", "group", "many"]
    revenue: Literal["micro", "small", "large"]
    employees: bool
    investors: bool
    limitedLiability: bool
    priority: Literal["simplicity", "scaling"]


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


def ask_model(payload: dict[str, Any]) -> AiResponse:
    try:
        client = RouterAIClient()
        return AiResponse(content=client.ask(payload=payload), model=client.model_name)
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except OpenAIError as exc:
        raise HTTPException(status_code=502, detail="Не удалось получить ответ модели") from exc


@app.get("/api/ai", response_model=AiResponse)
def get_ai_response():
    return ask_model(TEST_INPUT)


@app.post("/api/ai", response_model=AiResponse)
def post_ai_response(payload: RecommendationRequest):
    return ask_model(payload.model_dump())
