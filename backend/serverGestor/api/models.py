from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

# Create your models here.

## MODELO DE USUARIOS: SERIALIZER HECHO
class Usuarios(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    nombres = models.CharField(max_length=30, blank=True)
    apellidos = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # Hashear la contraseña antes de guardar si es nueva o fue modificada
        if not self.pk or self.has_changed('password'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    def has_changed(self, field):
        if not self.pk:
            return True
        old_value = type(self).objects.get(pk=self.pk).__dict__[field]
        return getattr(self, field) != old_value

## MODELO DE Roles: SERIALIZER HECHO

class Roles(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=100)
    
    def __str__(self):
        return self.name
    
## MODELO DE PERMISOS: SERIALIZER HECHO

class Permisos(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion= models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
## MODELO DE ROLES PERMISOS: SERIALIZER HECHO

class RolesPermisos(models.Model):
    rol = models.ForeignKey(Roles, on_delete=models.CASCADE)
    permiso = models.ForeignKey(Permisos, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('rol', 'permiso')


## MODELO DE Clientes: SERIALIZER HECHO
class Clientes(models.Model):
    OPCIONES_GENERO = [
        ('Masculino', 'Masculino'),
        ('Femenino', 'Femenino'),
        ('Otro', 'Otro'),
    ]
    OPCIONES_ESTADO = [
        ('Activo', 'Activo'),
        ('Inactivo', 'Inactivo'),
    ]
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    genero = models.CharField(max_length=10, choices=OPCIONES_GENERO)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    direccion = models.TextField(blank=True)
    correo = models.EmailField(unique=True)
    foto = models.ImageField(upload_to='fotos_clientes/', blank=True)
    estado = models.CharField(max_length=10, choices=OPCIONES_ESTADO, default='Activo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"       


## MODELO DE SERVICIOS: SERIALIZER HECHO
class Servicios(models.Model):
    OPCIONES_ESTADO = [
        ('Activo', 'Activo'),
        ('Inactivo', 'Inactivo'),
    ]
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=10, choices=OPCIONES_ESTADO, default='Activo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre
    

## MODELO DE proyectos: SERIALIZER HECHO
class Proyectos(models.Model):
    OPCIONES_ESTADO = [
        ('En Progreso', 'En Progreso'),
        ('Completado', 'Completado'),
        ('En Pausa', 'En Pausa'),
        ('Cancelado', 'Cancelado'),
    ]
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    estado = models.CharField(max_length=20, choices=OPCIONES_ESTADO, default='En Progreso')
    progreso = models.IntegerField(default=0)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    servicios = models.ManyToManyField(Servicios, through='ProyectoServicio')
    clientes = models.ManyToManyField(Clientes, through='ProyectoCliente')

    def __str__(self):
        return self.nombre
    
class UsuariosRol(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    rol = models.ForeignKey(Roles, on_delete=models.CASCADE)
    proyecto = models.ForeignKey(Proyectos, on_delete=models.CASCADE)  # Vínculo al proyecto

    class Meta:
        unique_together = ('usuario', 'rol')

class ProyectoServicio(models.Model):
    proyecto = models.ForeignKey(Proyectos, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicios, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('proyecto', 'servicio')

class ProyectoCliente(models.Model):
    proyecto = models.ForeignKey(Proyectos, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Clientes, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('proyecto', 'cliente')

class AsignacionProyecto(models.Model):
    proyecto = models.ForeignKey(Proyectos, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    rol = models.CharField(max_length=50)
    asignado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('proyecto', 'usuario')

class Tarea(models.Model):
    OPCIONES_ESTADO = [
        ('Pendiente', 'Pendiente'),
        ('En Proceso', 'En Proceso'),
        ('Completada', 'Completada'),
        ('Retrasada', 'Retrasada'),
    ]
    OPCIONES_PRIORIDAD = [
        ('Alta', 'Alta'),
        ('Media', 'Media'),
        ('Baja', 'Baja'),
    ]
    proyecto = models.ForeignKey(Proyectos, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=OPCIONES_ESTADO, default='Pendiente')
    prioridad = models.CharField(max_length=10, choices=OPCIONES_PRIORIDAD, default='Media')
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    fecha_vencimiento = models.DateField()
    completado_en = models.DateTimeField(null=True, blank=True)
    usuarios_asignados = models.ManyToManyField(Usuarios, through='AsignacionTarea')

    def __str__(self):
        return self.titulo
    
##Cuando una una subtarea sea marcada como completada\n
# se ira calculando el total del porcecntaje de avance del proyecto
# y se actualizara el estado del proyecto esto calculando
# el porcentaje de avance del proyecto

class SubTareas(models.Model):
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=100)
    estado = models.BooleanField(default=False)


class AsignacionTarea(models.Model):
    tarea = models.ForeignKey(Tarea, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    asignado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tarea', 'usuario')

class AutenticacionExterna(models.Model):
    OPCIONES_PROVEEDOR = [
        ('Google', 'Google'),
        ('GitHub', 'GitHub'),
    ]
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    proveedor = models.CharField(max_length=10, choices=OPCIONES_PROVEEDOR)
    id_usuario_externo = models.CharField(max_length=255)

    class Meta:
        unique_together = ('usuario', 'proveedor')

class TokenAutenticacion(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    expira_en = models.DateTimeField()
    creado_en = models.DateTimeField(auto_now_add=True)
    
class CustomTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')

        if not token:
            return None  # No token provided

        try:
            # Remove 'Token ' prefix if it exists
            if token.startswith('Token '):
                token = token[6:]

            token_obj = TokenAutenticacion.objects.get(token=token)

            # Check if the token is expired
            if token_obj.expira_en < timezone.now():
                token_obj.delete()  # Optionally delete expired tokens
                raise AuthenticationFailed('Token has expired')

            # Token is valid, return the user and token
            return (token_obj.usuario, token_obj) 

        except TokenAutenticacion.DoesNotExist:
            raise AuthenticationFailed('Invalid token')


class Reporte(models.Model):
    OPCIONES_FORMATO = [
        ('PDF', 'PDF'),
        ('Excel', 'Excel'),
        ('CSV', 'CSV'),
    ]
    proyecto = models.ForeignKey(Proyectos, on_delete=models.SET_NULL, null=True)
    creado_por = models.ForeignKey(Usuarios, on_delete=models.SET_NULL, null=True)
    tipo_reporte = models.CharField(max_length=50)
    contenido = models.TextField()
    formato_reporte = models.CharField(max_length=5, choices=OPCIONES_FORMATO, default='PDF')
    ruta_archivo = models.CharField(max_length=255)
    creado_en = models.DateTimeField(auto_now_add=True)

class EventoCalendario(models.Model):
    proyecto = models.ForeignKey(Proyectos, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    fecha_hora_inicio = models.DateTimeField()
    fecha_hora_fin = models.DateTimeField()
    creado_por = models.ForeignKey(Usuarios, on_delete=models.SET_NULL, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

class IntegracionGitHub(models.Model):
    proyecto = models.OneToOneField(Proyectos, on_delete=models.CASCADE, primary_key=True)
    url_repositorio = models.URLField()
    ultima_sincronizacion = models.DateTimeField(null=True, blank=True)


