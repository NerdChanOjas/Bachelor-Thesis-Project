from fastapi import APIRouter, HTTPException
from ..models.schemas import ReportUploadRequest, PromptRequest, LLMResponse
from .logic import (
    embed_and_store_report,
    handle_hyde_query,
)

router = APIRouter(
    prefix="/uquery"
)

@router.post("/upload_report", tags=["Embedding"])
def upload_report(request: ReportUploadRequest):
    embed_and_store_report(request.report, request.patient_id)
    return {"message": "Report processed and stored successfully."}


@router.post("/query", response_model=LLMResponse, tags=["Chat"])
def query_chatbot(request: PromptRequest):
    try:
        answer = handle_hyde_query(request.prompt)
        return LLMResponse(response=answer)
    except Exception as e:
        print("❌ Exception in query handler:", str(e))
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
