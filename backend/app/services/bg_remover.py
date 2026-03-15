from pathlib import Path
import uuid
import aiofiles
from rembg import remove
from typing import cast

OUTPUT_DIR = Path(__file__).parent.parent / "output"

async def remove_background(image_bytes: bytes) -> str:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    unique_id = str(uuid.uuid4())
    output_path = OUTPUT_DIR / f"{unique_id}.png"

    output_data = remove(image_bytes)
    output_bytes = cast(bytes, output_data)

    async with aiofiles.open(output_path, "wb") as f:
        _ = await f.write(output_bytes)

    return str(output_path)
