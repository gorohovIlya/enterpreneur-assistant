import io
from typing import Literal

from markdown_pdf import MarkdownPdf, Section
from pydantic import BaseModel, Field

FOUNDERS_LABELS: dict[str, str] = {
    "one": "Один",
    "couple": "2–4",
    "group": "5–50",
    "many": "51 и больше",
}

REVENUE_LABELS: dict[str, str] = {
    "micro": "До 2,4 млн ₽",
    "small": "От 2,4 до 60 млн ₽",
    "large": "Свыше 60 млн ₽",
}

PRIORITY_LABELS: dict[str, str] = {
    "simplicity": "Простая регистрация и отчётность",
    "scaling": "Масштабирование и привлечение капитала",
}

DISCLAIMER = (
    "Рекомендация носит информационный характер и не заменяет юридическую консультацию."
)


class RecommendationRequest(BaseModel):
    founders: Literal["one", "couple", "group", "many"]
    revenue: Literal["micro", "small", "large"]
    employees: bool
    investors: bool
    limitedLiability: bool
    priority: Literal["simplicity", "scaling"]


class OpfReport(BaseModel):
    id: str
    name: str
    fullName: str
    description: str
    advantages: list[str] = Field(default_factory=list)
    limitations: list[str] = Field(default_factory=list)
    tax: str = ""
    liability: str = ""
    founders: str = ""
    suitedFor: str = ""


class RecommendationReport(BaseModel):
    opf: OpfReport
    reasons: list[str] = Field(default_factory=list)
    alternatives: list[OpfReport] = Field(default_factory=list)


class AiReview(BaseModel):
    content: str
    model: str = ""


class ReportRequest(BaseModel):
    input: RecommendationRequest
    recommendation: RecommendationReport
    ai: AiReview


def _bullet_list(items: list[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def _recap(payload: RecommendationRequest) -> list[tuple[str, str]]:
    return [
        ("Учредители", FOUNDERS_LABELS[payload.founders]),
        ("Выручка", REVENUE_LABELS[payload.revenue]),
        ("Сотрудники", "Да" if payload.employees else "Нет"),
        ("Внешние инвесторы", "Да" if payload.investors else "Нет"),
        (
            "Ограниченная ответственность",
            "Нужна" if payload.limitedLiability else "Не нужна",
        ),
        ("Приоритет", PRIORITY_LABELS[payload.priority]),
    ]


def build_markdown(request: ReportRequest) -> str:
    input_data = request.input
    opf = request.recommendation.opf

    parts: list[str] = ["# Отчёт по подбору организационно-правовой формы", ""]

    parts.append("## Ваши ответы")
    parts.append("")
    for label, value in _recap(input_data):
        parts.append(f"- **{label}:** {value}")
    parts.append("")

    parts.append("## Рекомендация (правила сервиса)")
    parts.append("")
    parts.append(f"### {opf.name}")
    parts.append("")
    parts.append(opf.fullName)
    parts.append("")
    parts.append(opf.description)
    parts.append("")

    if opf.advantages:
        parts.append("**Преимущества**")
        parts.append("")
        parts.append(_bullet_list(opf.advantages))
        parts.append("")

    if opf.limitations:
        parts.append("**Ограничения**")
        parts.append("")
        parts.append(_bullet_list(opf.limitations))
        parts.append("")

    if request.recommendation.reasons:
        parts.append("**Почему это подходит**")
        parts.append("")
        parts.append(_bullet_list(request.recommendation.reasons))
        parts.append("")

    facts = [
        ("Налоги", opf.tax),
        ("Ответственность", opf.liability),
        ("Учредители", opf.founders),
    ]
    parts.append("**Ключевые параметры**")
    parts.append("")
    for label, value in facts:
        parts.append(f"- **{label}:** {value}")
    parts.append("")

    if request.recommendation.alternatives:
        parts.append("### Другие варианты")
        parts.append("")
        for alternative in request.recommendation.alternatives:
            parts.append(f"- **{alternative.name}** — {alternative.suitedFor}")
        parts.append("")

    parts.append("## Обзор от ИИ")
    parts.append("")
    if request.ai.model:
        parts.append(f"*Модель: {request.ai.model}*")
        parts.append("")
    parts.append(request.ai.content)
    parts.append("")
    parts.append("---")
    parts.append("")
    parts.append(f"*{DISCLAIMER}*")

    return "\n".join(parts)


def build_report_pdf(request: ReportRequest) -> bytes:
    markdown_text = build_markdown(request)

    pdf = MarkdownPdf(toc_level=2, optimize=True)
    pdf.meta["title"] = "Отчёт по подбору организационно-правовой формы"
    pdf.meta["author"] = "Entrepreneur Assistant"
    pdf.add_section(Section(markdown_text))

    buffer = io.BytesIO()
    pdf.save_bytes(buffer)
    return buffer.getvalue()
