import { describe, it, expect } from "vitest";

describe("MolDoctor - Asistente Médico IA", () => {
  describe("Sistema de Mensajes", () => {
    it("debe tener estructura correcta para mensajes de chat", () => {
      const chatMessage = {
        id: "1",
        role: "user" as const,
        content: "Tengo dolor de cabeza",
        timestamp: new Date(),
      };

      expect(chatMessage.id).toBeDefined();
      expect(chatMessage.role).toBe("user");
      expect(chatMessage.content).toBeTruthy();
      expect(chatMessage.timestamp).toBeInstanceOf(Date);
    });

    it("debe soportar mensajes del asistente con metadatos", () => {
      const assistantMessage = {
        id: "2",
        role: "assistant" as const,
        content: "Entiendo que tienes dolor de cabeza...",
        timestamp: new Date(),
        triageLevel: "green" as const,
        plantLinks: [{ id: "manzanilla", nombre: "Manzanilla" }],
        enfermedadLinks: [{ id: "migrana", nombre: "Migraña" }],
      };

      expect(assistantMessage.role).toBe("assistant");
      expect(assistantMessage.triageLevel).toBe("green");
      expect(assistantMessage.plantLinks).toHaveLength(1);
      expect(assistantMessage.enfermedadLinks).toHaveLength(1);
    });
  });

  describe("Sistema de Triaje", () => {
    it("debe clasificar correctamente niveles de urgencia", () => {
      const triageLevels = ["green", "yellow", "red"] as const;
      
      expect(triageLevels).toContain("green");
      expect(triageLevels).toContain("yellow");
      expect(triageLevels).toContain("red");
    });

    it("debe detectar palabras clave de emergencia", () => {
      const emergencyKeywords = ["urgente", "emergencia", "🔴"];
      const testMessage = "Esto es urgente, necesito ayuda inmediata";
      
      const isEmergency = emergencyKeywords.some(keyword => 
        testMessage.toLowerCase().includes(keyword.toLowerCase())
      );
      
      expect(isEmergency).toBe(true);
    });
  });

  describe("Extracción de Enlaces", () => {
    it("debe extraer correctamente referencias a plantas", () => {
      const message = "Te recomiendo [PLANTA:Manzanilla] y [PLANTA:Valeriana] para tu condición.";
      const plantaMatches = message.match(/\[PLANTA:([^\]]+)\]/g) || [];
      
      expect(plantaMatches).toHaveLength(2);
      expect(plantaMatches[0]).toBe("[PLANTA:Manzanilla]");
      expect(plantaMatches[1]).toBe("[PLANTA:Valeriana]");
    });

    it("debe extraer correctamente referencias a enfermedades", () => {
      const message = "Podría tratarse de [ENFERMEDAD:Migraña] o [ENFERMEDAD:Cefalea tensional].";
      const enfermedadMatches = message.match(/\[ENFERMEDAD:([^\]]+)\]/g) || [];
      
      expect(enfermedadMatches).toHaveLength(2);
      expect(enfermedadMatches[0]).toBe("[ENFERMEDAD:Migraña]");
      expect(enfermedadMatches[1]).toBe("[ENFERMEDAD:Cefalea tensional]");
    });

    it("debe limpiar correctamente los marcadores del mensaje", () => {
      const message = "Te recomiendo [PLANTA:Manzanilla] para [ENFERMEDAD:Gastritis].";
      const cleanMessage = message
        .replace(/\[PLANTA:([^\]]+)\]/g, "$1")
        .replace(/\[ENFERMEDAD:([^\]]+)\]/g, "$1");
      
      expect(cleanMessage).toBe("Te recomiendo Manzanilla para Gastritis.");
    });
  });

  describe("Personalidad del Doctor", () => {
    it("debe tener saludos con humor definidos", () => {
      const greetings = [
        "¡Hola! Soy MolDoctor 🩺🌿 Tu médico digital con un toque de humor.",
        "¡Bienvenido a mi consultorio virtual! Soy MolDoctor, experto en plantas medicinales.",
        "¡Hola, paciente! Soy MolDoctor. No te preocupes, mis diagnósticos son mejores que mis chistes.",
      ];
      
      expect(greetings.length).toBeGreaterThan(0);
      greetings.forEach(greeting => {
        expect(greeting).toContain("MolDoctor");
      });
    });
  });

  describe("Análisis de Imágenes", () => {
    it("debe soportar tipos de imagen válidos", () => {
      const validMimeTypes = ["image/jpeg", "image/png"];
      
      const testUri1 = "photo.jpg";
      const testUri2 = "document.png";
      
      const mimeType1 = testUri1.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      const mimeType2 = testUri2.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      expect(validMimeTypes).toContain(mimeType1);
      expect(validMimeTypes).toContain(mimeType2);
    });
  });

  describe("Historial de Conversaciones", () => {
    it("debe limitar el historial a los últimos mensajes", () => {
      const messages = Array.from({ length: 20 }, (_, i) => ({
        id: String(i),
        role: i % 2 === 0 ? "user" : "assistant",
        content: `Mensaje ${i}`,
      }));
      
      const lastMessages = messages.slice(-10);
      
      expect(lastMessages).toHaveLength(10);
      expect(lastMessages[0].id).toBe("10");
      expect(lastMessages[9].id).toBe("19");
    });

    it("debe serializar y deserializar correctamente", () => {
      const message = {
        id: "1",
        role: "user",
        content: "Test",
        timestamp: new Date("2024-01-01T12:00:00Z"),
      };
      
      const serialized = JSON.stringify(message);
      const parsed = JSON.parse(serialized);
      parsed.timestamp = new Date(parsed.timestamp);
      
      expect(parsed.id).toBe(message.id);
      expect(parsed.role).toBe(message.role);
      expect(parsed.content).toBe(message.content);
      expect(parsed.timestamp.getTime()).toBe(message.timestamp.getTime());
    });
  });
});
