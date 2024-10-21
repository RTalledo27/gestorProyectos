from django.urls import path
from .views import proyectos
from django.urls import path
from .views import login

urlpatterns = [
    path('login/', login, name='login'),
    path('proyectos/',proyectos, name='proyecto'),
    #path('proyectos/<int:pk>/', ProyectoRetrieveUpdateDestroy.as_view(), name='proyecto-retrieve-update-destroy'),
]