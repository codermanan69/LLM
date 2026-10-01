import os
import json
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel

load_dotenv()

my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("API key Kaha hai bhaisahab!!")

client = Groq(api_key=my_api_key)

model = "openai/gpt-oss-20b"


class Ticket(BaseModel):
    name: str
    email: str
    issue: str
    address: str


schema = Ticket.model_json_schema()

response_format = {
    "type": "json_object"
}


system_prompt = f"""
Extract the personal information from the ticket strictly based on this schema
and return the answer in JSON format.

Schema:
{schema}
"""


message_schema = {
    "role": "system",
    "content": system_prompt
}


text = """
Hello my name is manan. I have purchased an iphone which is not working at all.
My address is delhi. My mail is this manan@gmail.com
"""


prompt = f"""
This is a customer. Please extract the personal information from this.

{text}
"""


message = {
    "role": "user",
    "content": prompt
}


messages = [message_schema, message]


response = client.chat.completions.create(
    model=model,
    messages=messages,
    response_format=response_format
)


answer = response.choices[0].message.content

data = json.loads(answer)

print(json.dumps(data, indent=4))