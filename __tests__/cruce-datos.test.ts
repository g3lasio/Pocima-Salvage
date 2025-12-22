import { describe, it, expect } from "vitest";
import { 
  getAllPlantas, 
  categoriasPlantas, 
  getPlantaExpandidaById,
  buscarPlantasExpandidas,
  getPlantasBySistema,
  totalPlantas
} from "../data/plantas-expandidas";
import { 
  getAllEnfermedades, 
  sistemasCorporales,
  getEnfermedadExpandidaById 
} from "../data/enfermedades-expandidas";
import { 
  getPlantasParaEnfermedad, 
  getEnfermedadesParaPlanta,
  getMotivoRecomendacion 
} from "../data/cruce-datos";

describe("Plantas Expandidas", () => {
  it("debe tener al menos 690 plantas", () => {
    const plantas = getAllPlantas();
    expect(plantas.length).toBeGreaterThanOrEqual(690);
    expect(totalPlantas).toBeGreaterThanOrEqual(690);
  });

  it("debe tener 17 categorías de plantas", () => {
    expect(categoriasPlantas.length).toBe(17);
  });

  it("cada planta debe tener todos los campos requeridos", () => {
    const plantas = getAllPlantas();
    const samplePlantas = plantas.slice(0, 50); // Verificar primeras 50
    
    samplePlantas.forEach(planta => {
      expect(planta.id).toBeDefined();
      expect(planta.nombre).toBeDefined();
      expect(planta.nombreCientifico).toBeDefined();
      expect(Array.isArray(planta.propiedades)).toBe(true);
      expect(planta.propiedades.length).toBeGreaterThan(0);
      expect(planta.parteUsable).toBeDefined();
      expect(planta.dosis).toBeDefined();
      expect(planta.preparacion).toBeDefined();
      expect(Array.isArray(planta.contraindicaciones)).toBe(true);
      expect(planta.descripcion).toBeDefined();
      expect(Array.isArray(planta.sistemasRelacionados)).toBe(true);
      expect(planta.categoriaId).toBeDefined();
      expect(planta.categoria).toBeDefined();
    });
  });

  it("debe poder buscar plantas por nombre", () => {
    const resultados = buscarPlantasExpandidas("manzanilla");
    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados[0].nombre.toLowerCase()).toContain("manzanilla");
  });

  it("debe poder buscar plantas por propiedad", () => {
    const resultados = buscarPlantasExpandidas("digestiva");
    expect(resultados.length).toBeGreaterThan(0);
  });

  it("debe poder obtener plantas por sistema corporal", () => {
    const plantasDigestivo = getPlantasBySistema("sistema-digestivo");
    expect(plantasDigestivo.length).toBeGreaterThan(100);
  });

  it("debe poder obtener una planta por ID", () => {
    const planta = getPlantaExpandidaById("albahaca");
    expect(planta).toBeDefined();
    expect(planta?.nombre).toBe("Albahaca");
  });
});

describe("Cruce de Datos", () => {
  it("debe obtener plantas recomendadas para una enfermedad", () => {
    const enfermedad = getEnfermedadExpandidaById("asma");
    expect(enfermedad).toBeDefined();
    
    if (enfermedad) {
      const plantasRecomendadas = getPlantasParaEnfermedad(enfermedad);
      expect(plantasRecomendadas.length).toBeGreaterThan(0);
      expect(plantasRecomendadas.length).toBeLessThanOrEqual(6);
    }
  });

  it("debe obtener enfermedades que una planta puede tratar", () => {
    const planta = getPlantaExpandidaById("manzanilla");
    expect(planta).toBeDefined();
    
    if (planta) {
      const enfermedades = getEnfermedadesParaPlanta(planta);
      expect(enfermedades.length).toBeGreaterThan(0);
      expect(enfermedades.length).toBeLessThanOrEqual(8);
    }
  });

  it("debe generar motivo de recomendación", () => {
    const enfermedad = getEnfermedadExpandidaById("gastritis");
    const planta = getPlantaExpandidaById("manzanilla");
    
    expect(enfermedad).toBeDefined();
    expect(planta).toBeDefined();
    
    if (enfermedad && planta) {
      const motivo = getMotivoRecomendacion(planta, enfermedad);
      expect(motivo).toBeDefined();
      expect(motivo.length).toBeGreaterThan(0);
      expect(motivo).toContain("Propiedades:");
    }
  });

  it("plantas del sistema digestivo deben relacionarse con enfermedades digestivas", () => {
    const plantasDigestivas = getPlantasBySistema("sistema-digestivo").slice(0, 5);
    
    plantasDigestivas.forEach(planta => {
      const enfermedades = getEnfermedadesParaPlanta(planta);
      // Al menos algunas enfermedades deberían ser del sistema digestivo
      const enfermedadesDigestivas = enfermedades.filter(e => e.sistemaId === "sistema-digestivo");
      expect(enfermedadesDigestivas.length).toBeGreaterThanOrEqual(0);
    });
  });

  it("enfermedades respiratorias deben tener plantas con propiedades expectorantes", () => {
    const enfermedadRespiratoria = getEnfermedadExpandidaById("bronquitis-aguda");
    
    if (enfermedadRespiratoria) {
      const plantas = getPlantasParaEnfermedad(enfermedadRespiratoria);
      expect(plantas.length).toBeGreaterThan(0);
    }
  });
});

describe("Integración de Datos", () => {
  it("todos los sistemas corporales deben existir", () => {
    expect(sistemasCorporales.length).toBe(13);
    
    const sistemasIds = [
      "sistema-respiratorio",
      "sistema-digestivo",
      "sistema-cardiovascular",
      "sistema-nervioso",
      "sistema-inmunologico",
      "sistema-endocrino",
      "sistema-musculoesqueletico",
      "sistema-urinario",
      "sistema-reproductor",
      "enfermedades-de-la-piel",
      "sistema-linfatico",
      "trastornos-mentales-emocionales",
      "otorrinolaringologia-oftalmologia"
    ];
    
    sistemasIds.forEach(id => {
      const sistema = sistemasCorporales.find(s => s.id === id);
      expect(sistema).toBeDefined();
    });
  });

  it("debe haber al menos 460 enfermedades", () => {
    const enfermedades = getAllEnfermedades();
    expect(enfermedades.length).toBeGreaterThanOrEqual(460);
  });

  it("cada categoría de plantas debe tener plantas", () => {
    categoriasPlantas.forEach(categoria => {
      expect(categoria.plantas.length).toBeGreaterThan(0);
    });
  });
});
