import json
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def google_auth(request):
    """
    Handle Google OAuth authentication
    """
    try:
        data = json.loads(request.body)
        access_token = data.get('access_token')
        user_info = data.get('user_info')
        
        if not access_token:
            return JsonResponse({'error': 'Access token is required'}, status=400)
        
        # If user_info is provided directly, use it; otherwise verify with Google
        if user_info:
            google_user_info = user_info
        else:
            google_user_info = get_google_user_info(access_token)
            if not google_user_info:
                return JsonResponse({'error': 'Invalid access token'}, status=400)
        
        # Get or create user
        user = get_or_create_user(google_user_info)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return JsonResponse({
            'access_token': str(access_token),
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'profile_picture': user.profile_picture,
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Google auth error: {str(e)}")
        return JsonResponse({'error': 'Authentication failed'}, status=500)


def get_google_user_info(access_token):
    """
    Get user information from Google using access token
    """
    try:
        response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Google API error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Error fetching Google user info: {str(e)}")
        return None


def get_or_create_user(google_user_info):
    """
    Get or create user from Google user info
    """
    email = google_user_info.get('email')
    google_id = google_user_info.get('id')
    name = google_user_info.get('name', '')
    picture = google_user_info.get('picture', '')
    
    if not email:
        raise ValueError("Email is required")
    
    # Try to get user by Google ID first, then by email
    user = None
    if google_id:
        try:
            user = User.objects.get(google_id=google_id)
        except User.DoesNotExist:
            pass
    
    if not user:
        try:
            user = User.objects.get(email=email)
            # Update Google ID if not set
            if not user.google_id and google_id:
                user.google_id = google_id
                user.save()
        except User.DoesNotExist:
            # Create new user
            user = User.objects.create(
                email=email,
                google_id=google_id,
                first_name=name.split(' ')[0] if name else '',
                last_name=' '.join(name.split(' ')[1:]) if len(name.split(' ')) > 1 else '',
                profile_picture=picture,
                role=User.Role.STUDENT,  # Default to student for waitlist
                is_active=True,
            )
    
    # Update profile picture if it changed
    if picture and user.profile_picture != picture:
        user.profile_picture = picture
        user.save()
    
    return user


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
@csrf_exempt
def google_auth_callback(request):
    """
    Handle Google OAuth callback with authorization code
    """
    try:
        # Handle both GET (redirect) and POST (API) requests
        if request.method == 'GET':
            code = request.GET.get('code')
            error = request.GET.get('error')
            
            if error:
                # Redirect to frontend with error
                return redirect(f"{settings.FRONTEND_URL}/index.html?error={error}")
            
            if not code:
                return redirect(f"{settings.FRONTEND_URL}/index.html?error=no_code")
            
            # Exchange code for tokens
            # Use the exact redirect_uri that was sent to Google in the initial authorization request
            # This is now loaded from settings.PUBLIC_BACKEND_URL for better maintainability
            redirect_uri = f"{settings.PUBLIC_BACKEND_URL}/api/users/auth/google/callback/"
            token_data = exchange_code_for_tokens(code, redirect_uri)
            
            if not token_data:
                return redirect(f"{settings.FRONTEND_URL}/index.html?error=token_exchange_failed")
            
            # Get user info from Google
            user_info = get_google_user_info_from_token(token_data['access_token'])
            
            if not user_info:
                return redirect(f"{settings.FRONTEND_URL}/index.html?error=user_info_failed")
            
            # Get or create user
            user = get_or_create_user(user_info)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Store tokens in session or pass them somehow
            # For now, redirect to success page
            return redirect(f"{settings.FRONTEND_URL}/congrats.html?success=true")
        
        else:  # POST request
            data = json.loads(request.body)
            code = data.get('code')
            redirect_uri = data.get('redirect_uri')
            
            if not code:
                return JsonResponse({'error': 'Authorization code is required'}, status=400)
            
            # Exchange code for tokens
            token_data = exchange_code_for_tokens(code, redirect_uri)
            
            if not token_data:
                return JsonResponse({'error': 'Failed to exchange code for tokens'}, status=400)
            
            # Get user info from Google
            user_info = get_google_user_info_from_token(token_data['access_token'])
            
            if not user_info:
                return JsonResponse({'error': 'Failed to get user information'}, status=400)
            
            # Get or create user
            user = get_or_create_user(user_info)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return JsonResponse({
                'access_token': str(access_token),
                'refresh_token': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role,
                    'profile_picture': user.profile_picture,
                }
            })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        logger.error(f"Google auth callback error: {str(e)}")
        return JsonResponse({'error': 'Authentication failed'}, status=500)


def exchange_code_for_tokens(code, redirect_uri):
    """
    Exchange authorization code for access tokens
    """
    try:
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
            'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': redirect_uri,
        }
        
        response = requests.post(token_url, data=token_data)
        
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Token exchange error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Error exchanging code for tokens: {str(e)}")
        return None


def get_google_user_info_from_token(access_token):
    """
    Get user information from Google using access token
    """
    try:
        response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Google API error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Error fetching Google user info: {str(e)}")
        return None


@api_view(['GET'])
@permission_classes([AllowAny])
def google_auth_url(request):
    """
    Get Google OAuth URL for frontend to redirect to
    """
    from urllib.parse import urlencode
    
    params = {
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'redirect_uri': f"{settings.FRONTEND_URL}/auth/callback.html",
        'scope': 'openid email profile',
        'response_type': 'code',
        'access_type': 'offline',
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    
    return JsonResponse({'auth_url': auth_url})
