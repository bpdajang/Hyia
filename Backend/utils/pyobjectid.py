from bson import ObjectId
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema


class PyObjectId(str):
    """Custom type that serialises MongoDB ObjectId as a plain string."""

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return cls(str(v))
        if isinstance(v, str) and ObjectId.is_valid(v):
            return cls(v)
        raise ValueError(f"Invalid ObjectId: {v}")

    @classmethod
    def __get_validators__(cls):
        yield cls.validate
