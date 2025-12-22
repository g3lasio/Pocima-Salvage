#!/usr/bin/env python3
"""
Script para procesar los datos de enfermedades generados y crear el archivo TypeScript
"""

import json
import re

# Leer el archivo JSON con los resultados
with open('/home/ubuntu/generate_diseases_by_system.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Procesar cada resultado
all_systems = []
total_diseases = 0

for result in data['results']:
    if result.get('error'):
        print(f"Error en: {result['input'][:50]}...")
        continue
    
    try:
        json_str = result['output']['json_data']
        system_data = json.loads(json_str)
        all_systems.append(system_data)
        count = len(system_data.get('enfermedades', []))
        total_diseases += count
        print(f"✓ {system_data['sistema']}: {count} enfermedades")
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        continue

print(f"\nTotal de enfermedades: {total_diseases}")
print(f"Total de sistemas: {len(all_systems)}")

# Generar el archivo TypeScript
ts_content = '''// Pócima Salvage - Base de datos expandida de enfermedades por sistemas del cuerpo humano
// Generado automáticamente - Total: ''' + str(total_diseases) + ''' enfermedades

export interface EnfermedadExpandida {
  id: string;
  nombre: string;
  otrosNombres: string[];
  descripcion: string;
  sistemaId: string;
}

export interface SistemaCorporal {
  id: string;
  nombre: string;
  icono: string;
  enfermedades: EnfermedadExpandida[];
}

export const sistemasCorporales: SistemaCorporal[] = [
'''

for system in all_systems:
    sistema_id = system.get('sistemaId', '')
    sistema_nombre = system.get('sistema', '')
    sistema_icono = system.get('icono', '🏥')
    enfermedades = system.get('enfermedades', [])
    
    ts_content += f'''  {{
    id: "{sistema_id}",
    nombre: "{sistema_nombre}",
    icono: "{sistema_icono}",
    enfermedades: [
'''
    
    for enf in enfermedades:
        enf_id = enf.get('id', '')
        enf_nombre = enf.get('nombre', '').replace('"', '\\"')
        otros_nombres = enf.get('otrosNombres', [])
        otros_nombres_str = json.dumps(otros_nombres, ensure_ascii=False)
        descripcion = enf.get('descripcion', '').replace('"', '\\"').replace('\n', ' ')
        
        ts_content += f'''      {{
        id: "{enf_id}",
        nombre: "{enf_nombre}",
        otrosNombres: {otros_nombres_str},
        descripcion: "{descripcion}",
        sistemaId: "{sistema_id}",
      }},
'''
    
    ts_content += '''    ],
  },
'''

ts_content += '''];

// Función para obtener todas las enfermedades como lista plana
export const getAllEnfermedades = (): EnfermedadExpandida[] => {
  return sistemasCorporales.flatMap(sistema => sistema.enfermedades);
};

// Función para buscar enfermedades
export const buscarEnfermedadesExpandidas = (query: string): EnfermedadExpandida[] => {
  const q = query.toLowerCase();
  return getAllEnfermedades().filter(e =>
    e.nombre.toLowerCase().includes(q) ||
    e.otrosNombres.some(n => n.toLowerCase().includes(q)) ||
    e.descripcion.toLowerCase().includes(q)
  );
};

// Función para obtener enfermedades por sistema
export const getEnfermedadesBySistema = (sistemaId: string): EnfermedadExpandida[] => {
  const sistema = sistemasCorporales.find(s => s.id === sistemaId);
  return sistema?.enfermedades || [];
};

// Función para obtener una enfermedad por ID
export const getEnfermedadExpandidaById = (id: string): EnfermedadExpandida | undefined => {
  return getAllEnfermedades().find(e => e.id === id);
};

// Exportar conteo total
export const totalEnfermedades = ''' + str(total_diseases) + ''';
'''

# Guardar el archivo TypeScript
with open('/home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"\n✓ Archivo TypeScript generado: /home/ubuntu/pocima-salvage/data/enfermedades-expandidas.ts")
