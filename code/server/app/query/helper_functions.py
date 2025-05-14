import requests

async def get_embedding_from_hf(text: str):
    headers = {
        "Authorization": f"Bearer 981f28b2-931a-46b5-aea7-47b1856b75c1",
    }
    json_data = {
        "inputs": text
    }

    response = requests.post(
        "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
        headers=headers,
        json=json_data
    )

    if response.status_code != 200:
        raise Exception(f"HF API Error: {response.status_code}, {response.text}")
    
    embedding = response.json()
    # Sometimes returns list of vectors (one per token); take mean if needed
    if isinstance(embedding[0], list):
        # Average pooling
        embedding = [sum(col) / len(col) for col in zip(*embedding)]
    
    return embedding

def chunk_text(text, chunk_size=100, overlap=25):
    tokens = text.split()
    chunks = []
    for i in range(0, len(tokens), chunk_size - overlap):
        chunk = tokens[i:i + chunk_size]
        chunks.append(" ".join(chunk))
    return chunks