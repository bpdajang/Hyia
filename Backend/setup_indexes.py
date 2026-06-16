"""
Run this once after your first launch to set up indexes:
    python setup_indexes.py
"""
import asyncio
from database.mongodb import connect_db, get_db, close_db


async def create_indexes():
    await connect_db()
    db = get_db()

    await db.users.create_index("email", unique=True)
    print("✅ Index: users.email (unique)")

    await db.users.create_index("role")
    print("✅ Index: users.role")

    await db.users.create_index("profile.department")
    print("✅ Index: users.profile.department")

    await db.connections.create_index(
        [("sender_id", 1), ("receiver_id", 1)], unique=True
    )
    print("✅ Index: connections (sender_id + receiver_id, unique)")

    await db.connections.create_index("status")
    print("✅ Index: connections.status")

    print("\n🎉 All indexes created successfully")
    await close_db()


if __name__ == "__main__":
    asyncio.run(create_indexes())
