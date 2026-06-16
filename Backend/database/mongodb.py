from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client[settings.DB_NAME]
        # Verify connection
        await client.admin.command("ping")
        print(f"✅ Connected to MongoDB — database: '{settings.DB_NAME}'")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise


async def close_db():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")


def get_db():
    return db
