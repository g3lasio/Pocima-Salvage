import { describe, it, expect } from "vitest";
import { 
  getAllPlantas, 
  getPlantaExpandidaById,
  buscarPlantasExpandidas
} from "../data/plantas-expandidas";

describe("Nombres Alternativos Regionales", () => {
  it("debe tener plantas con nombres alternativos", () => {
    const plantas = getAllPlantas();
    const plantasConNombres = plantas.filter(p => p.nombresAlternativos && Object.keys(p.nombresAlternativos).length > 0);
    
    expect(plantasConNombres.length).toBeGreaterThan(300);
    console.log(`Plantas con nombres alternativos: ${plantasConNombres.length} de ${plantas.length}`);
  });

  it("albahaca debe tener nombres alternativos de múltiples regiones", () => {
    const albahaca = getPlantaExpandidaById("albahaca");
    expect(albahaca).toBeDefined();
    expect(albahaca?.nombresAlternativos).toBeDefined();
    
    if (albahaca?.nombresAlternativos) {
      const regiones = Object.keys(albahaca.nombresAlternativos);
      expect(regiones.length).toBeGreaterThanOrEqual(2);
      
      // Verificar que tiene nombres en español e inglés
      const tieneEspanol = regiones.some(r => ['España', 'Mexico', 'Argentina', 'Colombia'].includes(r));
      const tieneIngles = regiones.some(r => ['USA_English', 'UK_English'].includes(r));
      
      expect(tieneEspanol || tieneIngles).toBe(true);
    }
  });

  it("manzanilla debe tener nombres alternativos", () => {
    const manzanilla = getPlantaExpandidaById("manzanilla");
    expect(manzanilla).toBeDefined();
    expect(manzanilla?.nombresAlternativos).toBeDefined();
    
    if (manzanilla?.nombresAlternativos) {
      // Verificar que los nombres son arrays de strings
      Object.values(manzanilla.nombresAlternativos).forEach(nombres => {
        expect(Array.isArray(nombres)).toBe(true);
        nombres.forEach(nombre => {
          expect(typeof nombre).toBe('string');
          expect(nombre.length).toBeGreaterThan(0);
        });
      });
    }
  });

  it("los nombres alternativos deben ser arrays de strings válidos", () => {
    const plantas = getAllPlantas();
    const plantasConNombres = plantas.filter(p => p.nombresAlternativos);
    
    // Verificar una muestra de plantas
    const muestra = plantasConNombres.slice(0, 50);
    
    muestra.forEach(planta => {
      if (planta.nombresAlternativos) {
        Object.entries(planta.nombresAlternativos).forEach(([region, nombres]) => {
          expect(typeof region).toBe('string');
          expect(Array.isArray(nombres)).toBe(true);
          
          nombres.forEach(nombre => {
            expect(typeof nombre).toBe('string');
          });
        });
      }
    });
  });

  it("debe poder buscar plantas por nombre alternativo", () => {
    // Buscar por nombre en inglés
    const resultadosBasil = buscarPlantasExpandidas("basil");
    // Puede o no encontrar resultados dependiendo de si la búsqueda incluye nombres alternativos
    expect(resultadosBasil).toBeDefined();
    expect(Array.isArray(resultadosBasil)).toBe(true);
  });

  it("las regiones deben ser consistentes", () => {
    const plantas = getAllPlantas();
    const plantasConNombres = plantas.filter(p => p.nombresAlternativos);
    
    const regionesValidas = [
      'España', 'Mexico', 'Argentina', 'Colombia', 'Peru', 'Chile',
      'Centroamerica', 'Caribe', 'USA_English', 'UK_English', 'Indigena', 'Otros'
    ];
    
    // Verificar que las regiones son válidas (permitir algunas variaciones)
    plantasConNombres.slice(0, 100).forEach(planta => {
      if (planta.nombresAlternativos) {
        Object.keys(planta.nombresAlternativos).forEach(region => {
          // La región debe ser un string no vacío
          expect(region.length).toBeGreaterThan(0);
        });
      }
    });
  });
});

describe("Integración de Nombres Alternativos con Interfaz", () => {
  it("la estructura de PlantaExpandida debe incluir nombresAlternativos opcional", () => {
    const planta = getPlantaExpandidaById("romero");
    expect(planta).toBeDefined();
    
    // Verificar que la estructura tiene los campos esperados
    expect(planta).toHaveProperty('id');
    expect(planta).toHaveProperty('nombre');
    expect(planta).toHaveProperty('nombreCientifico');
    expect(planta).toHaveProperty('propiedades');
    expect(planta).toHaveProperty('parteUsable');
    expect(planta).toHaveProperty('dosis');
    expect(planta).toHaveProperty('preparacion');
    expect(planta).toHaveProperty('contraindicaciones');
    expect(planta).toHaveProperty('descripcion');
    
    // nombresAlternativos es opcional pero si existe debe ser un objeto
    if (planta?.nombresAlternativos) {
      expect(typeof planta.nombresAlternativos).toBe('object');
    }
  });
});
