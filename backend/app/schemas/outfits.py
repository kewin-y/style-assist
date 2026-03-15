from pydantic import BaseModel, Field, model_validator

class GenerateOutfitRequest(BaseModel):
    prompt: str | None = None
    image_url: str | None = None

    @model_validator(mode='after')
    def check_inputs(self):
        if not self.prompt and not self.image_url:
            raise ValueError("You must provide either a prompt, an image_url, or both.")
        return self

class OutfitRecommendation(BaseModel):
    title: str = Field(description="A catchy name for the outfit vibe.")
    reasoning: str = Field(description="Why these items work well together.")

    inner_tops: list[str] = Field(min_length=1, max_length=3)
    bottoms: list[str] = Field(min_length=1, max_length=3)
    shoes: list[str] = Field(min_length=1, max_length=3)

    outer_tops: list[str] = Field(default_factory=list, max_length=3)

class OutfitError(BaseModel):
    # This is the graceful refusal!
    refusal_reason: str = Field(description="Explain exactly what is missing. e.g., 'You don't have any formal shoes for this outfit.'")


OutfitResult = [OutfitRecommendation, OutfitError]
