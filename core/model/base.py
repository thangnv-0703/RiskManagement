from datetime import datetime
from pydantic import BaseModel, Field, validator


class BaseResponse:

    def __init__(self, data = None, options: dict = {}, status: bool = True, message: str = '') -> None:
        self.status = status
        if data:
           self.data = data 
        if message != '':
            self.message = message
        if options != {}:
            for key in options:
                self.__setattr__(key, options[key])


class MixinTimestampsBaseModel(BaseModel):
    created_at: datetime = Field(...)
    updated_at: datetime = Field(...)


class MixinUserBaseModel(MixinTimestampsBaseModel):
    created_by: str = Field(...)
    updated_by: str = Field(...)