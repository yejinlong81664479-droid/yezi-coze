# Database module
from .supabase_client import get_supabase_client
from .model import InterviewTip, InterviewQuestion

__all__ = ['get_supabase_client', 'InterviewTip', 'InterviewQuestion']
