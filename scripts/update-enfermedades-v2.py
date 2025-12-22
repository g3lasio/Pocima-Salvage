#!/usr/bin/env python3
"""
Script para actualizar el archivo de enfermedades con síntomas y causas faltantes.
"""

import json
import re

def main():
    # Leer los datos generados
    with open('/home/ubuntu/generate_symptoms_causes.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Crear diccionario de síntomas y causas por enfermedad
    sintomas_causas = {}
    for result in data['results']:
        if result['error']:
            continue
        nombre = result['output']['enfermedad']
        sintomas = [s.strip() for s in result['output']['sintomas'].split(';') if s.strip()]
        causas = [c.strip() for c in result['output']['causas'].split(';') if c.strip()]
        sintomas_causas[nombre] = {
            'sintomas': sintomas,
            'causas': causas
        }
    
    print(f"Datos cargados para {len(sintomas_causas)} enfermedades")
    
    # Leer el archivo de enfermedades
    with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Para cada enfermedad, buscar y agregar síntomas y causas
    updated_count = 0
    
    for nombre, datos in sintomas_causas.items():
        # Escapar caracteres especiales en el nombre
        nombre_escaped = re.escape(nombre)
        
        # Buscar el patrón: descripcion: "...", sistemaId: (sin sintomas entre medio)
        # Esto indica que la enfermedad no tiene síntomas
        pattern = rf'(nombre:\s*"{nombre_escaped}",\s*otrosNombres:\s*\[[^\]]*\],\s*descripcion:\s*"[^"]*",)\s*(sistemaId:)'
        
        match = re.search(pattern, content)
        if match:
            # Crear strings de síntomas y causas
            sintomas_str = json.dumps(datos['sintomas'], ensure_ascii=False)
            causas_str = json.dumps(datos['causas'], ensure_ascii=False)
            
            # Reemplazar agregando síntomas y causas
            replacement = f'{match.group(1)}\n        sintomas: {sintomas_str},\n        causas: {causas_str},\n        {match.group(2)}'
            
            content = re.sub(pattern, replacement, content, count=1)
            updated_count += 1
            print(f"  ✓ Actualizado: {nombre}")
    
    # Guardar el archivo actualizado
    with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ Total actualizado: {updated_count} enfermedades")

if __name__ == "__main__":
    main()
