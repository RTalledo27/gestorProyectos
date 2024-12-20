from rest_framework import serializers
from .models import (
    Usuarios, Roles, Permisos, RolesPermisos, Clientes, Servicios, Proyectos,
    UsuariosRol, ProyectoServicio, ProyectoCliente, AsignacionProyecto, Tarea,
    SubTareas, AsignacionTarea, AutenticacionExterna, TokenAutenticacion,
    Reporte, EventoCalendario, IntegracionGitHub, Cargos,AuditLog
)



class UsuarioConProyectosSerializer(serializers.ModelSerializer):
    proyectos = serializers.SerializerMethodField()
    cargo = serializers.SerializerMethodField()

    class Meta:
        model = Usuarios
        fields = ['id', 'username', 'email', 'nombres', 'apellidos', 'cargo', 'proyectos']

    def get_proyectos(self, obj):
        asignaciones = AsignacionProyecto.objects.filter(usuario=obj)
        return ProyectoSerializer(
            [asignacion.proyecto for asignacion in asignaciones], 
            many=True
        ).data
    def get_cargo(self, obj):
        return CargosSerializer(obj.cargo).data


class CargosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargos
        fields = '__all__'
        depth = 1

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id', 'username', 'email', 'nombres', 'apellidos', 'created_at', 'last_login', 'is_active', 'cargo']
        extra_kwargs = {'password': {'write_only': True}}
        depth = 1
    def get_proyectos_activos(self, obj):
        return AsignacionProyecto.objects.filter(
            usuario=obj,
            proyecto__estado__in=['En Progreso', 'Pendiente']
        ).count()
    def create(self, validated_data):
        user = Usuarios.objects.create_user(**validated_data)
        return user
class PermisosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permisos
        fields = ['id', 'nombre', 'descripcion']
        
class RolesSerializer(serializers.ModelSerializer):
    permisos = PermisosSerializer(many=True, read_only=True)

    class Meta:
        model = Roles
        fields = ['id', 'nombre', 'descripcion', 'permisos']

    def get_permisos(self, obj):
        return Permisos.objects.filter(rolespermisos__rol=obj)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['permisos'] = PermisosSerializer(
            instance.get_permisos(),
            many=True
        ).data
        return representation


class RolesPermisosSerializer(serializers.ModelSerializer):
    permiso_details = PermisosSerializer(source='permiso', read_only=True)
    
    class Meta:
        model = RolesPermisos
        fields = ['id', 'rol', 'permiso', 'permiso_details']

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
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
        depth = 2

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
        depth = 1

class TareasSerializer(serializers.ModelSerializer):
    class Meta:
        proyecto = ProyectoSerializer(read_only=True)
    proyecto_id = serializers.PrimaryKeyRelatedField(
        queryset=Proyectos.objects.all(),
        source='proyecto',
        write_only=True
    )

    class Meta:
        model = Tarea
        fields = ['id', 'titulo', 'descripcion', 'estado', 'prioridad', 'fecha_vencimiento', 'proyecto', 'proyecto_id']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['proyecto'] = ProyectoSerializer(instance.proyecto).data
        return representation

    class Meta:
        model = Tarea
        fields = ['id', 'titulo', 'descripcion', 'estado', 'prioridad', 'fecha_vencimiento', 'proyecto', 'proyecto_id']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['proyecto'] = ProyectoSerializer(instance.proyecto).data
        return representation


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

class SubTareasSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTareas
        fields = ['id', 'titulo', 'estado', 'tarea']
        extra_kwargs = {'tarea': {'required': True}}