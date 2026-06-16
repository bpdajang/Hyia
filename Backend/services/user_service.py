def serialize_user(user: dict) -> dict:
    """Convert a MongoDB user document to a JSON-serializable dict."""
    if not user:
        return {}
    user["id"] = str(user.pop("_id", ""))
    user.pop("hashed_password", None)
    user.pop("skills_embedding", None)
    return user
