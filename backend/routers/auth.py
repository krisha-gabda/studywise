from fastapi import APIRouter, Depends, HTTPException
from schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from db.database import AsyncSession, get_db
from sqlalchemy import select
from models.user import User
from utils.auth import hash_password, create_jwt_token, verify_password

router = APIRouter()

@router.post('/register')
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()

    if user is not None:
        raise HTTPException(status_code=400, detail='Email already registered')

    hashed_password = hash_password(password=user_data.password)
    new_user = User(email=user_data.email, password_hash=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    jwt_token = create_jwt_token(str(new_user.id))
    return TokenResponse(
        access_token=jwt_token,
        user=UserResponse.model_validate(new_user)
    )


@router.post('/login')
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid Credentials')
    
    jwt_token = create_jwt_token(str(user.id))
    return TokenResponse(
        access_token=jwt_token,
        user=UserResponse.model_validate(user)
    )