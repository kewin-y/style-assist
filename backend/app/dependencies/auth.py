from typing import Annotated

from fastapi import Depends
from dotenv import load_dotenv
import os

_ = load_dotenv()

async def get_current_user():
    return {"id": os.environ.get("DUMMY_USER_ID"), "email": os.environ.get("DUMMY_USER_EMAIL")}


CurrentUser = Annotated[dict[str, str], Depends(get_current_user)]
