
import os
from dotenv import load_dotenv
from groq import Groq
from time import sleep

# Load API key from .env
load_dotenv()
my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("API key kaha hai bhai")

client = Groq(api_key=my_api_key)
model = "openai/gpt-oss-120b"

JD = """
We are hiring a Backend Python Developer.

Requirements:
- Strong Python
- FastAPI or Django
- PostgreSQL
- Docker
- AWS
- REST APIs
- 2+ years of experience
"""

RESUME = """
Name: Manan Sahni

Experience:
3 years as a Software Developer.

Skills:
Python, FastAPI, MySQL, Docker,
REST APIs, Git

Projects:
Built a food delivery backend using
FastAPI and MySQL.

Deployed applications using Docker.
"""


def ask_llm(system_prompt, user_prompt):
    sys_msg = {
        "role": "system",
        "content": system_prompt
    }

    user_msg = {
        "role": "user",
        "content": user_prompt
    }

    messages = [sys_msg, user_msg]

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0
    )

    answer = response.choices[0].message.content
    return answer


def step1_res_extract():
    system_prompt = """
    You are a professional HR assistant.
    Extract the skills explicitly mentioned in the candidate's resume.
    Return only the skills. Do not invent any skills.
    """

    user_prompt = f"""
    Extract the skills from this resume:

    {RESUME}
    """

    return ask_llm(system_prompt, user_prompt)


def step2_JD_extract():
    system_prompt = """
    You are a professional HR assistant.
    Extract the skills and requirements mentioned in the job description.
    Return only those requirements. Do not invent any.
    """

    user_prompt = f"""
    Extract the requirements from this job description:

    {JD}
    """

    return ask_llm(system_prompt, user_prompt)


def step3_match(candidate, jd):
    print("\nSTEP 3: Matching candidate with job description")

    system_prompt = """
    You are a professional HR assistant.
    Compare the candidate's skills with the job requirements.

    Return:
    1. Match score from 1 to 100.
    2. Matching skills.
    3. Missing skills.
    4. A short verdict explaining the candidate's suitability.

    Base your assessment only on the provided information.
    """

    user_prompt = f"""
    Compare the candidate with the job description.

    JOB REQUIREMENTS:
    {jd}

    CANDIDATE SKILLS:
    {candidate}
    """

    return ask_llm(system_prompt, user_prompt)


# Run the three steps
if __name__ == "__main__":
    print("STEP 1: Extracting candidate skills...")
    candidate = step1_res_extract()
    print(candidate)

    sleep(2)

    print("\nSTEP 2: Extracting job requirements...")
    jd = step2_JD_extract()
    print(jd)

    sleep(2)

    print("\nSTEP 3: Matching candidate and job...")
    score = step3_match(candidate, jd)
    print("\nFINAL RESULT:")
    print(score)
