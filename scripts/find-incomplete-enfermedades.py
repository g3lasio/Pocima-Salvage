#!/usr/bin/env python3
"""
Script para identificar enfermedades que necesitan síntomas y causas.
"""

import re
import json

def find_incomplete_enfermedades():
    with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Dividir por bloques de enfermedad
    # Buscar patrones de enfermedades individuales
    enfermedades_sin_datos = []
    
    # Buscar todas las enfermedades que NO tienen sintomas o causas
    # Patrón: objeto con id y nombre pero sin sintomas/causas
    
    # Primero, extraer todos los nombres de enfermedades
    all_enfermedades = re.findall(r"nombre:\s*['\"]([^'\"]+)['\"]", content)
    
    # Luego, buscar cuáles tienen sintomas
    enfermedades_con_sintomas = set()
    
    # Buscar bloques que tienen sintomas
    blocks_with_sintomas = re.findall(r"nombre:\s*['\"]([^'\"]+)['\"][^}]*sintomas:\s*\[[^\]]+\]", content, re.DOTALL)
    
    for nombre in blocks_with_sintomas:
        enfermedades_con_sintomas.add(nombre)
    
    # Identificar las que no tienen
    sin_sintomas = [e for e in all_enfermedades if e not in enfermedades_con_sintomas]
    
    # Filtrar los que son nombres de sistemas (no enfermedades)
    sistemas = ['Sistema Respiratorio', 'Sistema Digestivo', 'Sistema Cardiovascular', 
                'Sistema Nervioso', 'Sistema Inmunológico', 'Sistema Endocrino',
                'Sistema Musculoesquelético', 'Sistema Urinario', 'Sistema Reproductor',
                'Piel', 'Sistema Linfático', 'Trastornos Mentales', 'Ojos, Oídos, Nariz y Garganta']
    
    enfermedades_reales_sin_sintomas = [e for e in sin_sintomas if e not in sistemas]
    
    print(f"Total enfermedades sin síntomas/causas: {len(enfermedades_reales_sin_sintomas)}")
    
    # Guardar en JSON para procesamiento paralelo
    output = {
        "enfermedades": enfermedades_reales_sin_sintomas
    }
    
    with open('/home/ubuntu/enfermedades_incompletas.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\nLista guardada en /home/ubuntu/enfermedades_incompletas.json")
    
    # Mostrar primeras 20
    print("\nPrimeras 20 enfermedades sin síntomas/causas:")
    for i, e in enumerate(enfermedades_reales_sin_sintomas[:20], 1):
        print(f"  {i}. {e}")

if __name__ == "__main__":
    find_incomplete_enfermedades()
