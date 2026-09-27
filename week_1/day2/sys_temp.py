import os 
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

load_dotenv() 
my_api_key=os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("API key Kaha hai bhaisahab!!")

client=Groq(api_key=my_api_key)

model="openai/gpt-oss-20b"
role= "user"
prompt="Suggest a name for my food company"

message_system={
    "role": "system",
    "content":"You are a brand manager who suggests one name for my food company. name should be in one word"
}
message={
    "role": role,
    "content" : prompt
    
}

messages=[message_system, message]

response=client.chat.completions.create(
    model=model,
    messages=messages,
    temperature=2
    
    )
# print(response)

print("####################################")

answer=response.choices[0].message.content
print(answer)