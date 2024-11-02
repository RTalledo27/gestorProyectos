from rest_framework import serializers
from .models import (
    Usuarios, Roles, Permisos, RolesPermisos, Clientes, Servicios, Proyectos,
    UsuariosRol, ProyectoServicio, ProyectoCliente, AsignacionProyecto, Tarea,
    SubTareas, AsignacionTarea, AutenticacionExterna, TokenAutenticacion,
    Reporte, EventoCalendario, IntegracionGitHub,
)

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id', 'username', 'email', 'nombres', 'apellidos', 'created_at', 'last_login', 'is_active']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Usuarios.objects.create_user(**validated_data)
        return user

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

class PermisosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permisos
        fields = '__all__'

class RolesPermisosSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolesPermisos
        fields = '__all__'

class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = '__all__'

class ServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicios
        fields = '__all__'

class ProyectoSerializer(serializers.ModelSerializer):
    clientes = ClientesSerializer(many=True, read_only=True)
    servicios = ServiciosSerializer(many=True, read_only=True)

    class Meta:
        model = Proyectos
        fields = ['id', 'nombre', 'descripcion', 'fecha_inicio', 'fecha_fin', 'estado', 'progreso', 'creado_en', 'actualizado_en', 'clientes', 'servicios']

    def create(self, validated_data):
        clientes_data = self.context['request'].data.get('clientes', [])
        servicios_data = self.context['request'].data.get('servicios', [])
        proyecto = Proyectos.objects.create(**validated_data)
        for cliente_id in clientes_data:
            ProyectoCliente.objects.create(proyecto=proyecto, cliente_id=cliente_id)
        for servicio_id in servicios_data:
            ProyectoServicio.objects.create(proyecto=proyecto, servicio_id=servicio_id)
        return proyecto
    

class UsuariosRolSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuariosRol
        fields = '__all__'

class ProyectoServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProyectoServicio
        fields = '__all__'

class ProyectoClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProyectoCliente
        fields = '__all__'

class AsignacionProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignacionProyecto
        fields = '__all__'

class TareasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = '__all__'

class SubTareasSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTareas
        fields = '__all__'

class AsignacionTareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsignacionTarea
        fields = '__all__'

class AutenticacionExternaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutenticacionExterna
        fields = '__all__'

class TokenAutenticacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TokenAutenticacion
        fields = '__all__'

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'

class EventoCalendarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoCalendario
        fields = '__all__'

class IntegracionGitHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntegracionGitHub
        fields = '__all__'