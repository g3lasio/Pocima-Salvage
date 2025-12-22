#!/usr/bin/env python3
"""
Script para auditar los datos de enfermedades y plantas medicinales.
Verifica que todos los campos estén completos y no truncados.
"""

import re
import json

def audit_enfermedades():
    """Audita el archivo de enfermedades expandidas."""
    print("=" * 60)
    print("AUDITORÍA DE ENFERMEDADES")
    print("=" * 60)
    
    with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Contar enfermedades
    enfermedades = re.findall(r'{\s*id:\s*["\']([^"\']+)["\']', content)
    print(f"\nTotal de enfermedades encontradas: {len(enfermedades)}")
    
    # Verificar campos
    sintomas_count = len(re.findall(r'sintomas:\s*\[', content))
    causas_count = len(re.findall(r'causas:\s*\[', content))
    descripcion_count = len(re.findall(r'descripcion:\s*["\']', content))
    otros_nombres_count = len(re.findall(r'otrosNombres:\s*\[', content))
    
    print(f"Enfermedades con síntomas: {sintomas_count}")
    print(f"Enfermedades con causas: {causas_count}")
    print(f"Enfermedades con descripción: {descripcion_count}")
    print(f"Enfermedades con otros nombres: {otros_nombres_count}")
    
    # Buscar campos vacíos o truncados
    empty_sintomas = len(re.findall(r'sintomas:\s*\[\s*\]', content))
    empty_causas = len(re.findall(r'causas:\s*\[\s*\]', content))
    
    print(f"\nEnfermedades con síntomas vacíos: {empty_sintomas}")
    print(f"Enfermedades con causas vacías: {empty_causas}")
    
    # Verificar si hay datos truncados (buscar patrones incompletos)
    truncated = re.findall(r'["\'][^"\']{200,}\.{3}', content)
    if truncated:
        print(f"\n⚠️ Posibles datos truncados encontrados: {len(truncated)}")
    else:
        print("\n✅ No se encontraron datos truncados")
    
    return {
        'total': len(enfermedades),
        'con_sintomas': sintomas_count,
        'con_causas': causas_count,
        'sin_sintomas': empty_sintomas,
        'sin_causas': empty_causas
    }

def audit_plantas():
    """Audita el archivo de plantas expandidas."""
    print("\n" + "=" * 60)
    print("AUDITORÍA DE PLANTAS MEDICINALES")
    print("=" * 60)
    
    with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Contar plantas
    plantas = re.findall(r'{\s*id:\s*["\']([^"\']+)["\']', content)
    print(f"\nTotal de plantas encontradas: {len(plantas)}")
    
    # Verificar campos principales
    propiedades_count = len(re.findall(r'propiedades:\s*\[', content))
    parte_usada_count = len(re.findall(r'parteUsada:\s*["\']', content))
    dosis_count = len(re.findall(r'dosis:\s*["\']', content))
    preparacion_count = len(re.findall(r'preparacion:\s*["\']', content))
    contraindicaciones_count = len(re.findall(r'contraindicaciones:\s*\[', content))
    nombres_alt_count = len(re.findall(r'nombresAlternativos:\s*{', content))
    
    print(f"Plantas con propiedades: {propiedades_count}")
    print(f"Plantas con parte usada: {parte_usada_count}")
    print(f"Plantas con dosis: {dosis_count}")
    print(f"Plantas con preparación: {preparacion_count}")
    print(f"Plantas con contraindicaciones: {contraindicaciones_count}")
    print(f"Plantas con nombres alternativos: {nombres_alt_count}")
    
    # Buscar campos vacíos
    empty_propiedades = len(re.findall(r'propiedades:\s*\[\s*\]', content))
    empty_contraindicaciones = len(re.findall(r'contraindicaciones:\s*\[\s*\]', content))
    
    print(f"\nPlantas con propiedades vacías: {empty_propiedades}")
    print(f"Plantas con contraindicaciones vacías: {empty_contraindicaciones}")
    
    # Verificar si hay datos truncados
    truncated = re.findall(r'["\'][^"\']{200,}\.{3}', content)
    if truncated:
        print(f"\n⚠️ Posibles datos truncados encontrados: {len(truncated)}")
    else:
        print("\n✅ No se encontraron datos truncados")
    
    return {
        'total': len(plantas),
        'con_propiedades': propiedades_count,
        'con_dosis': dosis_count,
        'con_preparacion': preparacion_count,
        'con_contraindicaciones': contraindicaciones_count,
        'con_nombres_alt': nombres_alt_count,
        'sin_propiedades': empty_propiedades
    }

def check_missing_data():
    """Identifica enfermedades y plantas con datos faltantes."""
    print("\n" + "=" * 60)
    print("ANÁLISIS DE DATOS FALTANTES")
    print("=" * 60)
    
    # Leer enfermedades
    with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'r', encoding='utf-8') as f:
        enf_content = f.read()
    
    # Buscar enfermedades sin síntomas (tienen el campo pero está vacío o no existe)
    # Patrón: id seguido de nombre, pero sin sintomas antes del siguiente id
    enf_blocks = re.split(r'(?={\s*id:\s*["\'])', enf_content)
    
    sin_sintomas = []
    sin_causas = []
    
    for block in enf_blocks:
        if not block.strip():
            continue
        id_match = re.search(r'id:\s*["\']([^"\']+)["\']', block)
        nombre_match = re.search(r'nombre:\s*["\']([^"\']+)["\']', block)
        
        if id_match and nombre_match:
            has_sintomas = 'sintomas:' in block and not re.search(r'sintomas:\s*\[\s*\]', block)
            has_causas = 'causas:' in block and not re.search(r'causas:\s*\[\s*\]', block)
            
            if not has_sintomas:
                sin_sintomas.append(nombre_match.group(1))
            if not has_causas:
                sin_causas.append(nombre_match.group(1))
    
    print(f"\nEnfermedades sin síntomas ({len(sin_sintomas)}):")
    if sin_sintomas[:10]:
        for e in sin_sintomas[:10]:
            print(f"  - {e}")
        if len(sin_sintomas) > 10:
            print(f"  ... y {len(sin_sintomas) - 10} más")
    
    print(f"\nEnfermedades sin causas ({len(sin_causas)}):")
    if sin_causas[:10]:
        for e in sin_causas[:10]:
            print(f"  - {e}")
        if len(sin_causas) > 10:
            print(f"  ... y {len(sin_causas) - 10} más")
    
    return {
        'enfermedades_sin_sintomas': len(sin_sintomas),
        'enfermedades_sin_causas': len(sin_causas)
    }

def main():
    print("\n🔍 INICIANDO AUDITORÍA COMPLETA DE DATOS\n")
    
    enf_stats = audit_enfermedades()
    plantas_stats = audit_plantas()
    missing_stats = check_missing_data()
    
    print("\n" + "=" * 60)
    print("RESUMEN DE AUDITORÍA")
    print("=" * 60)
    
    print(f"""
ENFERMEDADES:
- Total: {enf_stats['total']}
- Con síntomas: {enf_stats['con_sintomas']} ({100*enf_stats['con_sintomas']//max(enf_stats['total'],1)}%)
- Con causas: {enf_stats['con_causas']} ({100*enf_stats['con_causas']//max(enf_stats['total'],1)}%)
- Sin síntomas: {missing_stats['enfermedades_sin_sintomas']}
- Sin causas: {missing_stats['enfermedades_sin_causas']}

PLANTAS:
- Total: {plantas_stats['total']}
- Con propiedades: {plantas_stats['con_propiedades']} ({100*plantas_stats['con_propiedades']//max(plantas_stats['total'],1)}%)
- Con dosis: {plantas_stats['con_dosis']} ({100*plantas_stats['con_dosis']//max(plantas_stats['total'],1)}%)
- Con preparación: {plantas_stats['con_preparacion']} ({100*plantas_stats['con_preparacion']//max(plantas_stats['total'],1)}%)
- Con contraindicaciones: {plantas_stats['con_contraindicaciones']} ({100*plantas_stats['con_contraindicaciones']//max(plantas_stats['total'],1)}%)
- Con nombres alternativos: {plantas_stats['con_nombres_alt']} ({100*plantas_stats['con_nombres_alt']//max(plantas_stats['total'],1)}%)
""")

if __name__ == "__main__":
    main()
