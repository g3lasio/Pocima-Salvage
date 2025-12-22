#!/usr/bin/env python3
"""
Script para identificar plantas que no tienen nombres alternativos
"""

import re
import json

# Leer el archivo de plantas
with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar todas las plantas
plantas_pattern = r'\{\s*id:\s*"([^"]+)",\s*nombre:\s*"([^"]+)",\s*nombreCientifico:\s*"([^"]+)"'
plantas = re.findall(plantas_pattern, content)

print(f"Total de plantas encontradas: {len(plantas)}")

# Encontrar plantas con nombres alternativos
plantas_con_nombres = set()
nombres_pattern = r'id:\s*"([^"]+)"[^}]*nombresAlternativos:'
matches = re.findall(nombres_pattern, content)
plantas_con_nombres = set(matches)

print(f"Plantas con nombres alternativos: {len(plantas_con_nombres)}")

# Identificar plantas sin nombres alternativos
plantas_sin_nombres = []
for planta_id, nombre, nombre_cientifico in plantas:
    if planta_id not in plantas_con_nombres:
        plantas_sin_nombres.append({
            'id': planta_id,
            'nombre': nombre,
            'nombreCientifico': nombre_cientifico
        })

print(f"Plantas sin nombres alternativos: {len(plantas_sin_nombres)}")

# Agrupar por categoría para procesamiento paralelo
# Dividir en grupos de ~50 plantas para procesamiento eficiente
grupos = []
grupo_actual = []
for planta in plantas_sin_nombres:
    grupo_actual.append(planta)
    if len(grupo_actual) >= 50:
        grupos.append(grupo_actual)
        grupo_actual = []

if grupo_actual:
    grupos.append(grupo_actual)

print(f"Grupos para procesamiento: {len(grupos)}")

# Guardar las plantas sin nombres para procesamiento
with open('/home/ubuntu/plantas_sin_nombres.json', 'w', encoding='utf-8') as f:
    json.dump({
        'total': len(plantas_sin_nombres),
        'grupos': len(grupos),
        'plantas': plantas_sin_nombres
    }, f, ensure_ascii=False, indent=2)

# Preparar inputs para procesamiento paralelo
parallel_inputs = []
for i, grupo in enumerate(grupos):
    plantas_str = ", ".join([f"{p['nombre']} ({p['nombreCientifico']})" for p in grupo])
    parallel_inputs.append({
        'grupo': i + 1,
        'plantas': plantas_str,
        'ids': [p['id'] for p in grupo]
    })

with open('/home/ubuntu/parallel_inputs_restantes.json', 'w', encoding='utf-8') as f:
    json.dump(parallel_inputs, f, ensure_ascii=False, indent=2)

print("\nPrimeras 10 plantas sin nombres alternativos:")
for p in plantas_sin_nombres[:10]:
    print(f"  - {p['nombre']} ({p['nombreCientifico']})")

print(f"\nArchivos generados:")
print(f"  - /home/ubuntu/plantas_sin_nombres.json")
print(f"  - /home/ubuntu/parallel_inputs_restantes.json")
