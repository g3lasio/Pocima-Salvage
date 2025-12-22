#!/usr/bin/env python3
"""
Script para actualizar el archivo de plantas con nombres alternativos
"""

import json
import re

# Leer los nombres alternativos procesados
with open('/home/ubuntu/nombres_alternativos_procesados.json', 'r', encoding='utf-8') as f:
    nombres_alternativos = json.load(f)

print(f"Nombres alternativos cargados: {len(nombres_alternativos)}")

# Leer el archivo actual de plantas
with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Función para generar ID slug desde nombre
def to_slug(nombre):
    slug = nombre.lower()
    slug = slug.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
    slug = slug.replace('ñ', 'n').replace('ü', 'u')
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

# Función para encontrar nombres alternativos para una planta
def find_alternative_names(planta_id, planta_nombre):
    # Intentar con el ID exacto
    if planta_id in nombres_alternativos:
        return nombres_alternativos[planta_id]
    
    # Intentar con el slug del nombre
    slug = to_slug(planta_nombre)
    if slug in nombres_alternativos:
        return nombres_alternativos[slug]
    
    # Intentar con variaciones
    variations = [
        planta_id.replace('-', ''),
        slug.replace('-', ''),
        planta_nombre.lower(),
    ]
    
    for var in variations:
        if var in nombres_alternativos:
            return nombres_alternativos[var]
    
    return None

# Procesar el archivo línea por línea y agregar nombres alternativos
lines = content.split('\n')
new_lines = []
current_planta_id = None
current_planta_nombre = None
insert_after_next_brace = False
plantas_updated = 0

i = 0
while i < len(lines):
    line = lines[i]
    new_lines.append(line)
    
    # Detectar inicio de una planta (id: "...")
    id_match = re.search(r'^\s+id: "([^"]+)"', line)
    if id_match:
        current_planta_id = id_match.group(1)
    
    # Detectar nombre de la planta
    nombre_match = re.search(r'^\s+nombre: "([^"]+)"', line)
    if nombre_match and current_planta_id:
        current_planta_nombre = nombre_match.group(1)
    
    # Detectar nombreCientifico y agregar nombresAlternativos después
    cientifico_match = re.search(r'^\s+nombreCientifico: "([^"]+)"', line)
    if cientifico_match and current_planta_id and current_planta_nombre:
        # Buscar nombres alternativos
        alt_names = find_alternative_names(current_planta_id, current_planta_nombre)
        
        if alt_names:
            # Obtener la indentación actual
            indent = len(line) - len(line.lstrip())
            indent_str = ' ' * indent
            
            # Formatear los nombres alternativos
            alt_names_str = json.dumps(alt_names, ensure_ascii=False)
            new_lines.append(f'{indent_str}nombresAlternativos: {alt_names_str},')
            plantas_updated += 1
        
        current_planta_id = None
        current_planta_nombre = None
    
    i += 1

# Escribir el nuevo archivo
new_content = '\n'.join(new_lines)

# Actualizar la interfaz PlantaExpandida para incluir nombresAlternativos
interface_update = '''export interface PlantaExpandida {
  id: string;
  nombre: string;
  nombreCientifico: string;
  nombresAlternativos?: Record<string, string[]>;
  propiedades: string[];
  parteUsable: string;
  dosis: string;
  preparacion: string;
  contraindicaciones: string[];
  fuente: string;
  descripcion: string;
  sistemasRelacionados: string[];
  categoriaId: string;
  categoria: string;
}'''

# Reemplazar la interfaz existente
old_interface = re.search(r'export interface PlantaExpandida \{[^}]+\}', new_content)
if old_interface:
    new_content = new_content.replace(old_interface.group(0), interface_update)

with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Plantas actualizadas con nombres alternativos: {plantas_updated}")
print("Archivo actualizado: /home/ubuntu/pocima-salvage/data/plantas-expandidas.ts")
