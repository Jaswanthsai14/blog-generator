import asyncio
import os
from langchain_mcp_adapters.client import MultiServerMCPClient

from langchain.agents import create_agent

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.decorators import permission_classes, throttle_classes


load_dotenv()







model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
   
    google_api_key=os.getenv("GOOGLE_API_KEY")
)
import json

system_prompt = """
You are a blog generation assistant.

You have access to tools that generate blogs from:
- YouTube links(Transcript)
- Webpage links

For ANY link the user provides, you MUST use the appropriate tool.
Do NOT write the blog yourself.

When the tool returns output,based on the information u get from the tool genearte the blog
return ONLY plain text. No JSON. No arrays. No metadata. :




"""

async def agent(link:str):
  client=MultiServerMCPClient({
    "remote-server":{
      "url":"http://127.0.0.1:8001/sse",
      "transport": "sse"
    }
  })
  tools=await client.get_tools()

  ai=create_agent(model=model,tools=tools,system_prompt=system_prompt)
 

  result=await ai.ainvoke({"messages":[{"role":"user","content": f"Generate a blog for this link: {link}"}]})
 
  last_msg = result["messages"][-1].content

    
  last_msg = result["messages"][-1].content


  if isinstance(last_msg, list):
      text_parts = []

      for part in last_msg:
          if isinstance(part, dict):
              if "text" in part and isinstance(part["text"], str):
                  text_parts.append(part["text"])
              elif "content" in part and isinstance(part["content"], str):
                  text_parts.append(part["content"])

      res = " ".join(text_parts).strip()

  else:
      res = str(last_msg).strip()

  llm1 = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),   
    model_name="llama-3.3-70b-versatile",
    temperature=0,
)
  messages = [
    ("system", "you are title generator."),
    ("user", f"generate a title for following. strictly give one title as per the content\n {res}")
]

  response1 = llm1.invoke(messages)
  title=response1.content.strip()
  res = " ".join(res.split())
  res=res.replace("\"","")
  res=res.replace("**","")
  title=title.replace("**","")
  title=title.replace("\"","")


  
  return {"title":title,"content":res}

  




  