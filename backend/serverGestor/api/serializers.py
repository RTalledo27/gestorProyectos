from datetime import timezone
from rest_framework import serializers
from .models import Usuarios, Proyectos, Roles, Servicios
from .models import RolesPermisos, Permisos,Tarea, Clientes


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id','username','email','nombres','apellidos','created_at','last_login','is_active','is_staff','is_superuser','groups','user_permissions']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class ProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyectos
        fields = '__all__'
        depth = 3
       



#ESTRUCTURA ROLES Y PERMISOS
class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permisos
        fields = '__all__'

class RolesPermisosSerializer(serializers.ModelSerializer):
    rol = RolesSerializer()
    permiso = PermisoSerializer()

    class Meta:
        model = RolesPermisos
        fields = '__all__'
class TareasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = '__all__'
        depth = 1
    def validate_fecha_vencimiento(self, value):
        # Validar que la fecha de vencimiento sea futura
        if value < timezone.now().date():
            raise serializers.ValidationError("La fecha de vencimiento no puede ser en el pasado.")
        return value


class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = '__all__'
        depth = 1

class ServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicios
        fields = '__all__'
        depth = 1