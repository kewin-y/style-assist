from pydantic_ai.models.openrouter import OpenRouterModel
from pydantic_ai.providers.openrouter import OpenRouterProvider
import os
from dotenv import load_dotenv

load_dotenv()

gemini_2_5_flash = OpenRouterModel(
    "google/gemini-2.5-flash",
    provider=OpenRouterProvider(api_key=os.environ.get("OPEN_ROUTER_API_KEY")),
)
