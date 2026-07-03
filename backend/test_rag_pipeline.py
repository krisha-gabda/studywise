"""
Standalone test for the RAG pipeline so far:
chunker -> embedder -> vector_store

Run this directly from your backend/ folder:
    python test_rag_pipeline.py

This does NOT touch FastAPI, the database, or any routes.
It's just here to catch bugs in isolation before wiring things together.
"""

from services.chunker import chunk_text
from services.embedder import embed_text, embed_chunks
from services.vector_store import store_chunks, query_chunks
from services.topic_extractor import extract_topics


def run_test():
    print("=" * 50)
    print("STEP 1 — Chunking")
    print("=" * 50)

    sample_text = (
        "Neural networks are computing systems inspired by biological brains. "
        "They consist of layers of interconnected nodes called neurons. "
        "Each connection has a weight that is adjusted during training. "
        "Backpropagation is the algorithm used to update these weights. "
        "It works by calculating the gradient of the loss function. "
        "The gradient tells us how to adjust each weight to reduce error. "
        "This process repeats over many iterations called epochs. "
        "Overfitting happens when a model learns the training data too well. "
        "Regularization techniques like dropout help prevent overfitting. "
        "Convolutional neural networks are commonly used for image tasks."
    )

    chunks = chunk_text(sample_text, chunk_size=20, overlap=5)
    print(f"Number of chunks: {len(chunks)}")
    for i, c in enumerate(chunks):
        print(f"  Chunk {i}: {c}")

    if len(chunks) == 0:
        print("FAILED — no chunks produced")
        return

    print("\n" + "=" * 50)
    print("STEP 2 — Embedding a single chunk")
    print("=" * 50)

    single_vector = embed_text(chunks[0])
    print(f"Vector length: {len(single_vector)}")
    print(f"First 5 values: {single_vector[:5]}")

    if len(single_vector) == 0:
        print("FAILED — empty embedding returned")
        return

    print("\n" + "=" * 50)
    print("STEP 3 — Batch embedding all chunks")
    print("=" * 50)

    all_vectors = embed_chunks(chunks)
    print(f"Number of vectors returned: {len(all_vectors)}")
    print(f"Matches number of chunks: {len(all_vectors) == len(chunks)}")

    if len(all_vectors) != len(chunks):
        print("FAILED — mismatch between chunks and vectors")
        return

    print("\n" + "=" * 50)
    print("STEP 4 — Storing in ChromaDB")
    print("=" * 50)

    test_user_id = "test-user-123"
    test_project_id = "test-project-456"
    test_topic_name = "Neural Networks"

    try:
        store_chunks(
            user_id=test_user_id,
            project_id=test_project_id,
            topic_name=test_topic_name,
            chunks=chunks,
            embeddings=all_vectors
        )
        print("Stored successfully")
    except Exception as e:
        print(f"FAILED on store_chunks: {e}")
        return

    print("\n" + "=" * 50)
    print("STEP 5 — Querying ChromaDB")
    print("=" * 50)

    query = "How does backpropagation work?"

    try:
        results = query_chunks(
            user_id=test_user_id,
            project_id=test_project_id,
            query_text=query,
            top_k=3
        )
        print(f"Query: '{query}'")
        print(f"Number of results: {len(results)}")
        for i, r in enumerate(results):
            print(f"  Result {i}: {r}")
    except Exception as e:
        print(f"FAILED on query_chunks: {e}")
        return

    print("\n" + "=" * 50)
    print("STEP 6 — Filtering check (different user should get nothing)")
    print("=" * 50)

    try:
        other_user_results = query_chunks(
            user_id="some-other-user-999",
            project_id=test_project_id,
            query_text=query,
            top_k=3
        )
        print(f"Results for different user: {len(other_user_results)} (should be 0)")
        if len(other_user_results) != 0:
            print("WARNING — user filtering may not be working correctly")
    except Exception as e:
        print(f"FAILED on filtering check: {e}")
        return

    print("\n" + "=" * 50)
    print("STEP 7 — Topic Extraction Check (checking if the gemini properly extracts the topic from the notes)")
    print("=" * 50)

    try:
        print(extract_topics(sample_text))
    except Exception as e:
        print(f"FAILED on prompting check: {e}")
        return

    print("\n" + "=" * 50)
    print("ALL STEPS COMPLETED — review output above for correctness")
    print("=" * 50)


if __name__ == "__main__":
    run_test()