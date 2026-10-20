
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("API key nahi mili. .env file check kar bhai!")

client = Groq(api_key=my_api_key)
model = "openai/gpt-oss-120b"

# Step 1: Knowledge Base
knowledge_base = {
    "age": "The age of Manan is 25 years.",
    "net worth": "The net worth of Manan is 2000."
}

# Step 2: Retrieval
def retrieve_info(question):
    question = question.lower()

    if "age" in question:
        return knowledge_base["age"]
    elif "net worth" in question:
        return knowledge_base["net worth"]
    else:
        return None

# Step 3: Generation
def ask_llm(question):
    context = retrieve_info(question)

    if context is None:
        return "Sorry, this information is not available in my knowledge base."

    messages = [
        {
            "role": "system",
            "content": (
                "Answer in one line only. "
                "Answer strictly using the provided context. "
                "Do not add or invent information. "
                f"Context: {context}"
            )
        },
        {
            "role": "user",
            "content": question
        }
    ]

    response = client.chat.completions.create(
        model=model,
        messages=messages
    )

    return response.choices[0].message.content


if __name__ == "__main__":
    question = input("Ask a question about Manan: ")
    print("Answer:", ask_llm(question))
