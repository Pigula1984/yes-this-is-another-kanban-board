from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import boards, cards, columns

app = FastAPI(title="Kanban Board API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(boards.router, prefix="/api")
app.include_router(columns.router, prefix="/api")
app.include_router(cards.router, prefix="/api")
