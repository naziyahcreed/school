import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.core.config import get_settings

settings = get_settings()


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


# Demo school accounts — change in production / sync with DB seed
DEMO_USERS: list[dict] = [
    {
        'username': 'admin',
        'password_hash': _hash_password('admin123'),
        'role': 'ADMIN',
        'full_name': 'School Admin',
        'full_name_ta': 'நிர்வாகி',
    },
    {
        'username': 'teacher',
        'password_hash': _hash_password('teacher123'),
        'role': 'TEACHER',
        'full_name': 'Ravi Kumar (Teacher)',
        'full_name_ta': 'ஆசிரியர் ரவி',
    },
    {
        'username': 'meena',
        'password_hash': _hash_password('meena123'),
        'role': 'TEACHER',
        'full_name': 'Meena Rani (Teacher)',
        'full_name_ta': 'ஆசிரியர் மீனா',
    },
    {
        'username': 'student',
        'password_hash': _hash_password('student123'),
        'role': 'STUDENT',
        'full_name': 'Suresh Kumar (Std 10-A)',
        'full_name_ta': 'மாணவர் சுரேஷ்',
    },
    {
        'username': 'priya',
        'password_hash': _hash_password('priya123'),
        'role': 'STUDENT',
        'full_name': 'Priya Sharma (Std 10-A)',
        'full_name_ta': 'பிரியா',
    },
    {
        'username': 'karthik',
        'password_hash': _hash_password('karthik123'),
        'role': 'STUDENT',
        'full_name': 'Karthik Prakash (Std 10-A)',
        'full_name_ta': 'கார்த்திக்',
    },
    {
        'username': 'parent',
        'password_hash': _hash_password('parent123'),
        'role': 'PARENT',
        'full_name': 'Kavya (Parent)',
        'full_name_ta': 'பெற்றோர் திவ்யா',
    },
]


def verify_password(plain: str, password_hash: str) -> bool:
    return secrets.compare_digest(_hash_password(plain), password_hash)


def authenticate(username: str, password: str) -> dict | None:
    key = username.strip().lower()
    for user in DEMO_USERS:
        if user['username'] == key and verify_password(password, user['password_hash']):
            return user
    return None


def create_access_token(user: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        'sub': user['username'],
        'role': user['role'],
        'name': user['full_name'],
        'name_ta': user.get('full_name_ta'),
        'exp': expire,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except JWTError:
        return None


def user_from_claims(claims: dict) -> dict:
    username = claims.get('sub', '')
    for u in DEMO_USERS:
        if u['username'] == username:
            return u
    return {
        'username': username,
        'role': claims.get('role', 'STUDENT'),
        'full_name': claims.get('name', username),
        'full_name_ta': claims.get('name_ta'),
    }
