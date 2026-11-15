import json
import os
from functools import lru_cache
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

PROMPT_FILENAME = "prompt.md"

ANSWERS_GLOSSARY = """Расшифровка значений:
- founders: one — один учредитель, couple — 2–4, group — 5–50, many — 51 и больше
- revenue: micro — до 2,4 млн ₽ в год, small — от 2,4 до 60 млн ₽, large — свыше 60 млн ₽
- employees: true — планирует нанимать сотрудников, false — не планирует
- investors: true — нужны инвесторы или партнёры, false — не нужны
- limitedLiability: true — важна ограниченная ответственность, false — готов отвечать личным имуществом
- priority: simplicity — простая регистрация и отчётность, scaling — масштабирование и привлечение капитала"""


@lru_cache(maxsize=1)
def load_prompt() -> str:
    prompt_path = os.getenv("PROMPT_PATH")
    candidates = [
        Path(prompt_path) if prompt_path else None,
        Path(__file__).with_name(PROMPT_FILENAME),
        Path(__file__).resolve().parents[2] / PROMPT_FILENAME,
    ]

    for path in candidates:
        if path is not None and path.is_file():
            return path.read_text(encoding="utf-8")

    raise ValueError(
        f"Не найден файл промпта {PROMPT_FILENAME}. "
        "Задайте путь через переменную окружения PROMPT_PATH."
    )


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

    @property
    def model_name(self) -> str:
        return self.__model_name

    def create(self, content: str = "Hello, how are you?", role: str = "user") -> dict[str, Any]:
        response = self.__client.chat.completions.create(
            model=self.__model_name,
            messages=[{"role": role, "content": content}],
        )
        return response.model_dump(mode="json")

    def ask(self, payload: dict[str, Any], prompt: str | None = None) -> str:
        answers = json.dumps(payload, ensure_ascii=False, indent=2)
        user_content = f"Ответы пользователя в JSON-формате:\n{answers}\n\n{ANSWERS_GLOSSARY}"

        response = self.__client.chat.completions.create(
            model=self.__model_name,
            messages=[
                {"role": "system", "content": prompt or load_prompt()},
                {"role": "user", "content": user_content},
            ],
        )

        content = response.choices[0].message.content if response.choices else None
        if not content:
            raise ValueError("Модель вернула пустой ответ")

        return content
