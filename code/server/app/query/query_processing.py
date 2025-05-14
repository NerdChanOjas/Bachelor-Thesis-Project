from fastapi import APIRouter, Depends, HTTPException
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
from transformers import pipeline
from uuid import uuid4

from .helper_functions import get_embedding_from_hf, chunk_text
from ..models.schemas import EmbeddingRequest, QueryRequest

router = APIRouter(
    prefix="/query"
)

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("docs")

# Load Embedding Model
# model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
# Load Local Text Generation Model
# text_generator = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

@router.post("/generate-embeddings/")
async def generate_embedding(request: EmbeddingRequest):
    try:
        text = request.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text can't be empty")
        document_id = request.document_id or str(uuid4())

        chunks = chunk_text(text)

        to_upsert = []
        for i, chunk in enumerate(chunks):
            embedding = get_embedding_from_hf()
            chunk_id = f"{document_id}_chunk_{i}"

            metadata = {
                "document_id": document_id,
                "chunk_id": i,
                "text": chunk,
                **request.metadata  # Optional additional metadata
            }
            to_upsert.append((chunk_id, embedding, metadata))
        index.upsert(to_upsert)
        return {
            "message": f"{len(chunks)} chunks embedded and stored successfully.",
            "document_id": document_id,
            "chunks_stored": len(chunks)
        }
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"An error occured: {str(e)}")

'''
@router.post("/generate-embedding/")
async def generate_embedding(request: EmbeddingRequest):
    try:
        # Step 1: Preprocess Text (if necessary)
        text = request.text.strip()
        if len(text) == 0:
            raise HTTPException(status_code=400, detail="Text cannot be empty.")

        # Step 2: Generate Embedding
        embedding = get_embedding_from_hf()

        # Step 3: Store Embedding in Pinecone
        pinecone_metadata = {
            "document_id": request.document_id,
            **request.metadata  # Include additional metadata
        }
        index.upsert([(request.document_id, embedding, pinecone_metadata)])

        # Step 4: Return Embedding in Response
        return {
            "message": "Embedding generated and stored successfully.",
            "document_id": request.document_id,
            "embedding": embedding,
            "metadata": pinecone_metadata,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
'''

'''
curl -X POST "http://127.0.0.1:8000/generate-embedding/" \
-H "Content-Type: application/json" \
-d '{
      "document_id": "doc123",
      "text": "This is a sample medical record text.",
      "metadata": {
          "patient_id": "patient123",
          "record_type": "lab_report"
      }
    } 
'''

# Endpoint for Query Processing
@router.post("/process-query/")
async def process_query(request: QueryRequest):
    try:
        # Step 1: Generate Embedding for the Query
        query_embedding = model.encode(request.query).tolist()

        # Step 2: Hypothetical Document Generation (HyDE)
        hypothetical_doc = text_generator(
            f"Given the query: '{request.query}', write a detailed hypothetical document that provides context for this query.",
            max_length=200,
            num_return_sequences=1
        )[0]["generated_text"]

        # Step 3: Embedding for Hypothetical Document
        hypothetical_embedding = model.encode(hypothetical_doc).tolist()

        # Step 4: Retrieve Relevant Documents from Pinecone
        query_results = index.query(
            vector=hypothetical_embedding,
            top_k=request.top_k,
            include_metadata=True,
            filter=request.metadata_filter  # Optional metadata filtering
        )

        # Step 5: Extract Relevant Documents
        retrieved_docs = [
            {"id": match["id"], "metadata": match["metadata"], "score": match["score"]}
            for match in query_results["matches"]
        ]

        # Step 6: RAG Pipeline with Retrieved Documents
        context = "\n".join(
            [f"Document {i + 1}: {doc['metadata'].get('text', 'No content')}" for i, doc in enumerate(retrieved_docs)]
        )
        final_answer = text_generator(
            f"""
            You are a medical assistant. Use the following context to answer the question accurately.

            Context:
            {context}

            Question: {request.query}

            Answer:
            """,
            max_length=200,
            num_return_sequences=1
        )[0]["generated_text"]

        # Step 7: Return Final Response
        return {
            "query": request.query,
            "hypothetical_doc": hypothetical_doc,
            "retrieved_docs": retrieved_docs,
            "final_answer": final_answer.strip()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
