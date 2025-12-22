import { describe, it, expect } from "vitest";
import { sistemasCorporales, EnfermedadExpandida } from "../data/enfermedades-expandidas";

describe("Síntomas y Causas de Enfermedades", () => {
  // Obtener todas las enfermedades
  const todasLasEnfermedades: EnfermedadExpandida[] = sistemasCorporales.flatMap(
    (sistema) => sistema.enfermedades
  );

  it("debe tener al menos 365 enfermedades con síntomas", () => {
    const conSintomas = todasLasEnfermedades.filter(
      (e) => e.sintomas && e.sintomas.length > 0
    );
    expect(conSintomas.length).toBeGreaterThanOrEqual(365);
  });

  it("debe tener al menos 365 enfermedades con causas", () => {
    const conCausas = todasLasEnfermedades.filter(
      (e) => e.causas && e.causas.length > 0
    );
    expect(conCausas.length).toBeGreaterThanOrEqual(365);
  });

  it("los síntomas deben ser arrays de strings no vacíos", () => {
    const conSintomas = todasLasEnfermedades.filter(
      (e) => e.sintomas && e.sintomas.length > 0
    );
    
    conSintomas.forEach((enfermedad) => {
      expect(Array.isArray(enfermedad.sintomas)).toBe(true);
      enfermedad.sintomas!.forEach((sintoma) => {
        expect(typeof sintoma).toBe("string");
        expect(sintoma.length).toBeGreaterThan(0);
      });
    });
  });

  it("las causas deben ser arrays de strings no vacíos", () => {
    const conCausas = todasLasEnfermedades.filter(
      (e) => e.causas && e.causas.length > 0
    );
    
    conCausas.forEach((enfermedad) => {
      expect(Array.isArray(enfermedad.causas)).toBe(true);
      enfermedad.causas!.forEach((causa) => {
        expect(typeof causa).toBe("string");
        expect(causa.length).toBeGreaterThan(0);
      });
    });
  });

  it("el Asma debe tener síntomas específicos", () => {
    const asma = todasLasEnfermedades.find((e) => e.id === "asma");
    expect(asma).toBeDefined();
    expect(asma?.sintomas).toBeDefined();
    expect(asma?.sintomas?.length).toBeGreaterThanOrEqual(3);
  });

  it("el Asma debe tener causas específicas", () => {
    const asma = todasLasEnfermedades.find((e) => e.id === "asma");
    expect(asma).toBeDefined();
    expect(asma?.causas).toBeDefined();
    expect(asma?.causas?.length).toBeGreaterThanOrEqual(2);
  });

  it("la Diabetes debe tener síntomas y causas", () => {
    const diabetes = todasLasEnfermedades.find((e) => 
      e.id === "diabetes-mellitus-tipo-2" || e.id === "diabetes-mellitus"
    );
    expect(diabetes).toBeDefined();
    expect(diabetes?.sintomas?.length).toBeGreaterThanOrEqual(2);
    expect(diabetes?.causas?.length).toBeGreaterThanOrEqual(2);
  });

  it("cada sistema corporal debe tener enfermedades con síntomas", () => {
    sistemasCorporales.forEach((sistema) => {
      const enfermedadesConSintomas = sistema.enfermedades.filter(
        (e) => e.sintomas && e.sintomas.length > 0
      );
      // Al menos el 50% de las enfermedades de cada sistema deben tener síntomas
      const porcentaje = enfermedadesConSintomas.length / sistema.enfermedades.length;
      expect(porcentaje).toBeGreaterThanOrEqual(0.5);
    });
  });
});
