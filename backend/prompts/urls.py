from django.urls import path
from . import views

urlpatterns = [
    path('prompts/', views.prompt_list, name='prompt-list'),
    path('prompts/<uuid:pk>/', views.prompt_detail, name='prompt-detail'),
    path('auth/login/', views.login_view, name='login'),
]
