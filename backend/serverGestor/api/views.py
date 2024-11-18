from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Proyectos, Roles,Permisos,UsuariosRol, Tarea
from .serializers import ProyectoSerializer
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
import datetime
from django.utils import timezone
from rest_framework.authtoken.models import Token
from .models import Usuarios, TokenAutenticacion, CustomTokenAuthentication, Clientes
from .models import Servicios
from .serializers import UsuariosSerializer, RolesSerializer, TareasSerializer
from .serializers import ServiciosSerializer, ClientesSerializer
from .models import Cargos 
from .serializers import SubTareasSerializer, CargosSerializer
from .models import ProyectoServicio, ProyectoCliente,SubTareas
import secrets  # Importa el módulo secrets para generar tokens
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework import generics,permissions
from django.db.models import Count, Q
from .models import Usuarios, AsignacionProyecto, Proyectos
from .serializers import PermisosSerializer

from .models import Proyectos, Tarea, Usuarios, Reporte
from django.utils import timezone
from datetime import timedelta

# Create your views here.

##LOGIN CON AUTENTICACION:
#from rest_framework.authentication import TokenAuthentication
#from rest_framework.permissions import IsAuthenticated
#from rest_framework.decorators import api_view
#from rest_framework.response import Response
#from rest_framework import status

## INICIO SPRINT 1:

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    usuario = get_object_or_404(Usuarios, username=username)

    if not usuario.is_active:
        return Response({'error': 'El usuario está inactivo'}, status=status.HTTP_401_UNAUTHORIZED)

    if not usuario.check_password(password):
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

    # Eliminar tokens previos para el usuario
    TokenAutenticacion.objects.filter(usuario=usuario).delete()
    
    # Generar un nuevo token
    expiration = timezone.now() + datetime.timedelta(days=30)
    token, created = TokenAutenticacion.objects.get_or_create(
        usuario=usuario, 
        defaults={'token': secrets.token_hex(16), 'expira_en': expiration}
    )

    serializer = UsuariosSerializer(instance=usuario)

    return Response({"token": token.token, 'estudiante': serializer.data}, status=status.HTTP_200_OK)






###@api_view(['GET'])
#@authentication_classes([CustomTokenAuthentication])
#@permission_classes([IsAuthenticated])
#def proyectos(request):
#    proyectos = Proyectos.objects.all()
#    serializer = ProyectoSerializer(proyectos, many=True)
#    return Response(serializer.data)    

## CREAR, EDITAR, ELIMINAR PROYECTOS
class ProyectosListCreateView(generics.ListCreateAPIView):
    queryset = Proyectos.objects.all()
    serializer_class = ProyectoSerializer
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
class ProyectosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Proyectos.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]  # Verifica esta línea

#GESTIONAR ROLES Y PERMISOS:

class RolListCreateView(generics.ListCreateAPIView):
    queryset = Roles.objects.all()
    serializer_class = RolesSerializer
    authentication_classes= [CustomTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class RolDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Roles.objects.all()
    serializer_class = RolesSerializer
    authentication_classes= [CustomTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
@api_view(['Post'])
@authentication_classes([CustomTokenAuthentication])
@permission_classes([IsAuthenticated])
def asignarRolProyecto(request, proyecto_id):
    rol_id = request.data.get('rol_id')


    #VERIFICAR EXISTENCIA DE DATOS REQUEST
    try:
        proyecto = Proyectos.objects.get(pk=proyecto_id)
        rol = Roles.objects.get(pk=rol_id)
        usuario = request.user
        

    except Proyectos.DoesNotExist:
        return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Roles.DoesNotExist:
        return Response({'error': 'Rol no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Usuarios.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    #ASIGNAR ROL A USUARIO EN EL PROYECTO
    UsuariosRol.objects.create(
        usuario=usuario, 
        rol=rol, 
        proyecto=proyecto)


    return Response({'message': 'Rol asignado correctamente al usuario en el proyecto.'}, status=status.HTTP_200_OK)

class PermisoListCreateView(generics.ListCreateAPIView):
    queryset = Permisos.objects.all()
    serializer_class = PermisosSerializer
    authentication_classes= [CustomTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

class PermisoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Permisos.objects.all()  # Esto está mal
    serializer_class = PermisosSerializer
    authentication_classes= [CustomTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    



    ## CREAR  EDITAR Y ELIMINAR TAREAS

class TareasListCreateView(generics.ListCreateAPIView):
    queryset = Tarea.objects.all()
    serializer_class = TareasSerializer
    authentication_classes= [CustomTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

class TareasDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tarea.objects.all()
    serializer_class = TareasSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes= [CustomTokenAuthentication]

class SubtareasListCreateView(generics.ListCreateAPIView):
    serializer_class = SubTareasSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]

    def get_queryset(self):
        queryset = SubTareas.objects.all()
        tarea_id = self.request.query_params.get('tarea', None)
        if tarea_id is not None:
            queryset = queryset.filter(tarea_id=tarea_id)
        return queryset

class SubtareasDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubTareas.objects.all()
    serializer_class = SubTareasSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]


 ## FIN SPRINT 1

 ###EXTRAAAAAA (ERICK HACKER)
    ## SERVICIOS LIST CREATE VIEW
class ServiciosListCreateView(generics.ListCreateAPIView):
    queryset = Servicios.objects.all()
    serializer_class = ServiciosSerializer
    authentication_classes= [CustomTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

class ServiciosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Servicios.objects.all()
    serializer_class = ServiciosSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes= [CustomTokenAuthentication]

### CLIENTES LIST CREATE VIEW
class ClientesListCreateView(generics.ListCreateAPIView):
    queryset = Clientes.objects.all()
    serializer_class = ClientesSerializer
    authentication_classes= [CustomTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

class ClientesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Clientes.objects.all()
    serializer_class = ClientesSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes= [CustomTokenAuthentication]


##USUARIOS LIST VIEW
class UsuariosListView(generics.ListCreateAPIView):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer
    authentication_classes= [CustomTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

##USUARIOS DETAIL VIEW
class UsuariosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes= [CustomTokenAuthentication]

class ProyectosActivosCountView(generics.RetrieveAPIView):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]

    def get(self, request):
        proyectos_activos = AsignacionProyecto.objects.filter(
            proyecto__estado__in=['En Progreso', 'Pendiente']
        ).values('usuario').annotate(count=Count('proyecto')).order_by('usuario')

        return Response(dict(proyectos_activos.values_list('usuario', 'count')))

##CARGOS LIST VIEW
class CargosListView(generics.ListCreateAPIView):
    queryset = Cargos.objects.all()
    serializer_class = CargosSerializer
    authentication_classes= [CustomTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

##CARGOS DETAIL VIEW
class CargosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cargos.objects.all()
    serializer_class = CargosSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes= [CustomTokenAuthentication]

##ASIGNACION DE PROYECTOS: 
class AsignacionProyectosView(generics.ListCreateAPIView):
    queryset = AsignacionProyecto.objects.all()
    serializer_class =ProyectoSerializer
    permission_classes= [IsAuthenticated]
    authentication_classes= [CustomTokenAuthentication]

    def post(self, request, *args, **kwargs):
        proyecto_id = request.data.get('proyecto_id')
        usuario_id = request.data.get('usuario_id')
        rol=request.data.get('rol')

        ##VERIFICAR SI PROYECTO EXISTE
        try:
            proyecto = Proyectos.objects.get(pk=proyecto_id)
        except Proyectos.DoesNotExist:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        ##VERIFICAR SI USUARIO EXISTE
        try:
            usuario = Usuarios.objects.get(pk=usuario_id)
        except Usuarios.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        ##VERIFICAR SI PROYECTO Y USUARIO NO ESTAN ASIGNADOS
        try:
            asignacion = AsignacionProyecto.objects.get(proyecto=proyecto, usuario=usuario)
        except AsignacionProyecto.DoesNotExist:
            return Response({'error': 'Usuario no está asignado a este proyecto'}, status=status.HTTP_404_NOT_FOUND)
    
        ##ASIGNAR PROYECTO
        asignacion, created = AsignacionProyecto.objects.update_or_create(
            proyecto=proyecto,
            usuario=usuario,
            defaults={'rol': rol}
        )

        if created:
            return Response({'message': 'Proyecto asignado exitosamente al usuario con el rol especificado.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Rol actualizado para el usuario en este proyecto.'}, status=status.HTTP_200_OK)


##DASHBOARD VIEW
class DashboardDataView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]

    def get(self, request):
        # Proyectos Activos
        proyectos_activos = Proyectos.objects.filter(estado__in=['En Progreso', 'Pendiente']).count()
        proyectos_nuevos = Proyectos.objects.filter(
            creado_en__gte=timezone.now() - timedelta(days=30)
        ).count()

        # Tareas Pendientes
        tareas_pendientes = Tarea.objects.filter(estado='Pendiente').count()
        tareas_alta_prioridad = Tarea.objects.filter(estado='Pendiente', prioridad='Alta').count()

        # Equipo
        miembros_equipo = Usuarios.objects.filter(is_active=True).count()
        miembros_nuevos = Usuarios.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).count()

        # Reportes Generados
        reportes_semana = Reporte.objects.filter(
            creado_en__gte=timezone.now() - timedelta(days=7)
        ).count()

        # Progreso de Proyectos
        proyectos_progreso = Proyectos.objects.filter(estado='En Progreso').order_by('-progreso')[:3]
        proyectos_data = [
            {
                'nombre': proyecto.nombre,
                'progreso': proyecto.progreso
            } for proyecto in proyectos_progreso
        ]

        # Tareas Recientes
        tareas_recientes = Tarea.objects.all().order_by('-creado_en')[:3]
        tareas_data = [
            {
                'titulo': tarea.titulo,
                'estado': tarea.estado,
                'fecha_vencimiento': tarea.fecha_vencimiento
            } for tarea in tareas_recientes
        ]

        return Response({
            'proyectos_activos': proyectos_activos,
            'proyectos_nuevos': proyectos_nuevos,
            'tareas_pendientes': tareas_pendientes,
            'tareas_alta_prioridad': tareas_alta_prioridad,
            'miembros_equipo': miembros_equipo,
            'miembros_nuevos': miembros_nuevos,
            'reportes_semana': reportes_semana,
            'proyectos_progreso': proyectos_data,
            'tareas_recientes': tareas_data
        })

@api_view(['GET'])
@authentication_classes([CustomTokenAuthentication])
@permission_classes([IsAuthenticated])
def tareas_pendientes_por_proyecto(request):
    proyectos = Proyectos.objects.annotate(
        tareas_pendientes=Count('tarea', filter=Q(tarea__estado='Pendiente'))
    )
    
    data = {
        str(proyecto.id): proyecto.tareas_pendientes 
        for proyecto in proyectos
    }
    
    return Response(data, status=status.HTTP_200_OK)
