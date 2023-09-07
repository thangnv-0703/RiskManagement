import os
from starlette.config import Config
# from dotenv import load_dotenv

# Determine the environment
environment = os.getenv("ENVIRONMENT", "local")  # Default to "local" if not specified

# Load the appropriate environment file
# if environment == "docker":
#     config = Config("../env.docker")
# else:
config = Config("../.env")

# Read configuration using starlette.config
# config = Config("../.env")  

# config = Config('../.env')
CATEGORY_SERVICE_HOST = config('CATEGORY_SERVICE_HOST', cast=str, default="localhost")
CATEGORY_SERVICE_PORT = config('CATEGORY_SERVICE_PORT', cast=int, default=3003)
# DB_USERNAME = config('DB_USERNAME', cast=str)
# DB_PASSWORD = config('DB_PASSWORD', cast=str)