#!/usr/bin/env python3
"""
Script para preparar los inputs del procesamiento paralelo de nombres alternativos
"""

import json

# Leer el archivo JSON con las plantas
with open('/home/ubuntu/plantas_por_categoria.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Crear inputs para el procesamiento paralelo
# Dividiremos en grupos de ~50 plantas para mejor procesamiento
inputs = []

for categoria in data['categorias']:
    plantas_list = []
    for planta in categoria['plantas']:
        plantas_list.append(f"{planta['nombre']} ({planta['nombreCientifico']})")
    
    # Crear el input string
    input_str = f"CATEGORIA: {categoria['nombre']}\nPLANTAS:\n" + "\n".join(plantas_list)
    inputs.append({
        'categoria_id': categoria['id'],
        'categoria_nombre': categoria['nombre'],
        'plantas_count': len(categoria['plantas']),
        'input_string': input_str,
        'plantas': categoria['plantas']
    })

# Guardar los inputs
with open('/home/ubuntu/parallel_inputs.json', 'w', encoding='utf-8') as f:
    json.dump(inputs, f, ensure_ascii=False, indent=2)

print(f"Total de inputs preparados: {len(inputs)}")
for inp in inputs:
    print(f"  {inp['categoria_nombre']}: {inp['plantas_count']} plantas")
