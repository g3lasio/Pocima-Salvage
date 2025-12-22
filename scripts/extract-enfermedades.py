#!/usr/bin/env python3
"""
Script para extraer enfermedades por sistema para procesamiento paralelo
"""

import re
import json

# Leer el archivo de enfermedades
with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar todos los sistemas y sus enfermedades
sistemas = []
sistema_pattern = r'\{\s*id:\s*"([^"]+)",\s*nombre:\s*"([^"]+)",\s*icono:\s*"([^"]+)",\s*enfermedades:\s*\['
sistema_matches = list(re.finditer(sistema_pattern, content))

for i, match in enumerate(sistema_matches):
    sistema_id = match.group(1)
    sistema_nombre = match.group(2)
    
    # Encontrar el final de este sistema (inicio del siguiente o fin del array)
    start = match.end()
    if i + 1 < len(sistema_matches):
        end = sistema_matches[i + 1].start()
    else:
        end = len(content)
    
    sistema_content = content[start:end]
    
    # Extraer enfermedades de este sistema
    enfermedad_pattern = r'\{\s*id:\s*"([^"]+)",\s*nombre:\s*"([^"]+)"'
    enfermedades = re.findall(enfermedad_pattern, sistema_content)
    
    sistemas.append({
        'id': sistema_id,
        'nombre': sistema_nombre,
        'enfermedades': [{'id': e[0], 'nombre': e[1]} for e in enfermedades]
    })

print(f"Total de sistemas: {len(sistemas)}")
total_enfermedades = sum(len(s['enfermedades']) for s in sistemas)
print(f"Total de enfermedades: {total_enfermedades}")

# Preparar inputs para procesamiento paralelo (por sistema)
parallel_inputs = []
for sistema in sistemas:
    enfermedades_str = ", ".join([f"{e['nombre']} [id: {e['id']}]" for e in sistema['enfermedades']])
    parallel_inputs.append({
        'sistema_id': sistema['id'],
        'sistema_nombre': sistema['nombre'],
        'enfermedades': enfermedades_str,
        'ids': [e['id'] for e in sistema['enfermedades']],
        'count': len(sistema['enfermedades'])
    })

# Guardar para procesamiento
with open('/home/ubuntu/enfermedades_por_sistema.json', 'w', encoding='utf-8') as f:
    json.dump(parallel_inputs, f, ensure_ascii=False, indent=2)

print("\nEnfermedades por sistema:")
for sistema in parallel_inputs:
    print(f"  - {sistema['sistema_nombre']}: {sistema['count']} enfermedades")

print(f"\nArchivo generado: /home/ubuntu/enfermedades_por_sistema.json")
