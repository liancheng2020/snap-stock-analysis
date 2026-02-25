import os
import httpx
import asyncio

DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')
DEEPSEEK_API_URL = os.environ.get('DEEPSEEK_API_URL', 'https://api.deepseek.ai')

async def _call_deepseek_async(prompt: str, model: str = 'gpt-4', max_tokens: int = 512):
    if not DEEPSEEK_API_KEY:
        raise RuntimeError('DEEPSEEK_API_KEY is not set')
    url = f"{DEEPSEEK_API_URL}/v1/chat/completions"
    headers = {
        'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': model,
        'messages': [
            {'role': 'user', 'content': prompt}
        ],
        'max_tokens': max_tokens,
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        # Try to extract assistant content in common schema
        try:
            return data['choices'][0]['message']['content']
        except Exception:
            return data

def call_deepseek(prompt: str, model: str = 'gpt-4', max_tokens: int = 512):
    """Synchronous wrapper to call DeepSeek API."""
    return asyncio.get_event_loop().run_until_complete(_call_deepseek_async(prompt, model=model, max_tokens=max_tokens))
