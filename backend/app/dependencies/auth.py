from fastapi import Depends
from typing import Annotated

async def get_dummy_user():
    return {"id": "hardcoded-user-id", "email": "test@example.com"}

async def get_current_user():
    pass

CurrentDummyUser = Annotated[dict[str, str], Depends(get_dummy_user)]
