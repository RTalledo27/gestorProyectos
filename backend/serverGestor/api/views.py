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
import secrets  # Importa el módulo secrets para generar tokens
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework import generics,permissions 


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
    authentication_classes = [CustomTokenAuthentication]  # Verifica esta línea
    permission_classes = [IsAuthenticated]

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



