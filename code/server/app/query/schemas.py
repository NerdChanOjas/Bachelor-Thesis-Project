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