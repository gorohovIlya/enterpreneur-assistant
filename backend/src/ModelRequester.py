import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


class RouterAIClient:
    def __init__(
        self,
        model_name: str | None = None,
        api_key: str | None = None,
        base_url: str | None = None,
    ):
        self.__model_name: str = model_name or os.getenv("MODEL_NAME", "")
        self.__api_key: str = api_key or os.getenv("API_KEY", "")
        self.__base_url: str = base_url or os.getenv("BASE_URL", "")

        missing = [
            name
            for name, value in (
                ("MODEL_NAME", self.__model_name),
                ("API_KEY", self.__api_key),
                ("BASE_URL", self.__base_url),
            )
            if not value
        ]
        if missing:
            raise ValueError(f"Не заданы переменные окружения: {', '.join(missing)}")

        self.__client: OpenAI = OpenAI(api_key=self.__api_key, base_url=self.__base_url)

    def create(self, content: str = "Hello, how are you?", role: str = "user") -> dict[str, Any]:
        response = self.__client.chat.completions.create(
            model=self.__model_name,
            messages=[{"role": role, "content": content}],
        )
        return response.model_dump(mode="json")
