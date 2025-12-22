import { describe, it, expect } from 'vitest';
import {
  sistemasCorporales,
  getAllEnfermedades,
  buscarEnfermedadesExpandidas,
  getEnfermedadesBySistema,
  getEnfermedadExpandidaById,
  totalEnfermedades,
} from '../data/enfermedades-expandidas';

describe('Enfermedades Expandidas', () => {
  describe('sistemasCorporales', () => {
    it('should have 13 body systems', () => {
      expect(sistemasCorporales.length).toBe(13);
    });

    it('each system should have required fields', () => {
      sistemasCorporales.forEach((sistema) => {
        expect(sistema.id).toBeTruthy();
        expect(sistema.nombre).toBeTruthy();
        expect(sistema.icono).toBeTruthy();
        expect(Array.isArray(sistema.enfermedades)).toBe(true);
        expect(sistema.enfermedades.length).toBeGreaterThan(0);
      });
    });

    it('should include expected body systems', () => {
      const sistemasIds = sistemasCorporales.map(s => s.id);
      expect(sistemasIds).toContain('sistema-respiratorio');
      expect(sistemasIds).toContain('sistema-digestivo');
      expect(sistemasIds).toContain('sistema-cardiovascular');
      expect(sistemasIds).toContain('sistema-nervioso');
    });
  });

  describe('getAllEnfermedades', () => {
    it('should return all diseases as flat array', () => {
      const all = getAllEnfermedades();
      expect(all.length).toBe(totalEnfermedades);
      expect(all.length).toBeGreaterThanOrEqual(450);
    });

    it('each disease should have required fields', () => {
      const all = getAllEnfermedades();
      all.forEach((enf) => {
        expect(enf.id).toBeTruthy();
        expect(enf.nombre).toBeTruthy();
        expect(enf.descripcion).toBeTruthy();
        expect(enf.sistemaId).toBeTruthy();
        expect(Array.isArray(enf.otrosNombres)).toBe(true);
      });
    });
  });

  describe('buscarEnfermedadesExpandidas', () => {
    it('should find diseases by name', () => {
      const results = buscarEnfermedadesExpandidas('asma');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(e => e.nombre.toLowerCase().includes('asma'))).toBe(true);
    });

    it('should find diseases by alternative names', () => {
      const results = buscarEnfermedadesExpandidas('pulmonía');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find diseases by description', () => {
      const results = buscarEnfermedadesExpandidas('inflamación');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const results = buscarEnfermedadesExpandidas('xyznonexistent123');
      expect(results.length).toBe(0);
    });
  });

  describe('getEnfermedadesBySistema', () => {
    it('should return diseases for respiratory system', () => {
      const results = getEnfermedadesBySistema('sistema-respiratorio');
      expect(results.length).toBe(40);
    });

    it('should return empty array for invalid system', () => {
      const results = getEnfermedadesBySistema('invalid-system');
      expect(results.length).toBe(0);
    });
  });

  describe('getEnfermedadExpandidaById', () => {
    it('should return correct disease for valid id', () => {
      const asma = getEnfermedadExpandidaById('asma');
      expect(asma).toBeTruthy();
      expect(asma?.nombre).toBe('Asma');
    });

    it('should return undefined for invalid id', () => {
      const result = getEnfermedadExpandidaById('invalid-disease-id');
      expect(result).toBeUndefined();
    });
  });

  describe('totalEnfermedades', () => {
    it('should match the actual count of diseases', () => {
      const all = getAllEnfermedades();
      expect(totalEnfermedades).toBe(all.length);
    });

    it('should be at least 450', () => {
      expect(totalEnfermedades).toBeGreaterThanOrEqual(450);
    });
  });

  describe('disease data quality', () => {
    it('all diseases should have unique ids within their system', () => {
      sistemasCorporales.forEach((sistema) => {
        const ids = sistema.enfermedades.map(e => e.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      });
    });

    it('diseases should have meaningful descriptions', () => {
      const all = getAllEnfermedades();
      all.forEach((enf) => {
        expect(enf.descripcion.length).toBeGreaterThan(20);
      });
    });
  });
});
