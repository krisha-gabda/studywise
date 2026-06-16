from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timezone, timedelta
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from config import get_settings
from db.database import AsyncSession, get_db
from sqlalchemy import select
from models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login')
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])


def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain[:72], hashed)


def create_jwt_token(user_id: str) -> str:

    payload = {
        'sub': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(minutes=get_settings().JWT_EXPIRY_MINUTES)
    }

    return jwt.encode(
        payload,
        get_settings().JWT_SECRET_KEY,
        algorithm=get_settings().JWT_ALGORITHM
    )


def decode_jwt_token(token: str) -> str:
    try:
        return jwt.decode(token, get_settings().JWT_SECRET_KEY, algorithms=[get_settings().JWT_ALGORITHM])
    except  JWTError:
        raise(HTTPException(status_code=401, detail='Invalid or expired token'))


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    # token is automatically extracted from the Authorization header
    payload = decode_jwt_token(token)
    user_id = payload.get('sub')

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if user is None:
        raise(HTTPException(status_code=401, detail='User not found'))
    
    return user