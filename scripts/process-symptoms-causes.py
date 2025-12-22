#!/usr/bin/env python3
"""
Script para procesar los síntomas y causas generados y actualizar el archivo de enfermedades
"""

import json
import re

# Leer los resultados del procesamiento paralelo
with open('/home/ubuntu/generate_symptoms_causes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Diccionario para almacenar síntomas y causas por ID de enfermedad
symptoms_causes = {}

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
            sistema_data = json.loads(json_str)
            if 'enfermedades' in sistema_data:
                for enfermedad in sistema_data['enfermedades']:
                    enf_id = enfermedad.get('id', '').lower().strip()
                    if enf_id:
                        symptoms_causes[enf_id] = {
                            'sintomas': enfermedad.get('sintomas', []),
                            'causas': enfermedad.get('causas', [])
                        }
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            continue

print(f"Enfermedades con síntomas y causas procesadas: {len(symptoms_causes)}")

# Guardar el diccionario para referencia
with open('/home/ubuntu/sintomas_causas.json', 'w', encoding='utf-8') as f:
    json.dump(symptoms_causes, f, ensure_ascii=False, indent=2)

# Leer el archivo actual de enfermedades
with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Procesar el archivo línea por línea y agregar síntomas y causas
lines = content.split('\n')
new_lines = []
current_enf_id = None
enfermedades_updated = 0

i = 0
while i < len(lines):
    line = lines[i]
    
    # Detectar inicio de una enfermedad (id: "...")
    id_match = re.search(r'^\s+id: "([^"]+)"', line)
    if id_match:
        current_enf_id = id_match.group(1)
    
    # Detectar sistemaId y agregar síntomas y causas antes
    sistema_match = re.search(r'^(\s+)sistemaId: "([^"]+)"', line)
    if sistema_match and current_enf_id:
        indent = sistema_match.group(1)
        
        # Buscar síntomas y causas para esta enfermedad
        enf_data = symptoms_causes.get(current_enf_id)
        
        if enf_data:
            # Agregar síntomas
            if enf_data['sintomas']:
                sintomas_str = json.dumps(enf_data['sintomas'], ensure_ascii=False)
                new_lines.append(f'{indent}sintomas: {sintomas_str},')
            
            # Agregar causas
            if enf_data['causas']:
                causas_str = json.dumps(enf_data['causas'], ensure_ascii=False)
                new_lines.append(f'{indent}causas: {causas_str},')
            
            enfermedades_updated += 1
        
        current_enf_id = None
    
    new_lines.append(line)
    i += 1

# Escribir el nuevo archivo
new_content = '\n'.join(new_lines)

with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"\nResultados:")
print(f"  - Enfermedades actualizadas con síntomas y causas: {enfermedades_updated}")
print(f"\nArchivo actualizado: /home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts")
