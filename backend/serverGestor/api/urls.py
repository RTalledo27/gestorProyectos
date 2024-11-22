from django.urls import path
#from .views import proyectos
from django.urls import path
from .views import login, asignarRolProyecto, TareasListCreateView,TareasDetailView, ProyectosDetailView
from .views import ProyectosListCreateView, ServiciosDetailView, ServiciosListCreateView
from .views import ClientesListCreateView, ClientesDetailView
from .views import SubtareasListCreateView, SubtareasDetailView
from .views import CargosListView, CargosDetailView, UsuariosListView, UsuariosDetailView
from .views import ProyectosActivosCountView, DashboardDataView, AsignacionProyectosView
from .views import tareas_pendientes_por_proyecto, PermisoDetailView, PermisoListCreateView, AuditLogView,RolesPermisosView, RolDetailView, RolListCreateView
from . import views

urlpatterns = [
    path('login/', login, name='login'),
   ## path('proyectos/',proyectos, name='proyecto'),
    path('proyectos/', ProyectosListCreateView.as_view(), name='proyecto-list-create'),
    path('proyectos/<int:pk>/', ProyectosDetailView.as_view(), name='proyecto-detail'),
   ##ROLES
    path('roles/', RolListCreateView.as_view(), name='rol-list-create'),
    path('roles/<int:pk>/', RolDetailView.as_view(), name='rol-detail'),
   ##PERMISOS
    path('permisos/', PermisoListCreateView.as_view(), name='permiso-list-create'),
    path('permisos/<int:pk>/', PermisoDetailView.as_view(), name='permiso-detail'),
    path('roles/<int:pk>/permisos/', RolesPermisosView.as_view(), name='rol-permisos'),
    path('audit-logs/', AuditLogView.as_view(), name='audit-logs'),
     #RUTA ASIGNAR ROL A USUARIO EN EL PROYECTO
    path('proyectos/<int:proyecto_id>/asignarRol/', asignarRolProyecto, name='asignar-rol-proyecto'),
    #RUTA LISTA DE TAREAS
    path('tareas/', TareasListCreateView.as_view(), name='tareas-list-create'),
    path('tareas/<int:pk>/', TareasDetailView.as_view(), name='tarea-detail'),

##DATOS DE USUARIO
path('usuarios/', UsuariosListView.as_view(), name='usuarios-list-create'),
path('perfil/', UsuariosDetailView.as_view(), name='usuarios-detail'),


    #RUTAS DE SERVICIOS
    path('servicios/', ServiciosListCreateView.as_view(), name='servicios-list-create'),
    path('servicios/<int:pk>/', ServiciosDetailView.as_view(), name='servicio-detail'),

    ##RUTAS DE CLIENTES
    path('clientes/', ClientesListCreateView.as_view(), name='clientes-list-create'),
    path('clientes/<int:pk>/', ClientesDetailView.as_view(), name='cliente-detail'),

    ##RUTA DE SUBTAREAS
    path('subtareas/', SubtareasListCreateView.as_view(), name='subtareas-list-create'),
    path('subtareas/<int:pk>/', SubtareasDetailView.as_view(), name='subtarea-detail'),

    ##RUTA DE CARGOS
    path('cargos/', CargosListView.as_view(), name='cargos-list-create'),
    path('cargos/<int:pk>/', CargosDetailView.as_view(), name='cargos-detail'),

    ##RUTA DE USUARIOS
    path('usuarios/', UsuariosListView.as_view(), name='usuarios-list-create'), 
    path('usuarios/<int:pk>/', UsuariosDetailView.as_view(), name='usuarios-detail'),
    path('proyectos-activos-count/', ProyectosActivosCountView.as_view(), name='proyectos-activos-count'),


    ##RUTA DE ASIGNACION DE PROYECTO
    path('proyectos/<int:proyecto_id>/asignar/', AsignacionProyectosView.as_view(), name='asignar-proyecto'),
    path('proyectos/<int:proyecto_id>/asignar/<int:pk>/', AsignacionProyectosView.as_view(), name='asignar-proyecto'),

    ##RUTA DE DASHBOARD
        path('dashboard-data/', DashboardDataView.as_view(), name='dashboard-data'),

##TAREAS PENDIENTES POR PROYECTO
    path('proyectos/tareas-pendientes/', views.tareas_pendientes_por_proyecto, name='tareas_pendientes_por_proyecto'),


]


