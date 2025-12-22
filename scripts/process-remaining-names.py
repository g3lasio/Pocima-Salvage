#!/usr/bin/env python3
"""
Script para procesar los nombres alternativos restantes y actualizar el archivo de plantas
"""

import json
import re

# Leer los resultados del procesamiento paralelo
with open('/home/ubuntu/generate_remaining_alternative_names.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Diccionario para almacenar todos los nombres alternativos por ID de planta
new_alternative_names = {}

# Procesar cada resultado
for result in data['results']:
    if 'output' in result and 'json_data' in result['output']:
        json_str = result['output']['json_data']
        
        # Limpiar el JSON string (remover markdown si existe)
        json_str = json_str.strip()
        if json_str.startswith('```json'):
            json_str = json_str[7:]
        if json_str.startswith('```'):
            json_str = json_str[3:]
        if json_str.endswith('```'):
            json_str = json_str[:-3]
        json_str = json_str.strip()
        
        try:
            grupo_data = json.loads(json_str)
            if 'plantas' in grupo_data:
                for planta in grupo_data['plantas']:
                    planta_id = planta.get('id', '').lower().strip()
                    if planta_id and 'nombresAlternativos' in planta:
                        # Solo agregar si tiene nombres
                        if planta['nombresAlternativos']:
                            new_alternative_names[planta_id] = planta['nombresAlternativos']
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            continue

print(f"Nuevos nombres alternativos procesados: {len(new_alternative_names)}")

# Leer los nombres alternativos existentes
try:
    with open('/home/ubuntu/nombres_alternativos_procesados.json', 'r', encoding='utf-8') as f:
        existing_names = json.load(f)
except:
    existing_names = {}

print(f"Nombres alternativos existentes: {len(existing_names)}")

# Combinar ambos diccionarios
all_names = {**existing_names, **new_alternative_names}
print(f"Total de nombres alternativos combinados: {len(all_names)}")

# Guardar el diccionario combinado
with open('/home/ubuntu/nombres_alternativos_completos.json', 'w', encoding='utf-8') as f:
    json.dump(all_names, f, ensure_ascii=False, indent=2)

# Leer el archivo actual de plantas
with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Procesar el archivo línea por línea y agregar/actualizar nombres alternativos
lines = content.split('\n')
new_lines = []
current_planta_id = None
current_planta_nombre = None
plantas_updated = 0
plantas_already_have = 0

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
    if planta_id in all_names:
        return all_names[planta_id]
    
    # Intentar con el slug del nombre
    slug = to_slug(planta_nombre)
    if slug in all_names:
        return all_names[slug]
    
    # Intentar con variaciones
    variations = [
        planta_id.replace('-', ''),
        slug.replace('-', ''),
        planta_nombre.lower(),
    ]
    
    for var in variations:
        if var in all_names:
            return all_names[var]
    
    return None

i = 0
while i < len(lines):
    line = lines[i]
    
    # Detectar inicio de una planta (id: "...")
    id_match = re.search(r'^\s+id: "([^"]+)"', line)
    if id_match:
        current_planta_id = id_match.group(1)
    
    # Detectar nombre de la planta
    nombre_match = re.search(r'^\s+nombre: "([^"]+)"', line)
    if nombre_match and current_planta_id:
        current_planta_nombre = nombre_match.group(1)
    
    # Detectar si ya tiene nombresAlternativos
    if 'nombresAlternativos:' in line:
        plantas_already_have += 1
        new_lines.append(line)
        current_planta_id = None
        current_planta_nombre = None
        i += 1
        continue
    
    # Detectar nombreCientifico y agregar nombresAlternativos después si no existe
    cientifico_match = re.search(r'^\s+nombreCientifico: "([^"]+)"', line)
    if cientifico_match and current_planta_id and current_planta_nombre:
        new_lines.append(line)
        
        # Verificar si la siguiente línea ya tiene nombresAlternativos
        next_line = lines[i + 1] if i + 1 < len(lines) else ""
        if 'nombresAlternativos:' not in next_line:
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
        continue
    
    new_lines.append(line)
    i += 1

# Escribir el nuevo archivo
new_content = '\n'.join(new_lines)

with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"\nResultados:")
print(f"  - Plantas que ya tenían nombres: {plantas_already_have}")
print(f"  - Plantas actualizadas con nuevos nombres: {plantas_updated}")
print(f"  - Total: {plantas_already_have + plantas_updated}")
print(f"\nArchivo actualizado: /home/ubuntu/pocima-salvage/data/plantas-expandidas.ts")
