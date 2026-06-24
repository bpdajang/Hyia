from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    MONGO_URI: str = os.getenv("MONGO_URL")
    DB_NAME: str = "Hyia"
    JWT_SECRET: str = os.getenv("JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    PORT: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
