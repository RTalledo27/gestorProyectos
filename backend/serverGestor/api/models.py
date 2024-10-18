from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# Create your models here.

class Usuarios(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    nombres = models.CharField(max_length=30, blank=True)
    apellidos = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
class Roles(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=100)
    
    def __str__(self):
        return self.name
    
class Permisos(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion= models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
class RolesPermisos(models.Model):
    rol = models.ForeignKey(Roles, on_delete=models.CASCADE)
    permiso = models.ForeignKey(Permisos, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('rol', 'permiso')

class UsuariosRol(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    rol = models.ForeignKey(Roles, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('usuario', 'rol')

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
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    servicios = models.ManyToManyField(Servicios, through='ProyectoServicio')
    clientes = models.ManyToManyField(Clientes, through='ProyectoCliente')

    def __str__(self):
        return self.nombre

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


