from starlette.exceptions import HTTPException
from typing import Optional, Any, Dict, List

from .http_status import StatusCode

class ErrorResponse:
    message: str
    errors: Optional[List] = []

    def __init__(self, message, errors):
        self.message = message
        self.errors = errors

class CustomHTTPException(HTTPException):
    custom_body: ErrorResponse
    headers: Optional[Dict[str, Any]] = []

    def __init__(
            self,
            custom_status_code: StatusCode,
            detail: Any = None,
            headers: Optional[Dict[str, Any]] = None,
            errors=None
    ) -> None:
        super().__init__(status_code=custom_status_code.http_code, detail=detail)
        if errors is None:
            errors = []
        self.headers = headers
        self.custom_body = ErrorResponse(message=custom_status_code.message, errors=errors)
