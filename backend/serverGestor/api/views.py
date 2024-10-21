from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Proyectos
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
from .models import Usuarios, TokenAutenticacion, CustomTokenAuthentication
from .serializers import UsuariosSerializer
import secrets  # Importa el módulo secrets para generar tokens
from rest_framework.decorators import authentication_classes, permission_classes


# Create your views here.

##LOGIN CON AUTENTICACION:
#from rest_framework.authentication import TokenAuthentication
#from rest_framework.permissions import IsAuthenticated
#from rest_framework.decorators import api_view
#from rest_framework.response import Response
#from rest_framework import status

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






@api_view(['GET'])
@authentication_classes([CustomTokenAuthentication])
@permission_classes([IsAuthenticated])
def proyectos(request):
    proyectos = Proyectos.objects.all()
    serializer = ProyectoSerializer(proyectos, many=True)
    return Response(serializer.data)

