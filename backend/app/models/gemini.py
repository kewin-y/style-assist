from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider
import os
from dotenv import load_dotenv

load_dotenv()

gemini_2_5_flash = GoogleModel(
    "gemini-2.5-flash",
    provider=GoogleProvider(api_key=os.environ.get("GEMINI_API_KEY")),
)

