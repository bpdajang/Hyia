import secrets

jwt_secret = secrets.token_urlsafe(64)
print(jwt_secret)