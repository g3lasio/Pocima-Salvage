// Pócima Salvage - Cruce de datos bidireccional entre enfermedades y plantas
// Este archivo contiene las funciones para relacionar enfermedades con plantas y viceversa

import { sistemasCorporales, EnfermedadExpandida, getAllEnfermedades } from './enfermedades-expandidas';
import { getAllPlantas, PlantaExpandida, getPlantasBySistema } from './plantas-expandidas';

// Mapeo de palabras clave de enfermedades a propiedades de plantas
const enfermedadToPropiedades: Record<string, string[]> = {
  // Sistema Respiratorio
  'asma': ['Broncodilatadora', 'Expectorante', 'Antiinflamatoria', 'Antiasmática'],
  'bronquitis': ['Expectorante', 'Mucolítica', 'Antibacteriana', 'Antitusiva'],
  'neumonia': ['Antibacteriana', 'Expectorante', 'Inmunoestimulante'],
  'tos': ['Antitusiva', 'Expectorante', 'Emoliente', 'Balsámica'],
  'gripe': ['Antiviral', 'Inmunoestimulante', 'Antipirética', 'Diaforética'],
  'resfriado': ['Antiviral', 'Descongestionante', 'Inmunoestimulante'],
  'sinusitis': ['Descongestionante', 'Antiinflamatoria', 'Antiséptica'],
  'rinitis': ['Antihistamínica', 'Descongestionante', 'Antiinflamatoria'],
  'faringitis': ['Antiséptica', 'Antiinflamatoria', 'Emoliente'],
  'laringitis': ['Antiinflamatoria', 'Emoliente', 'Antiséptica'],
  
  // Sistema Digestivo
  'gastritis': ['Antiácida', 'Protectora gástrica', 'Antiinflamatoria', 'Demulcente'],
  'ulcera': ['Cicatrizante', 'Protectora gástrica', 'Antiinflamatoria'],
  'reflujo': ['Antiácida', 'Digestiva', 'Carminativa'],
  'colitis': ['Antiinflamatoria', 'Antiespasmódica', 'Astringente'],
  'diarrea': ['Astringente', 'Antidiarreica', 'Antimicrobiana'],
  'estreñimiento': ['Laxante', 'Fibra', 'Estimulante intestinal'],
  'flatulencia': ['Carminativa', 'Antiespasmódica', 'Digestiva'],
  'nausea': ['Antiemética', 'Digestiva', 'Carminativa'],
  'hepatitis': ['Hepatoprotectora', 'Colerética', 'Antioxidante'],
  'cirrosis': ['Hepatoprotectora', 'Antioxidante', 'Regeneradora hepática'],
  
  // Sistema Cardiovascular
  'hipertension': ['Hipotensora', 'Vasodilatadora', 'Diurética', 'Relajante'],
  'arritmia': ['Cardiotónica', 'Sedante', 'Antiarrítmica'],
  'varices': ['Venotónica', 'Antiinflamatoria', 'Circulatoria'],
  'anemia': ['Rica en hierro', 'Hematopoyética', 'Nutritiva'],
  'colesterol': ['Hipolipemiante', 'Antioxidante', 'Fibra'],
  'aterosclerosis': ['Antioxidante', 'Hipolipemiante', 'Antiinflamatoria'],
  
  // Sistema Nervioso
  'insomnio': ['Sedante', 'Hipnótica', 'Relajante', 'Ansiolítica'],
  'ansiedad': ['Ansiolítica', 'Sedante', 'Relajante', 'Calmante'],
  'estres': ['Adaptógena', 'Relajante', 'Ansiolítica', 'Tónica'],
  'depresion': ['Antidepresiva', 'Tónica nerviosa', 'Adaptógena'],
  'migrana': ['Analgésica', 'Vasodilatadora', 'Antiinflamatoria'],
  'dolor de cabeza': ['Analgésica', 'Relajante', 'Antiinflamatoria'],
  'neuralgia': ['Analgésica', 'Antiinflamatoria', 'Antineurálgica'],
  'vertigo': ['Circulatoria cerebral', 'Tónica', 'Vasodilatadora'],
  
  // Sistema Inmunológico
  'alergia': ['Antihistamínica', 'Antiinflamatoria', 'Inmunomoduladora'],
  'infeccion': ['Antibacteriana', 'Antiviral', 'Inmunoestimulante'],
  'inflamacion': ['Antiinflamatoria', 'Analgésica', 'Antioxidante'],
  
  // Sistema Endocrino
  'diabetes': ['Hipoglucemiante', 'Reguladora metabólica', 'Antioxidante'],
  'hipotiroidismo': ['Estimulante tiroideo', 'Rica en yodo', 'Tónica'],
  'hipertiroidismo': ['Sedante', 'Reguladora tiroidea'],
  'obesidad': ['Termogénica', 'Saciante', 'Diurética', 'Lipolítica'],
  
  // Sistema Musculoesquelético
  'artritis': ['Antiinflamatoria', 'Analgésica', 'Antirreumática'],
  'artrosis': ['Antiinflamatoria', 'Regeneradora cartílago', 'Analgésica'],
  'dolor muscular': ['Relajante muscular', 'Analgésica', 'Antiinflamatoria'],
  'lumbalgia': ['Analgésica', 'Antiinflamatoria', 'Relajante muscular'],
  'osteoporosis': ['Rica en calcio', 'Mineralizante', 'Tónica ósea'],
  'fibromialgia': ['Analgésica', 'Relajante', 'Antiinflamatoria'],
  
  // Sistema Urinario
  'cistitis': ['Antiséptica urinaria', 'Diurética', 'Antiinflamatoria'],
  'calculos renales': ['Diurética', 'Litolítica', 'Antiséptica'],
  'incontinencia': ['Astringente', 'Tónica', 'Antiespasmódica'],
  'prostatitis': ['Antiinflamatoria', 'Diurética', 'Antiséptica'],
  
  // Sistema Reproductor
  'dismenorrea': ['Antiespasmódica', 'Analgésica', 'Emenagoga'],
  'menopausia': ['Fitoestrógenos', 'Reguladora hormonal', 'Sedante'],
  'sindrome premenstrual': ['Reguladora hormonal', 'Antiespasmódica', 'Sedante'],
  
  // Piel
  'acne': ['Antibacteriana', 'Astringente', 'Depurativa', 'Antiinflamatoria'],
  'eczema': ['Antiinflamatoria', 'Emoliente', 'Antipruriginosa'],
  'psoriasis': ['Antiinflamatoria', 'Inmunomoduladora', 'Emoliente'],
  'herida': ['Cicatrizante', 'Antiséptica', 'Regeneradora'],
  'quemadura': ['Cicatrizante', 'Emoliente', 'Refrescante'],
  'hongos': ['Antifúngica', 'Antiséptica', 'Antimicrobiana'],
  
  // Trastornos mentales
  'nerviosismo': ['Sedante', 'Relajante', 'Ansiolítica'],
  'irritabilidad': ['Calmante', 'Sedante', 'Adaptógena'],
  'fatiga': ['Tónica', 'Energizante', 'Adaptógena', 'Estimulante'],
};

// Función para obtener plantas recomendadas para una enfermedad
export const getPlantasParaEnfermedad = (enfermedad: EnfermedadExpandida): PlantaExpandida[] => {
  const todasLasPlantas = getAllPlantas();
  const nombreLower = enfermedad.nombre.toLowerCase();
  const descripcionLower = enfermedad.descripcion.toLowerCase();
  
  // Buscar propiedades relevantes basadas en palabras clave de la enfermedad
  let propiedadesRelevantes: string[] = [];
  
  for (const [keyword, props] of Object.entries(enfermedadToPropiedades)) {
    if (nombreLower.includes(keyword) || descripcionLower.includes(keyword)) {
      propiedadesRelevantes = [...propiedadesRelevantes, ...props];
    }
  }
  
  // Si no encontramos propiedades específicas, usar las del sistema
  if (propiedadesRelevantes.length === 0) {
    // Obtener plantas del sistema relacionado
    return getPlantasBySistema(enfermedad.sistemaId).slice(0, 6);
  }
  
  // Filtrar plantas que tengan propiedades relevantes
  const plantasRelevantes = todasLasPlantas.filter(planta => {
    const propiedadesPlanta = planta.propiedades.map(p => p.toLowerCase());
    return propiedadesRelevantes.some(propReq => 
      propiedadesPlanta.some(propPlanta => 
        propPlanta.includes(propReq.toLowerCase()) || 
        propReq.toLowerCase().includes(propPlanta)
      )
    );
  });
  
  // Si hay pocas plantas, complementar con plantas del sistema
  if (plantasRelevantes.length < 3) {
    const plantasSistema = getPlantasBySistema(enfermedad.sistemaId);
    const idsExistentes = new Set(plantasRelevantes.map(p => p.id));
    const plantasAdicionales = plantasSistema.filter(p => !idsExistentes.has(p.id));
    return [...plantasRelevantes, ...plantasAdicionales].slice(0, 6);
  }
  
  return plantasRelevantes.slice(0, 6);
};

// Función para obtener enfermedades que una planta puede ayudar a tratar
export const getEnfermedadesParaPlanta = (planta: PlantaExpandida): EnfermedadExpandida[] => {
  const todasLasEnfermedades = getAllEnfermedades();
  const propiedadesPlanta = planta.propiedades.map(p => p.toLowerCase());
  
  // Buscar enfermedades cuyos keywords coincidan con las propiedades de la planta
  const enfermedadesRelevantes: EnfermedadExpandida[] = [];
  
  for (const enfermedad of todasLasEnfermedades) {
    // Verificar si la enfermedad está en un sistema relacionado
    if (!planta.sistemasRelacionados.includes(enfermedad.sistemaId)) {
      continue;
    }
    
    const nombreLower = enfermedad.nombre.toLowerCase();
    const descripcionLower = enfermedad.descripcion.toLowerCase();
    
    // Buscar coincidencias con el mapeo
    for (const [keyword, props] of Object.entries(enfermedadToPropiedades)) {
      if (nombreLower.includes(keyword) || descripcionLower.includes(keyword)) {
        // Verificar si la planta tiene alguna de las propiedades requeridas
        const tienePropiedad = props.some(propReq =>
          propiedadesPlanta.some(propPlanta =>
            propPlanta.includes(propReq.toLowerCase()) ||
            propReq.toLowerCase().includes(propPlanta)
          )
        );
        
        if (tienePropiedad && !enfermedadesRelevantes.find(e => e.id === enfermedad.id)) {
          enfermedadesRelevantes.push(enfermedad);
          break;
        }
      }
    }
  }
  
  // Si hay pocas enfermedades, agregar algunas del sistema
  if (enfermedadesRelevantes.length < 5) {
    for (const sistemaId of planta.sistemasRelacionados) {
      const enfermedadesSistema = todasLasEnfermedades.filter(e => e.sistemaId === sistemaId);
      for (const enf of enfermedadesSistema) {
        if (!enfermedadesRelevantes.find(e => e.id === enf.id)) {
          enfermedadesRelevantes.push(enf);
          if (enfermedadesRelevantes.length >= 8) break;
        }
      }
      if (enfermedadesRelevantes.length >= 8) break;
    }
  }
  
  return enfermedadesRelevantes.slice(0, 8);
};

// Función para obtener el motivo de recomendación de una planta para una enfermedad
export const getMotivoRecomendacion = (planta: PlantaExpandida, enfermedad: EnfermedadExpandida): string => {
  const nombreLower = enfermedad.nombre.toLowerCase();
  const descripcionLower = enfermedad.descripcion.toLowerCase();
  
  for (const [keyword, props] of Object.entries(enfermedadToPropiedades)) {
    if (nombreLower.includes(keyword) || descripcionLower.includes(keyword)) {
      const propiedadesCoincidentes = planta.propiedades.filter(propPlanta =>
        props.some(propReq =>
          propPlanta.toLowerCase().includes(propReq.toLowerCase()) ||
          propReq.toLowerCase().includes(propPlanta.toLowerCase())
        )
      );
      
      if (propiedadesCoincidentes.length > 0) {
        return `Propiedades: ${propiedadesCoincidentes.slice(0, 3).join(', ')}`;
      }
    }
  }
  
  return `Propiedades: ${planta.propiedades.slice(0, 3).join(', ')}`;
};

// Exportar tipos para uso externo
export type { EnfermedadExpandida, PlantaExpandida };
