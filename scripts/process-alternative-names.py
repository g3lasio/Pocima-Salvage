#!/usr/bin/env python3
"""
Script para procesar los nombres alternativos generados y actualizar el archivo de plantas
"""

import json
import re

# Leer los resultados del procesamiento paralelo
with open('/home/ubuntu/generate_alternative_names.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Diccionario para almacenar todos los nombres alternativos por ID de planta
all_alternative_names = {}

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
            categoria_data = json.loads(json_str)
            if 'plantas' in categoria_data:
                for planta in categoria_data['plantas']:
                    planta_id = planta.get('id', '').lower().strip()
                    if planta_id and 'nombresAlternativos' in planta:
                        all_alternative_names[planta_id] = planta['nombresAlternativos']
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            # Intentar extraer datos con regex como fallback
            try:
                # Buscar patrones de plantas
                planta_pattern = r'"id":\s*"([^"]+)"[^}]*"nombresAlternativos":\s*(\{[^}]+\})'
                matches = re.findall(planta_pattern, json_str, re.DOTALL)
                for match in matches:
                    planta_id = match[0].lower().strip()
                    try:
                        nombres = json.loads(match[1])
                        all_alternative_names[planta_id] = nombres
                    except:
                        pass
            except:
                pass

print(f"Total de plantas con nombres alternativos procesados: {len(all_alternative_names)}")

# Guardar los nombres alternativos procesados
with open('/home/ubuntu/nombres_alternativos_procesados.json', 'w', encoding='utf-8') as f:
    json.dump(all_alternative_names, f, ensure_ascii=False, indent=2)

# Leer el archivo actual de plantas expandidas
with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'r', encoding='utf-8') as f:
    plantas_content = f.read()

# Verificar la estructura actual
print("\nVerificando estructura del archivo de plantas...")

# Contar plantas en el archivo
plantas_count = plantas_content.count('id: "')
print(f"Plantas encontradas en el archivo: {plantas_count}")

# Mostrar algunos ejemplos de nombres alternativos
print("\nEjemplos de nombres alternativos procesados:")
for i, (planta_id, nombres) in enumerate(list(all_alternative_names.items())[:5]):
    print(f"  {planta_id}: {nombres}")

print("\nProcesamiento completado. Nombres guardados en /home/ubuntu/nombres_alternativos_procesados.json")
