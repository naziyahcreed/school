from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=64)
    password: str = Field(..., min_length=4, max_length=128)


class UserPublic(BaseModel):
    username: str
    role: str
    full_name: str
    full_name_ta: str | None = None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserPublic
