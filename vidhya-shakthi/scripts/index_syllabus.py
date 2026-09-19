#!/usr/bin/env python3
"""
Index Samacheer Kalvi PDF textbooks into Qdrant vector database for RAG tutor.
Usage: python scripts/index_syllabus.py --pdf-dir ./data/samacheer_pdfs
"""
import argparse
import hashlib
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from pypdf import PdfReader
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from app.core.config import get_settings

settings = get_settings()
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def extract_pdf_chunks(pdf_path: Path, subject_id: str, chapter_title: str) -> list[dict]:
    reader = PdfReader(str(pdf_path))
    full_text = ""
    for page_num, page in enumerate(reader.pages, 1):
        text = page.extract_text() or ""
        full_text += f"\n--- Page {page_num} ---\n{text}"

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ".", " "],
    )
    chunks = splitter.split_text(full_text)
    return [
        {
            "text": chunk,
            "subject_id": subject_id,
            "chapter_title": chapter_title,
            "page_number": (i * CHUNK_SIZE // 600) + 1,
            "source_file": pdf_path.name,
        }
        for i, chunk in enumerate(chunks)
    ]


def ensure_collection(client: QdrantClient, vector_size: int = 1536):
    collections = [c.name for c in client.get_collections().collections]
    if settings.QDRANT_COLLECTION not in collections:
        client.create_collection(
            collection_name=settings.QDRANT_COLLECTION,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )
        print(f"Created collection: {settings.QDRANT_COLLECTION}")


def index_pdfs(pdf_dir: Path):
    if not settings.OPENAI_API_KEY:
        print("ERROR: OPENAI_API_KEY required for embeddings")
        sys.exit(1)

    embeddings = OpenAIEmbeddings(model=settings.EMBEDDING_MODEL, api_key=settings.OPENAI_API_KEY)
    client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY or None)
    ensure_collection(client)

    pdf_files = list(pdf_dir.glob("**/*.pdf"))
    if not pdf_files:
        print(f"No PDF files found in {pdf_dir}")
        return

    all_chunks: list[dict] = []
    for pdf in pdf_files:
        parts = pdf.stem.split("_")
        subject_id = parts[0] if parts else "unknown"
        chapter_title = parts[1] if len(parts) > 1 else pdf.stem
        chunks = extract_pdf_chunks(pdf, subject_id, chapter_title)
        all_chunks.extend(chunks)
        print(f"  Extracted {len(chunks)} chunks from {pdf.name}")

    print(f"Embedding {len(all_chunks)} chunks...")
    texts = [c["text"] for c in all_chunks]
    vectors = embeddings.embed_documents(texts)

    points = []
    for i, (chunk, vector) in enumerate(zip(all_chunks, vectors)):
        point_id = int(hashlib.md5(f"{chunk['source_file']}_{i}".encode()).hexdigest()[:8], 16)
        points.append(
            PointStruct(
                id=point_id,
                vector=vector,
                payload=chunk,
            )
        )

    batch_size = 100
    for start in range(0, len(points), batch_size):
        batch = points[start : start + batch_size]
        client.upsert(collection_name=settings.QDRANT_COLLECTION, points=batch)
        print(f"  Indexed {min(start + batch_size, len(points))}/{len(points)}")

    print(f"Done. Indexed {len(points)} vectors into '{settings.QDRANT_COLLECTION}'")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Index Samacheer Kalvi PDFs into Qdrant")
    parser.add_argument("--pdf-dir", type=Path, default=Path("./data/samacheer_pdfs"))
    args = parser.parse_args()
    index_pdfs(args.pdf_dir)
