STATUS_OK = True
STATUS_FAIL = False

class StatusCode:
    message: str
    http_code: int

    def __init__(self,message,http_code):
        self.message = message
        self.http_code = http_code


STATUS_200_OK = StatusCode("Ok", 200)

STATUS_422_INVALID_PARAMETER = StatusCode("Invalid request parameter(s)", 422)
STATUS_403_FORBIDDEN = StatusCode("You don’t have permission to access", 403)
STATUS_405_METHOD_NOT_ALLOWED = StatusCode("Method Not Allowed", 405)
STATUS_401_UNAUTHORIZED = StatusCode("Unauthorized", 401)
STATUS_404_NOT_FOUND = StatusCode("Not found", 404)
STATUS_500_SERVER_ERROR = StatusCode("Server error", 500)