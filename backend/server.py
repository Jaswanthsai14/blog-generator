from bs4 import BeautifulSoup
from langchain_community.document_loaders import YoutubeLoader
from fastmcp import FastMCP
import google.generativeai as genai
from typing import Dict
import requests
from playwright.async_api import async_playwright
from playwright.sync_api import sync_playwright
genai.configure(api_key="AIzaSyDHCFdYZSH0ec1eHLC8D1K_9wwHKdFsis0")

llm = genai.GenerativeModel("gemini-2.5-flash")
headers = {
 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
}

mcp=FastMCP("remote7")

@mcp.tool()
async def youtube(link:str)->str:
  """
  only pass exact youtube link as arguments
  Generates transcript for youtube blog generation
  """
  
  loader =  YoutubeLoader.from_youtube_url(link, language=[
        "auto", "en",
        "hi", "ta", "te", "kn", "ml",
        "ja", "ko", "fr", "es"
    ],add_video_info=False)
  docs = loader.load()

  transcript = docs[0].page_content
  if not docs[0].page_content:
    return "no transcript found"
  print(transcript)
  
  
  return transcript
@mcp.tool()
def nouse(link:str)->str:
  
  
  
  response=requests.get(link,headers=headers)
  if not response.content:
    return "invalid url or no content found"

  contentt=BeautifulSoup(response.content,'html.parser')
  for i in contentt.body(["script","img","style","input"]):
    i.decompose()
  tex=contentt.body.get_text(separator="\n", strip=True)
  print(tex)
  return tex





@mcp.tool()
async def webpage(link: str) -> str:
    """
    used to retrive information from webpages
    
    :param link: Description
    :type link: str
    :return: Description
    :rtype: str
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox"
            ]
        )

        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )

        page = await context.new_page()

        
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
        """)

        await page.goto(link, wait_until="domcontentloaded", timeout=60000)
        await page.wait_for_timeout(6000)

        content = await page.content()
        await browser.close()

    soup = BeautifulSoup(content, "html.parser")
    for tag in soup(["script","style","nav","footer","header"]):
        tag.decompose()

    text = soup.get_text(separator="\n", strip=True)
    print(text)
    return text







if __name__ == "__main__":
    
   mcp.run(transport="sse", port=8001)



  
  

