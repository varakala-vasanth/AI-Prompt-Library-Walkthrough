import json
import redis
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Prompt
from django.shortcuts import get_object_or_404
import jwt
import datetime

# Setup Redis Connection
try:
    r = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0, decode_responses=True)
    # Test connection
    r.ping()
except Exception:
    # Use dummy local dict if redis isn't available locally
    class DummyRedis:
        def __init__(self):
            self.data = {}
        def get(self, key):
            return self.data.get(key)
        def incr(self, key):
            self.data[key] = int(self.data.get(key, 0)) + 1
            return self.data[key]
    r = DummyRedis()


def generate_jwt(username):
    payload = {
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            
            # Simple dummy validation for assignment Bonus A purposes
            if username and password:
                token = generate_jwt(username)
                return JsonResponse({"token": token, "username": username})
            return JsonResponse({"error": "Invalid credentials"}, status=400)
        except Exception:
            return JsonResponse({"error": "Bad request"}, status=400)
    return JsonResponse({"error": "Method not allowed"}, status=405)


def authenticate_request(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


@csrf_exempt
def prompt_list(request):
    if request.method == "GET":
        tag = request.GET.get('tag')
        prompts = Prompt.objects.all().order_by('-created_at')
        if tag:
            prompts = prompts.filter(tags__name__iexact=tag)
        
        # Include Redis view count in the list view as well for nice UI? Assignment says "Show Title and Complexity", but not strictly view count here.
        # But we will use to_dict().
        res = [p.to_dict() for p in prompts]
        return JsonResponse(res, safe=False)

    elif request.method == "POST":
        # Protected POST endpoint
        user_payload = authenticate_request(request)
        if not user_payload:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        
        try:
            data = json.loads(request.body)
            title = data.get('title')
            content = data.get('content')
            complexity = data.get('complexity')

            # Backend Validation
            if not title or len(title) < 3:
                return JsonResponse({"error": "Title must be at least 3 chars"}, status=400)
            if not content or len(content) < 20:
                return JsonResponse({"error": "Content must be at least 20 chars"}, status=400)
            if complexity is None or not (1 <= int(complexity) <= 10):
                return JsonResponse({"error": "Complexity must be between 1 and 10"}, status=400)

            prompt = Prompt.objects.create(
                title=title,
                content=content,
                complexity=int(complexity)
            )
            return JsonResponse(prompt.to_dict(), status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def prompt_detail(request, pk):
    if request.method == "GET":
        prompt = get_object_or_404(Prompt, pk=pk)
        
        # Increment Redis Counter
        key = f"prompt:{prompt.id}:views"
        view_count = r.incr(key)
        
        data = prompt.to_dict()
        data['view_count'] = view_count
        
        return JsonResponse(data)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)
