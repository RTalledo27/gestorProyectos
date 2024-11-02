# Generated by Django 5.1.2 on 2024-11-02 02:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_proyectos_progreso_subtareas'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proyectos',
            name='estado',
            field=models.CharField(choices=[('En Progreso', 'En Progreso'), ('Completado', 'Completado'), ('Pendiente', 'Pendiente'), ('Cancelado', 'Cancelado')], default='En Progreso', max_length=20),
        ),
    ]