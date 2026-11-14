FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-dev --no-install-project

COPY src ./src

ENV PYTHONPATH=/app/src

CMD ["uv", "run", "--no-project", "fastapi", "run", "src/main.py", "--host", "0.0.0.0", "--port", "8000"]
