#!/usr/bin/env python3
"""
Script para extraer plantas por categoría del archivo TypeScript
"""

import re
import json

# Leer el archivo TypeScript
with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extraer categorías y plantas usando regex
categorias = []
current_categoria = None
current_plantas = []

# Buscar cada categoría
categoria_pattern = r'id: "([^"]+)",\s*nombre: "([^"]+)",\s*plantas: \['
planta_pattern = r'id: "([^"]+)",\s*nombre: "([^"]+)",\s*nombreCientifico: "([^"]+)"'

lines = content.split('\n')
in_categoria = False
categoria_id = None
categoria_nombre = None

for i, line in enumerate(lines):
    # Detectar inicio de categoría
    if 'id: "' in line and 'nombre: "' in lines[i+1] if i+1 < len(lines) else False:
        match = re.search(r'id: "([^"]+)"', line)
        if match and 'plantas' not in line:
            next_line = lines[i+1] if i+1 < len(lines) else ""
            nombre_match = re.search(r'nombre: "([^"]+)"', next_line)
            if nombre_match and 'plantas:' in lines[i+2] if i+2 < len(lines) else False:
                if current_categoria:
                    categorias.append({
                        'id': current_categoria['id'],
                        'nombre': current_categoria['nombre'],
                        'plantas': current_plantas
                    })
                current_categoria = {
                    'id': match.group(1),
                    'nombre': nombre_match.group(1)
                }
                current_plantas = []
    
    # Detectar plantas
    if 'id: "' in line and 'nombre: "' in lines[i+1] if i+1 < len(lines) else False:
        id_match = re.search(r'id: "([^"]+)"', line)
        if id_match and current_categoria:
            next_line = lines[i+1] if i+1 < len(lines) else ""
            nombre_match = re.search(r'nombre: "([^"]+)"', next_line)
            next_next = lines[i+2] if i+2 < len(lines) else ""
            cientifico_match = re.search(r'nombreCientifico: "([^"]+)"', next_next)
            
            if nombre_match and cientifico_match:
                planta_id = id_match.group(1)
                # Evitar duplicados y IDs de categoría
                if planta_id != current_categoria['id'] and not any(p['id'] == planta_id for p in current_plantas):
                    current_plantas.append({
                        'id': planta_id,
                        'nombre': nombre_match.group(1),
                        'nombreCientifico': cientifico_match.group(1)
                    })

# Agregar última categoría
if current_categoria:
    categorias.append({
        'id': current_categoria['id'],
        'nombre': current_categoria['nombre'],
        'plantas': current_plantas
    })

# Guardar resultado
output = {'categorias': categorias}
with open('/home/ubuntu/plantas_por_categoria.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

# Mostrar resumen
print(f"Total categorías: {len(categorias)}")
for cat in categorias:
    print(f"  {cat['nombre']}: {len(cat['plantas'])} plantas")
print(f"\nTotal plantas: {sum(len(c['plantas']) for c in categorias)}")
