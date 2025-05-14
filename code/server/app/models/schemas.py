from pydantic import BaseModel

class EmbeddingRequest(BaseModel):
    document_id: str  
    text: str  
    metadata: dict 

# Request Schema
class QueryRequest(BaseModel):
    query: str  # User's query
    top_k: int = 5  # Number of top documents to retrieve
    metadata_filter: dict = None

class ReportUploadRequest(BaseModel):
    report: str
    patient_id: str  # optional, useful for filtering per-patient


class PromptRequest(BaseModel):
    prompt: str


class LLMResponse(BaseModel):
    response: str