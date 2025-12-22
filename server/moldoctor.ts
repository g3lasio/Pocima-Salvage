import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

// System prompt para MolDoctor con personalidad humorística
const MOLDOCTOR_SYSTEM_PROMPT = `Eres MolDoctor 🩺🌿, un médico digital experto en medicina natural y plantas medicinales. Tu personalidad es:

PERSONALIDAD:
- Tienes un excelente sentido del humor médico (chistes sobre doctores, salud, pero siempre respetuoso)
- Eres empático, cálido y haces que el paciente se sienta cómodo
- Usas analogías divertidas para explicar condiciones médicas
- Incluyes emojis relevantes para hacer la conversación más amigable
- Siempre mantienes un tono profesional pero accesible

CONOCIMIENTOS:
- Eres experto en fitoterapia y medicina natural
- Conoces plantas medicinales de todo el mundo y sus propiedades
- Sabes sobre contraindicaciones y precauciones
- Puedes interpretar síntomas y sugerir posibles causas
- Puedes analizar resultados de laboratorio y explicarlos de forma simple

METODOLOGÍA DE CONSULTA:
1. Saluda con humor y pregunta cómo puede ayudar
2. Haz preguntas de seguimiento sobre síntomas (ubicación, intensidad, duración, factores que mejoran/empeoran)
3. Pregunta sobre historial médico relevante
4. Pregunta sobre hábitos (sueño, alimentación, estrés)
5. Si el paciente evita una pregunta, asegúrale que todo es confidencial
6. Evalúa la urgencia: 🟢 Leve | 🟡 Moderado | 🔴 Urgente

RECOMENDACIONES:
- SIEMPRE recomienda plantas medicinales como primera opción
- Incluye: nombre de la planta, parte usada, preparación, dosis, contraindicaciones
- Cuando menciones una planta, usa el formato: [PLANTA:nombre_de_la_planta] para que el usuario pueda ver más detalles
- Cuando menciones una enfermedad, usa el formato: [ENFERMEDAD:nombre_de_la_enfermedad] para que el usuario pueda ver más detalles
- SIEMPRE al final recomienda consultar a un médico profesional para confirmación

PLANTAS MEDICINALES DISPONIBLES EN LA APP (usa estas como referencia):
- Manzanilla: digestiva, antiinflamatoria, sedante
- Valeriana: sedante, ansiolítica, relajante
- Jengibre: antiemético, antiinflamatorio, digestivo
- Eucalipto: expectorante, descongestionante, antibacteriano
- Menta: digestiva, refrescante, analgésica
- Aloe Vera: cicatrizante, emoliente, antiinflamatoria
- Equinácea: inmunoestimulante, antiviral, antibacteriana
- Cúrcuma: antiinflamatoria, antioxidante, hepatoprotectora
- Ajo: antibacteriano, hipotensor, hipolipemiante
- Romero: estimulante, circulatorio, digestivo
- Lavanda: sedante, relajante, ansiolítica
- Tomillo: antibacteriano, expectorante, antitusivo
- Sábila: cicatrizante, hidratante, antiinflamatoria
- Ginkgo Biloba: circulatorio cerebral, antioxidante
- Pasiflora: sedante, ansiolítica, antiespasmódica
- Boldo: hepatoprotector, colerético, digestivo
- Diente de León: diurético, depurativo, hepatoprotector
- Cola de Caballo: diurética, remineralizante, astringente
- Ortiga: depurativa, antianémica, antiinflamatoria
- Hinojo: carminativo, digestivo, galactogogo

FORMATO DE RESPUESTA:
- Usa párrafos cortos y fáciles de leer
- Incluye listas con viñetas cuando sea apropiado
- Usa emojis para hacer el texto más amigable
- Incluye un chiste o comentario ligero cuando sea apropiado
- Termina con una pregunta de seguimiento o verificación

ADVERTENCIAS:
- Si detectas síntomas de emergencia (dolor de pecho, dificultad respiratoria severa, sangrado abundante, etc.), indica INMEDIATAMENTE que debe ir a urgencias
- Nunca diagnostiques con certeza absoluta, usa "posiblemente", "podría ser", "sugiere"
- Siempre menciona que tus recomendaciones no reemplazan la consulta médica profesional

IDIOMA: Responde siempre en español.`;

// Esquema para el mensaje del chat
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

// Esquema para la solicitud de chat
const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema),
  imageBase64: z.string().optional(),
  imageMimeType: z.string().optional(),
});

export const moldoctorRouter = router({
  // Endpoint principal de chat
  chat: publicProcedure
    .input(chatRequestSchema)
    .mutation(async ({ input }) => {
      const { messages, imageBase64, imageMimeType } = input;

      // Construir los mensajes para el LLM
      const llmMessages: any[] = [
        { role: "system", content: MOLDOCTOR_SYSTEM_PROMPT },
      ];

      // Agregar historial de conversación
      for (const msg of messages.slice(-10)) { // Últimos 10 mensajes para contexto
        llmMessages.push({
          role: msg.role,
          content: msg.content,
        });
      }

      // Si hay imagen, agregarla al último mensaje del usuario
      if (imageBase64 && imageMimeType) {
        const lastUserMsgIndex = llmMessages.length - 1;
        if (llmMessages[lastUserMsgIndex].role === "user") {
          llmMessages[lastUserMsgIndex] = {
            role: "user",
            content: [
              { type: "text", text: llmMessages[lastUserMsgIndex].content || "Analiza esta imagen:" },
              {
                type: "image_url",
                image_url: {
                  url: `data:${imageMimeType};base64,${imageBase64}`,
                  detail: "high",
                },
              },
            ],
          };
        }
      }

      try {
        const response = await invokeLLM({
          messages: llmMessages,
        });

        const rawContent = response.choices[0]?.message?.content;
        const assistantMessage: string = typeof rawContent === 'string' 
          ? rawContent 
          : "¡Ups! Parece que mi cerebro de doctor tuvo un pequeño cortocircuito 🤖💥 ¿Podrías repetir tu pregunta?";

        // Extraer nivel de triaje si está presente
        let triageLevel: "green" | "yellow" | "red" = "green";
        if (assistantMessage.includes("🔴") || assistantMessage.toLowerCase().includes("urgente") || assistantMessage.toLowerCase().includes("emergencia")) {
          triageLevel = "red";
        } else if (assistantMessage.includes("🟡") || assistantMessage.toLowerCase().includes("moderado")) {
          triageLevel = "yellow";
        }

        // Extraer referencias a plantas y enfermedades
        const plantaMatches = assistantMessage.match(/\[PLANTA:([^\]]+)\]/g) || [];
        const enfermedadMatches = assistantMessage.match(/\[ENFERMEDAD:([^\]]+)\]/g) || [];

        const plantLinks = plantaMatches.map((match: string) => {
          const nombre = match.replace("[PLANTA:", "").replace("]", "");
          return { id: nombre.toLowerCase().replace(/\s+/g, "-"), nombre };
        });

        const enfermedadLinks = enfermedadMatches.map((match: string) => {
          const nombre = match.replace("[ENFERMEDAD:", "").replace("]", "");
          return { id: nombre.toLowerCase().replace(/\s+/g, "-"), nombre };
        });

        // Limpiar el mensaje de los marcadores
        const cleanMessage = assistantMessage
          .replace(/\[PLANTA:([^\]]+)\]/g, "$1")
          .replace(/\[ENFERMEDAD:([^\]]+)\]/g, "$1");

        return {
          success: true,
          message: cleanMessage,
          triageLevel,
          plantLinks,
          enfermedadLinks,
        };
      } catch (error) {
        console.error("Error en MolDoctor chat:", error);
        return {
          success: false,
          message: "¡Ay caramba! 🤕 Parece que tuve un problema técnico. Como decimos los doctores: 'Si al principio no funciona, reinicia y vuelve a intentar'. ¿Podrías enviar tu mensaje de nuevo?",
          triageLevel: "green" as const,
          plantLinks: [],
          enfermedadLinks: [],
        };
      }
    }),

  // Endpoint para analizar documentos de laboratorio
  analyzeLabDocument: publicProcedure
    .input(z.object({
      imageBase64: z.string(),
      imageMimeType: z.string(),
      userQuestion: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { imageBase64, imageMimeType, userQuestion } = input;

      const analysisPrompt = `Eres MolDoctor analizando un documento de laboratorio.

INSTRUCCIONES:
1. Identifica qué tipo de análisis es (sangre, orina, etc.)
2. Lee los valores y compáralos con los rangos normales
3. Explica cada valor de forma simple, como si hablaras con alguien sin conocimientos médicos
4. Usa analogías divertidas para explicar conceptos complejos
5. Destaca valores fuera de rango con ⚠️
6. Sugiere plantas medicinales si hay valores que podrían mejorarse naturalmente
7. SIEMPRE recomienda consultar con un médico para interpretación profesional

${userQuestion ? `El paciente pregunta específicamente: "${userQuestion}"` : ""}

Responde en español con tu estilo humorístico característico.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: MOLDOCTOR_SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                { type: "text", text: analysisPrompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${imageMimeType};base64,${imageBase64}`,
                    detail: "high",
                  },
                },
              ],
            },
          ],
        });

        const rawAnalysis = response.choices[0]?.message?.content;
        const analysis: string = typeof rawAnalysis === 'string'
          ? rawAnalysis
          : "No pude leer el documento. ¿Podrías enviar una foto más clara?";

        return {
          success: true,
          analysis,
        };
      } catch (error) {
        console.error("Error analizando documento:", error);
        return {
          success: false,
          analysis: "¡Ups! No pude analizar el documento. Asegúrate de que la imagen sea clara y legible.",
        };
      }
    }),
});
