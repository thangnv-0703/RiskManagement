import requests
import json
from fastapi.encoders import jsonable_encoder
from config import CATEGORY_SERVICE_HOST, CATEGORY_SERVICE_PORT

class CategoryProxyService:

    async def get_cves_by_cve_id(cve_id: str):
        category_service_url = "http://{}:{}".format(CATEGORY_SERVICE_HOST, CATEGORY_SERVICE_PORT)
        url = category_service_url + "/cves/{}".format(cve_id)
        response = requests.get(url)
        response = json.loads(response.content)
        return response

    async def get_cves_by_cpe_name(cpe_name: str):
        category_service_url = "http://{}:{}".format(CATEGORY_SERVICE_HOST, CATEGORY_SERVICE_PORT)
        url = category_service_url + "/cve/mapping/{}".format(cpe_name)
        response = requests.get(url)
        response = json.loads(response.content)
        return response