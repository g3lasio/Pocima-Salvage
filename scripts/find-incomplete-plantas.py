#!/usr/bin/env python3
"""
Script para identificar plantas que necesitan contraindicaciones y nombres alternativos.
"""

import re
import json

def find_incomplete_plantas():
    with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Buscar plantas con contraindicaciones vacías
    # Patrón: nombre seguido de contraindicaciones: []
    
    plantas_sin_contraindicaciones = []
    plantas_sin_nombres_alt = []
    
    # Dividir por bloques de planta
    # Buscar patrones de plantas individuales
    
    # Extraer todos los nombres de plantas
    all_plantas = re.findall(r"nombre:\s*['\"]([^'\"]+)['\"]", content)
    
    # Buscar plantas con contraindicaciones vacías
    # El patrón busca nombre seguido de contraindicaciones: []
    pattern_empty_contra = r"nombre:\s*['\"]([^'\"]+)['\"][^}]*contraindicaciones:\s*\[\s*\]"
    plantas_con_contra_vacia = re.findall(pattern_empty_contra, content, re.DOTALL)
    
    # Buscar plantas sin nombresAlternativos
    pattern_with_nombres = r"nombre:\s*['\"]([^'\"]+)['\"][^}]*nombresAlternativos:\s*{"
    plantas_con_nombres = set(re.findall(pattern_with_nombres, content, re.DOTALL))
    
    plantas_sin_nombres = [p for p in all_plantas if p not in plantas_con_nombres]
    
    print(f"Total plantas: {len(all_plantas)}")
    print(f"Plantas con contraindicaciones vacías: {len(plantas_con_contra_vacia)}")
    print(f"Plantas sin nombres alternativos: {len(plantas_sin_nombres)}")
    
    # Guardar en JSON
    output = {
        "plantas_sin_contraindicaciones": plantas_con_contra_vacia[:50],  # Primeras 50
        "plantas_sin_nombres_alternativos": plantas_sin_nombres[:50]  # Primeras 50
    }
    
    with open('/home/ubuntu/plantas_incompletas.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\nLista guardada en /home/ubuntu/plantas_incompletas.json")
    
    # Mostrar primeras 15 de cada
    print("\nPrimeras 15 plantas con contraindicaciones vacías:")
    for i, p in enumerate(plantas_con_contra_vacia[:15], 1):
        print(f"  {i}. {p}")
    
    print("\nPrimeras 15 plantas sin nombres alternativos:")
    for i, p in enumerate(plantas_sin_nombres[:15], 1):
        print(f"  {i}. {p}")

if __name__ == "__main__":
    find_incomplete_plantas()
