import { describe, it, expect } from 'vitest';
import {
  plantas,
  enfermedades,
  getPlantaById,
  getEnfermedadById,
  buscarPlantas,
  buscarEnfermedades,
  contraindicacionIconos,
  contraindicacionLabels,
} from '../data/medicinal-data';

describe('Medicinal Data', () => {
  describe('plantas', () => {
    it('should have at least 15 plants', () => {
      expect(plantas.length).toBeGreaterThanOrEqual(15);
    });

    it('each plant should have required fields', () => {
      plantas.forEach((planta) => {
        expect(planta.id).toBeTruthy();
        expect(planta.nombre).toBeTruthy();
        expect(planta.nombreCientifico).toBeTruthy();
        expect(planta.propiedades.length).toBeGreaterThan(0);
        expect(planta.parteUsable).toBeTruthy();
        expect(planta.dosis).toBeTruthy();
        expect(planta.preparacion).toBeTruthy();
        expect(planta.fuente).toBeTruthy();
        expect(planta.descripcion).toBeTruthy();
        expect(Array.isArray(planta.contraindicaciones)).toBe(true);
      });
    });

    it('each contraindicacion should have valid tipo and descripcion', () => {
      plantas.forEach((planta) => {
        planta.contraindicaciones.forEach((contra) => {
          expect(contra.tipo).toBeTruthy();
          expect(contra.descripcion).toBeTruthy();
          expect(contraindicacionIconos[contra.tipo]).toBeTruthy();
          expect(contraindicacionLabels[contra.tipo]).toBeTruthy();
        });
      });
    });
  });

  describe('enfermedades', () => {
    it('should have at least 10 diseases', () => {
      expect(enfermedades.length).toBeGreaterThanOrEqual(10);
    });

    it('each disease should have required fields', () => {
      enfermedades.forEach((enfermedad) => {
        expect(enfermedad.id).toBeTruthy();
        expect(enfermedad.nombre).toBeTruthy();
        expect(enfermedad.descripcion).toBeTruthy();
        expect(enfermedad.plantasRecomendadas.length).toBeGreaterThan(0);
      });
    });

    it('each recommended plant should exist in plantas array', () => {
      enfermedades.forEach((enfermedad) => {
        enfermedad.plantasRecomendadas.forEach((rec) => {
          const planta = getPlantaById(rec.plantaId);
          expect(planta).toBeTruthy();
          expect(rec.razon).toBeTruthy();
        });
      });
    });
  });

  describe('getPlantaById', () => {
    it('should return correct plant for valid id', () => {
      const manzanilla = getPlantaById('manzanilla');
      expect(manzanilla).toBeTruthy();
      expect(manzanilla?.nombre).toBe('Manzanilla');
    });

    it('should return undefined for invalid id', () => {
      const result = getPlantaById('planta-inexistente');
      expect(result).toBeUndefined();
    });
  });

  describe('getEnfermedadById', () => {
    it('should return correct disease for valid id', () => {
      const dolorCabeza = getEnfermedadById('dolor-cabeza');
      expect(dolorCabeza).toBeTruthy();
      expect(dolorCabeza?.nombre).toBe('Dolor de Cabeza');
    });

    it('should return undefined for invalid id', () => {
      const result = getEnfermedadById('enfermedad-inexistente');
      expect(result).toBeUndefined();
    });
  });

  describe('buscarPlantas', () => {
    it('should find plants by name', () => {
      const results = buscarPlantas('manzanilla');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(p => p.nombre.toLowerCase().includes('manzanilla'))).toBe(true);
    });

    it('should find plants by scientific name', () => {
      const results = buscarPlantas('matricaria');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find plants by property', () => {
      const results = buscarPlantas('digestiva');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(p => p.propiedades.some(prop => prop.toLowerCase().includes('digestiva')))).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = buscarPlantas('xyznonexistent');
      expect(results.length).toBe(0);
    });
  });

  describe('buscarEnfermedades', () => {
    it('should find diseases by name', () => {
      const results = buscarEnfermedades('dolor');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find diseases by description', () => {
      const results = buscarEnfermedades('sueño');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const results = buscarEnfermedades('xyznonexistent');
      expect(results.length).toBe(0);
    });
  });
});
