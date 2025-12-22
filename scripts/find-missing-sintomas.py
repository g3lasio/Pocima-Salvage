#!/usr/bin/env python3
"""
Script para encontrar enfermedades que no tienen síntomas o causas.
"""

import re
import json

def main():
    with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extraer todos los bloques de enfermedades
    # Patrón: { id: "...", nombre: "...", ... }
    blocks = re.findall(r'\{\s*id:\s*"[^"]+",\s*nombre:\s*"[^"]+",\s*otrosNombres:[^}]+\}', content, re.DOTALL)
    
    print(f"Total de bloques encontrados: {len(blocks)}")
    
    # Analizar cada bloque
    sin_sintomas = []
    sin_causas = []
    
    for block in blocks:
        nombre_match = re.search(r'nombre:\s*"([^"]+)"', block)
        if nombre_match:
            nombre = nombre_match.group(1)
            
            # Verificar si tiene sintomas
            if 'sintomas:' not in block:
                sin_sintomas.append(nombre)
            
            # Verificar si tiene causas
            if 'causas:' not in block:
                sin_causas.append(nombre)
    
    print(f"\nEnfermedades sin síntomas: {len(sin_sintomas)}")
    print(f"Enfermedades sin causas: {len(sin_causas)}")
    
    if sin_sintomas:
        print("\nPrimeras 20 sin síntomas:")
        for e in sin_sintomas[:20]:
            print(f"  - {e}")
    
    # Guardar lista
    with open('/home/ubuntu/enfermedades_sin_sintomas.json', 'w', encoding='utf-8') as f:
        json.dump({'sin_sintomas': sin_sintomas, 'sin_causas': sin_causas}, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
