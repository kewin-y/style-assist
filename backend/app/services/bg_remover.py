from rembg import remove
import uuid
import aiofiles

async def remove_background(image_bytes: bytes) -> str:
    unique_id = str(uuid.uuid4())
    output_path = f"app/output/{unique_id}.png"

    # Remove background directly from bytes
    output_data = remove(image_bytes)

    # Save output
    async with aiofiles.open(output_path, 'wb') as f:
        await f.write(output_data)

    return output_path
