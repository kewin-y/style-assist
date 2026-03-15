import os 
from dotenv import load_dotenv
from supabase import create_client, Client 

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url,key)

DUMMY_USER: str = os.environ.get("DUMMY_USER_ID")