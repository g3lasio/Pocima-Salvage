#!/usr/bin/env python3
"""
Script para procesar los datos de plantas medicinales generados y crear el archivo TypeScript
"""

import json
import re

# Leer el archivo JSON con los resultados
with open('/home/ubuntu/generate_plants_by_category.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Procesar cada resultado
all_categories = []
all_plants = []
total_plants = 0

for result in data['results']:
    if result.get('error'):
        print(f"Error en: {result['input'][:50]}...")
        continue
    
    try:
        json_str = result['output']['json_data']
        category_data = json.loads(json_str)
        all_categories.append(category_data)
        plantas = category_data.get('plantas', [])
        count = len(plantas)
        total_plants += count
        
        # Agregar categoría a cada planta
        for planta in plantas:
            planta['categoriaId'] = category_data.get('categoriaId', '')
            planta['categoria'] = category_data.get('categoria', '')
            all_plants.append(planta)
        
        print(f"✓ {category_data['categoria']}: {count} plantas")
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        continue

print(f"\nTotal de plantas: {total_plants}")
print(f"Total de categorías: {len(all_categories)}")

# Generar el archivo TypeScript
ts_content = '''// Pócima Salvage - Base de datos expandida de plantas medicinales
// Generado automáticamente - Total: ''' + str(total_plants) + ''' plantas

export interface PlantaExpandida {
  id: string;
  nombre: string;
  nombreCientifico: string;
  propiedades: string[];
  parteUsable: string;
  dosis: string;
  preparacion: string;
  contraindicaciones: ContraindicacionPlanta[];
  descripcion: string;
  sistemasRelacionados: string[];
  categoriaId: string;
  categoria: string;
}

export interface ContraindicacionPlanta {
  tipo: "embarazo" | "ninos" | "hipertension" | "diabetes" | "lactancia" | "alergia" | "medicamentos" | "otro";
  descripcion: string;
}

export interface CategoriaPlanta {
  id: string;
  nombre: string;
  plantas: PlantaExpandida[];
}

export const categoriasPlantas: CategoriaPlanta[] = [
'''

for category in all_categories:
    cat_id = category.get('categoriaId', '')
    cat_nombre = category.get('categoria', '')
    plantas = category.get('plantas', [])
    
    ts_content += f'''  {{
    id: "{cat_id}",
    nombre: "{cat_nombre}",
    plantas: [
'''
    
    for planta in plantas:
        planta_id = planta.get('id', '')
        nombre = planta.get('nombre', '').replace('"', '\\"')
        nombre_cientifico = planta.get('nombreCientifico', '').replace('"', '\\"')
        propiedades = json.dumps(planta.get('propiedades', []), ensure_ascii=False)
        parte_usable = planta.get('parteUsable', '').replace('"', '\\"')
        dosis = planta.get('dosis', '').replace('"', '\\"').replace('\n', ' ')
        preparacion = planta.get('preparacion', '').replace('"', '\\"').replace('\n', ' ')
        
        # Procesar contraindicaciones
        contras = planta.get('contraindicaciones', [])
        contras_str = "["
        for i, c in enumerate(contras):
            tipo = c.get('tipo', 'otro')
            # Validar tipo
            valid_tipos = ["embarazo", "ninos", "hipertension", "diabetes", "lactancia", "alergia", "medicamentos", "otro"]
            if tipo not in valid_tipos:
                tipo = "otro"
            desc = c.get('descripcion', '').replace('"', '\\"').replace('\n', ' ')
            contras_str += f'{{ tipo: "{tipo}", descripcion: "{desc}" }}'
            if i < len(contras) - 1:
                contras_str += ", "
        contras_str += "]"
        
        descripcion = planta.get('descripcion', '').replace('"', '\\"').replace('\n', ' ')
        sistemas = json.dumps(planta.get('sistemasRelacionados', []), ensure_ascii=False)
        
        ts_content += f'''      {{
        id: "{planta_id}",
        nombre: "{nombre}",
        nombreCientifico: "{nombre_cientifico}",
        propiedades: {propiedades},
        parteUsable: "{parte_usable}",
        dosis: "{dosis}",
        preparacion: "{preparacion}",
        contraindicaciones: {contras_str},
        descripcion: "{descripcion}",
        sistemasRelacionados: {sistemas},
        categoriaId: "{cat_id}",
        categoria: "{cat_nombre}",
      }},
'''
    
    ts_content += '''    ],
  },
'''

ts_content += '''];

// Función para obtener todas las plantas como lista plana
export const getAllPlantas = (): PlantaExpandida[] => {
  return categoriasPlantas.flatMap(cat => cat.plantas);
};

// Función para buscar plantas
export const buscarPlantasExpandidas = (query: string): PlantaExpandida[] => {
  const q = query.toLowerCase();
  return getAllPlantas().filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.nombreCientifico.toLowerCase().includes(q) ||
    p.propiedades.some(prop => prop.toLowerCase().includes(q)) ||
    p.descripcion.toLowerCase().includes(q)
  );
};

// Función para obtener plantas por categoría
export const getPlantasByCategoria = (categoriaId: string): PlantaExpandida[] => {
  const categoria = categoriasPlantas.find(c => c.id === categoriaId);
  return categoria?.plantas || [];
};

// Función para obtener una planta por ID
export const getPlantaExpandidaById = (id: string): PlantaExpandida | undefined => {
  return getAllPlantas().find(p => p.id === id);
};

// Función para obtener plantas por sistema corporal
export const getPlantasBySistema = (sistemaId: string): PlantaExpandida[] => {
  return getAllPlantas().filter(p => 
    p.sistemasRelacionados.includes(sistemaId)
  );
};

// Función para obtener plantas por propiedad
export const getPlantasByPropiedad = (propiedad: string): PlantaExpandida[] => {
  const prop = propiedad.toLowerCase();
  return getAllPlantas().filter(p =>
    p.propiedades.some(pr => pr.toLowerCase().includes(prop))
  );
};

// Exportar conteo total
export const totalPlantas = ''' + str(total_plants) + ''';
'''

# Guardar el archivo TypeScript
with open('/home/ubuntu/pocima-salvage/data/plantas-expandidas.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"\n✓ Archivo TypeScript generado: /home/ubuntu/pocima-salvage/data/plantas-expandidas.ts")

# Generar estadísticas por sistema
print("\n--- Estadísticas por sistema ---")
sistemas_count = {}
for planta in all_plants:
    for sistema in planta.get('sistemasRelacionados', []):
        sistemas_count[sistema] = sistemas_count.get(sistema, 0) + 1

for sistema, count in sorted(sistemas_count.items(), key=lambda x: -x[1]):
    print(f"  {sistema}: {count} plantas")
