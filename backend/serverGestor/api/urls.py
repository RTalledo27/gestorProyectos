from django.urls import path
#from .views import proyectos
from django.urls import path
from .views import login, RolListCreateView, RolDetailView, asignarRolProyecto, TareasListCreateView,TareasDetailView, ProyectosDetailView
from .views import ProyectosListCreateView, ServiciosDetailView, ServiciosListCreateView
from .views import ClientesListCreateView, ClientesDetailView
from .views import SubtareasListCreateView, SubtareasDetailView
urlpatterns = [
    path('login/', login, name='login'),
   ## path('proyectos/',proyectos, name='proyecto'),
    path('proyectos/', ProyectosListCreateView.as_view(), name='proyecto-list-create'),
    path('proyectos/<int:pk>/', ProyectosDetailView.as_view(), name='proyecto-detail'),
    path('roles/', RolListCreateView.as_view(), name='rol-list-create'),
    path('roles/<int:pk>/', RolDetailView.as_view(), name='rol-detail'),
    #RUTA ASIGNAR ROL A USUARIO EN EL PROYECTO
    path('proyectos/<int:proyecto_id>/asignarRol/', asignarRolProyecto, name='asignar-rol-proyecto'),
    #RUTA LISTA DE TAREAS
    path('tareas/', TareasListCreateView.as_view(), name='tareas-list-create'),
    path('tareas/<int:pk>/', TareasDetailView.as_view(), name='tarea-detail'),


    #RUTAS DE SERVICIOS
    path('servicios/', ServiciosListCreateView.as_view(), name='servicios-list-create'),
    path('servicios/<int:pk>/', ServiciosDetailView.as_view(), name='servicio-detail'),

    ##RUTAS DE CLIENTES
    path('clientes/', ClientesListCreateView.as_view(), name='clientes-list-create'),
    path('clientes/<int:pk>/', ClientesDetailView.as_view(), name='cliente-detail'),

    ##RUTA DE SUBTAREAS
    path('subtareas/', SubtareasListCreateView.as_view(), name='subtareas-list-create'),
    path('subtareas/<int:pk>/', SubtareasDetailView.as_view(), name='subtarea-detail'),

]


