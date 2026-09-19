from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.schemas.auth import LoginRequest, LoginResponse, UserPublic
from app.services.auth_service import authenticate, create_access_token

router = APIRouter()


@router.post('/login', response_model=LoginResponse)
def login(body: LoginRequest):
    user = authenticate(body.username, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
        )
    token = create_access_token(user)
    return LoginResponse(
        access_token=token,
        user=UserPublic(
            username=user['username'],
            role=user['role'],
            full_name=user['full_name'],
            full_name_ta=user.get('full_name_ta'),
        ),
    )


@router.get('/me', response_model=UserPublic)
def me(current: dict = Depends(get_current_user)):
    return UserPublic(
        username=current['username'],
        role=current['role'],
        full_name=current['full_name'],
        full_name_ta=current.get('full_name_ta'),
    )


@router.get('/demo-accounts')
def demo_accounts():
    """Public list of demo usernames for school pilot (passwords shown on login page only)."""
    return {
        'accounts': [
            {'username': 'admin', 'role': 'ADMIN', 'label': 'Admin / Headmaster'},
            {'username': 'teacher', 'role': 'TEACHER', 'label': 'Teacher'},
            {'username': 'student', 'role': 'STUDENT', 'label': 'Student SSLC'},
            {'username': 'parent', 'role': 'PARENT', 'label': 'Parent'},
        ],
        'note': 'Passwords: admin123, teacher123, student123, parent123',
    }
