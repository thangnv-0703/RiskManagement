from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from router import assessment, monitoring, detect_threat, scan_vulnerability

app = FastAPI(docs_url="/api/docs", openapi_url='/api/openapi.json')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment.router)
app.include_router(monitoring.router)
app.include_router(detect_threat.router)
app.include_router(scan_vulnerability.router)
# app.include_router()
@app.get('/health_check')
async def check():
    return {"message": "ok"}

if __name__ == "__main__":
    
    
    # Start the TCP server in a separate task
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info", access_log=False, workers=1)
    

    