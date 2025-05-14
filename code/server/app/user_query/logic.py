import os
import uuid
from typing import List

from langchain_pinecone.vectorstores import PineconeVectorStore as LangchainPinecone
from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.llms import Groq
from langchain_groq import ChatGroq
from langchain.schema import Document
from langchain_community.tools import WikipediaQueryRun
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_community.utilities import WikipediaAPIWrapper

from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec

from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

# === CONFIGURATION ===
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV") or "gcp-starter"
PINECONE_INDEX = os.getenv("PINECONE_INDEX") or "medical-rag"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama3-8b-8192"
print(PINECONE_API_KEY, PINECONE_INDEX, GROQ_API_KEY, GROQ_MODEL)
# === Init Components ===
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
# llm = Groq(api_key=GROQ_API_KEY, model=GROQ_MODEL)
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)
# pinecone = Pinecone(api_key=PINECONE_API_KEY)
# index = pinecone.Index(PINECONE_INDEX)
pinecone = Pinecone(api_key = PINECONE_API_KEY)
index = pinecone.Index(PINECONE_INDEX)
vectorstore = LangchainPinecone(index=index, embedding = embedding_model)

# === Tools ===
wikipedia_tool = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())

# === CHUNKING FUNCTION ===
def chunk_text(text: str) -> List[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=150,
        chunk_overlap=30
    )
    return splitter.split_text(text)

# === FUNCTION 1: Store Chunks in Pinecone ===
def embed_and_store_report(report: str, patient_id: str):
    chunks = chunk_text(report)

    documents = []
    for chunk in chunks:
        documents.append(
            Document(
                page_content=chunk,
                metadata={"patient_id": patient_id, "id": str(uuid.uuid4())}
            )
        )

    vectorstore.add_documents(documents)

# === FUNCTION 2: HyDE RAG Chat ===
def handle_hyde_query(query: str) -> str:
    # Step 1: Generate hypothetical answer
    hypothetical_answer = llm.invoke(query)

    # Step 2: Embed hypothetical answer
    embedded_hypo = embedding_model.embed_query(hypothetical_answer.content)

    # Step 3: Retrieve from Pinecone using embedded hypo-answer
    docs = vectorstore.similarity_search(hypothetical_answer.content, k=7)

    # Step 4: Optionally use Wikipedia to augment context
    wiki_context = wikipedia_tool.run(query)
    context_chunks = [doc.page_content for doc in docs]
    context = "\n".join(context_chunks) + f"\n\nWikipedia:\n{wiki_context}"

    # Step 5: Final answer generation
    final_prompt = (
        f"You are a helpful AI assistant answering medical queries based on patient reports "
        f"and reliable data.\n\nContext:\n{context}\n\nQuestion: {query}\nAnswer:"
    )

    aimsg = llm.invoke(final_prompt)
    return aimsg.content
