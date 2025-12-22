// Pócima Salvage - Base de datos de plantas medicinales y enfermedades

export interface Planta {
  id: string;
  nombre: string;
  nombreCientifico: string;
  propiedades: string[];
  parteUsable: string;
  dosis: string;
  preparacion: string;
  fuente: string;
  contraindicaciones: Contraindicacion[];
  descripcion: string;
}

export interface Contraindicacion {
  tipo: "embarazo" | "ninos" | "hipertension" | "diabetes" | "lactancia" | "alergia" | "medicamentos" | "otro";
  descripcion: string;
}

export interface Enfermedad {
  id: string;
  nombre: string;
  descripcion: string;
  plantasRecomendadas: {
    plantaId: string;
    razon: string;
  }[];
}

export const plantas: Planta[] = [
  {
    id: "manzanilla",
    nombre: "Manzanilla",
    nombreCientifico: "Matricaria chamomilla",
    propiedades: ["Digestiva", "Calmante", "Antiinflamatoria", "Antiespasmódica"],
    parteUsable: "Flores secas",
    dosis: "1-2 cucharaditas de flores secas por taza de agua, 2-3 veces al día",
    preparacion: "Infusión: Verter agua caliente sobre las flores y dejar reposar 5-10 minutos. Colar y beber tibio.",
    fuente: "Organización Mundial de la Salud (OMS) - Monografías de plantas medicinales",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "No usar durante el embarazo sin supervisión médica" },
      { tipo: "alergia", descripcion: "Evitar si hay alergia a plantas de la familia Asteraceae" },
      { tipo: "medicamentos", descripcion: "Puede interactuar con anticoagulantes" }
    ],
    descripcion: "Planta herbácea conocida por sus propiedades calmantes y digestivas. Una de las hierbas medicinales más utilizadas en el mundo."
  },
  {
    id: "valeriana",
    nombre: "Valeriana",
    nombreCientifico: "Valeriana officinalis",
    propiedades: ["Sedante", "Ansiolítica", "Relajante muscular", "Inductora del sueño"],
    parteUsable: "Raíz seca",
    dosis: "300-600 mg de extracto de raíz, 30 minutos antes de dormir",
    preparacion: "Infusión: 2-3 g de raíz seca en agua caliente por 10-15 minutos. También disponible en cápsulas.",
    fuente: "European Medicines Agency (EMA) - Monografía comunitaria",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "No usar durante embarazo y lactancia" },
      { tipo: "ninos", descripcion: "No recomendado para menores de 12 años" },
      { tipo: "medicamentos", descripcion: "No combinar con sedantes, alcohol o medicamentos para dormir" }
    ],
    descripcion: "Planta con potentes efectos sedantes naturales, ideal para tratar el insomnio y la ansiedad de forma natural."
  },
  {
    id: "jengibre",
    nombre: "Jengibre",
    nombreCientifico: "Zingiber officinale",
    propiedades: ["Antiemético", "Digestivo", "Antiinflamatorio", "Analgésico"],
    parteUsable: "Rizoma (raíz)",
    dosis: "1-2 g de jengibre fresco o 0.5-1 g de polvo seco al día",
    preparacion: "Infusión: Rallar 1 cm de raíz fresca en agua caliente por 10 minutos. También se puede masticar directamente.",
    fuente: "National Center for Complementary and Integrative Health (NCCIH)",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "Usar con precaución durante el embarazo (consultar médico)" },
      { tipo: "medicamentos", descripcion: "Puede interactuar con anticoagulantes y medicamentos para diabetes" },
      { tipo: "otro", descripcion: "Evitar en caso de cálculos biliares" }
    ],
    descripcion: "Rizoma con potentes propiedades antiinflamatorias y digestivas. Excelente para náuseas y problemas estomacales."
  },
  {
    id: "eucalipto",
    nombre: "Eucalipto",
    nombreCientifico: "Eucalyptus globulus",
    propiedades: ["Expectorante", "Descongestionante", "Antiséptico", "Febrífugo"],
    parteUsable: "Hojas",
    dosis: "2-3 g de hojas secas en infusión, 2-3 veces al día",
    preparacion: "Inhalación: Hervir hojas y respirar el vapor. Infusión: Hojas en agua caliente por 10 minutos.",
    fuente: "Farmacopea Europea",
    contraindicaciones: [
      { tipo: "ninos", descripcion: "No usar en niños menores de 6 años" },
      { tipo: "embarazo", descripcion: "Evitar durante embarazo y lactancia" },
      { tipo: "otro", descripcion: "No aplicar aceite esencial puro en la piel ni ingerir" }
    ],
    descripcion: "Árbol originario de Australia, sus hojas son muy efectivas para problemas respiratorios y congestión nasal."
  },
  {
    id: "menta",
    nombre: "Menta",
    nombreCientifico: "Mentha piperita",
    propiedades: ["Digestiva", "Refrescante", "Antiespasmódica", "Analgésica"],
    parteUsable: "Hojas frescas o secas",
    dosis: "1-2 cucharaditas de hojas por taza, hasta 3 veces al día",
    preparacion: "Infusión: Verter agua caliente sobre las hojas, reposar 5-7 minutos. Servir caliente o frío.",
    fuente: "German Commission E Monographs",
    contraindicaciones: [
      { tipo: "ninos", descripcion: "No usar aceite esencial en niños menores de 2 años" },
      { tipo: "otro", descripcion: "Evitar en caso de reflujo gastroesofágico o hernia hiatal" },
      { tipo: "lactancia", descripcion: "Puede reducir la producción de leche materna" }
    ],
    descripcion: "Hierba aromática muy versátil, excelente para problemas digestivos y dolores de cabeza."
  },
  {
    id: "tilo",
    nombre: "Tilo",
    nombreCientifico: "Tilia cordata",
    propiedades: ["Sedante suave", "Diaforético", "Antiespasmódico", "Hipotensor"],
    parteUsable: "Flores y brácteas",
    dosis: "2-4 g de flores secas en infusión, 2-3 veces al día",
    preparacion: "Infusión: Verter agua caliente sobre las flores, dejar reposar 10 minutos. Endulzar con miel si se desea.",
    fuente: "Organización Mundial de la Salud (OMS)",
    contraindicaciones: [
      { tipo: "hipertension", descripcion: "Usar con precaución si toma medicamentos para la presión" },
      { tipo: "otro", descripcion: "Puede causar somnolencia, no conducir después de consumir" }
    ],
    descripcion: "Árbol cuyas flores tienen propiedades calmantes y son ideales para reducir el estrés y la ansiedad."
  },
  {
    id: "romero",
    nombre: "Romero",
    nombreCientifico: "Rosmarinus officinalis",
    propiedades: ["Estimulante circulatorio", "Antioxidante", "Digestivo", "Tónico cerebral"],
    parteUsable: "Hojas y sumidades floridas",
    dosis: "2-4 g de hojas secas en infusión, 2-3 veces al día",
    preparacion: "Infusión: Hojas en agua caliente por 10-15 minutos. También se usa en aceite para masajes.",
    fuente: "European Scientific Cooperative on Phytotherapy (ESCOP)",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "No usar en dosis medicinales durante el embarazo" },
      { tipo: "hipertension", descripcion: "Puede elevar la presión arterial en dosis altas" },
      { tipo: "otro", descripcion: "Evitar en epilepsia" }
    ],
    descripcion: "Arbusto aromático mediterráneo con propiedades estimulantes y beneficios para la memoria y circulación."
  },
  {
    id: "lavanda",
    nombre: "Lavanda",
    nombreCientifico: "Lavandula angustifolia",
    propiedades: ["Relajante", "Ansiolítica", "Antiséptica", "Cicatrizante"],
    parteUsable: "Flores",
    dosis: "1-2 cucharaditas de flores secas por taza, 2-3 veces al día",
    preparacion: "Infusión: Flores en agua caliente por 5-10 minutos. Aromaterapia: Inhalar aceite esencial.",
    fuente: "British Herbal Pharmacopoeia",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "Evitar aceite esencial durante el primer trimestre" },
      { tipo: "ninos", descripcion: "No aplicar aceite esencial puro en niños pequeños" }
    ],
    descripcion: "Planta aromática con potentes efectos relajantes, ideal para el estrés, ansiedad e insomnio."
  },
  {
    id: "aloe-vera",
    nombre: "Aloe Vera",
    nombreCientifico: "Aloe barbadensis miller",
    propiedades: ["Cicatrizante", "Hidratante", "Antiinflamatorio", "Laxante (gel interno)"],
    parteUsable: "Gel de las hojas (uso externo), látex (uso interno con precaución)",
    dosis: "Uso externo: Aplicar gel directamente. Uso interno: Solo bajo supervisión médica",
    preparacion: "Cortar una hoja, extraer el gel transparente y aplicar directamente sobre la piel.",
    fuente: "World Health Organization (WHO) Monographs",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "No ingerir durante embarazo (puede causar contracciones)" },
      { tipo: "ninos", descripcion: "No administrar internamente a niños" },
      { tipo: "otro", descripcion: "El látex (parte amarilla) es un laxante potente, usar con precaución" }
    ],
    descripcion: "Planta suculenta con gel altamente hidratante y cicatrizante, excelente para quemaduras y problemas de piel."
  },
  {
    id: "calendula",
    nombre: "Caléndula",
    nombreCientifico: "Calendula officinalis",
    propiedades: ["Cicatrizante", "Antiinflamatoria", "Antiséptica", "Emoliente"],
    parteUsable: "Flores",
    dosis: "1-2 cucharaditas de flores secas por taza para uso interno, o preparar ungüento para uso externo",
    preparacion: "Infusión: Flores en agua caliente por 10 minutos. Uso externo: Preparar aceite o ungüento.",
    fuente: "European Medicines Agency (EMA)",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "No usar internamente durante el embarazo" },
      { tipo: "alergia", descripcion: "Evitar si hay alergia a plantas de la familia Asteraceae" }
    ],
    descripcion: "Flor con extraordinarias propiedades para la piel, ideal para heridas, quemaduras y problemas cutáneos."
  },
  {
    id: "boldo",
    nombre: "Boldo",
    nombreCientifico: "Peumus boldus",
    propiedades: ["Hepatoprotector", "Digestivo", "Colerético", "Antiespasmódico"],
    parteUsable: "Hojas secas",
    dosis: "1-2 g de hojas secas en infusión, después de las comidas",
    preparacion: "Infusión: Hojas en agua caliente por 10 minutos. No hervir las hojas directamente.",
    fuente: "Farmacopea Latinoamericana",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "Contraindicado durante embarazo y lactancia" },
      { tipo: "otro", descripcion: "No usar en obstrucción de vías biliares o enfermedades hepáticas graves" },
      { tipo: "medicamentos", descripcion: "Puede interactuar con anticoagulantes" }
    ],
    descripcion: "Árbol chileno cuyas hojas son excelentes para la digestión y la salud del hígado."
  },
  {
    id: "oregano",
    nombre: "Orégano",
    nombreCientifico: "Origanum vulgare",
    propiedades: ["Antibacteriano", "Antioxidante", "Expectorante", "Digestivo"],
    parteUsable: "Hojas y sumidades floridas",
    dosis: "1-2 cucharaditas de hojas secas por taza, 2-3 veces al día",
    preparacion: "Infusión: Hojas en agua caliente por 10 minutos. También se usa como condimento.",
    fuente: "Journal of Medicinal Food - Estudios científicos",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "Evitar en dosis medicinales durante el embarazo" },
      { tipo: "medicamentos", descripcion: "Puede interactuar con anticoagulantes y medicamentos para diabetes" }
    ],
    descripcion: "Hierba aromática con potentes propiedades antibacterianas, útil para infecciones respiratorias."
  },
  {
    id: "salvia",
    nombre: "Salvia",
    nombreCientifico: "Salvia officinalis",
    propiedades: ["Antiséptica", "Astringente", "Antitranspirante", "Digestiva"],
    parteUsable: "Hojas",
    dosis: "1-2 g de hojas secas en infusión, 2-3 veces al día",
    preparacion: "Infusión: Hojas en agua caliente por 10 minutos. Gárgaras para dolor de garganta.",
    fuente: "German Commission E Monographs",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "Contraindicado durante embarazo y lactancia" },
      { tipo: "otro", descripcion: "No usar en epilepsia" },
      { tipo: "hipertension", descripcion: "Usar con precaución en hipertensión" }
    ],
    descripcion: "Hierba mediterránea con propiedades antisépticas, ideal para problemas de garganta y sudoración excesiva."
  },
  {
    id: "tomillo",
    nombre: "Tomillo",
    nombreCientifico: "Thymus vulgaris",
    propiedades: ["Antiséptico", "Expectorante", "Antitusivo", "Antibacteriano"],
    parteUsable: "Hojas y sumidades floridas",
    dosis: "1-2 g de hierba seca por taza, 3-4 veces al día",
    preparacion: "Infusión: Hierba en agua caliente por 10 minutos. Ideal con miel para la tos.",
    fuente: "European Scientific Cooperative on Phytotherapy (ESCOP)",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "Evitar en dosis medicinales durante el embarazo" },
      { tipo: "hipertension", descripcion: "El aceite esencial puede elevar la presión" },
      { tipo: "ninos", descripcion: "No usar aceite esencial en niños pequeños" }
    ],
    descripcion: "Hierba aromática muy efectiva para problemas respiratorios, tos y resfriados."
  },
  {
    id: "hierba-luisa",
    nombre: "Hierba Luisa",
    nombreCientifico: "Aloysia citrodora",
    propiedades: ["Digestiva", "Carminativa", "Sedante suave", "Antiespasmódica"],
    parteUsable: "Hojas",
    dosis: "1-2 cucharaditas de hojas secas por taza, después de las comidas",
    preparacion: "Infusión: Hojas en agua caliente por 5-10 minutos. Sabor agradable a limón.",
    fuente: "Farmacopea Argentina",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "Usar con moderación durante el embarazo" },
      { tipo: "otro", descripcion: "En dosis muy altas puede causar irritación gástrica" }
    ],
    descripcion: "Planta aromática con delicioso aroma a limón, excelente para la digestión y relajación."
  },
  {
    id: "pasiflora",
    nombre: "Pasiflora",
    nombreCientifico: "Passiflora incarnata",
    propiedades: ["Ansiolítica", "Sedante", "Antiespasmódica", "Hipnótica suave"],
    parteUsable: "Partes aéreas (hojas, tallos, flores)",
    dosis: "1-2 g de hierba seca en infusión, 2-3 veces al día o antes de dormir",
    preparacion: "Infusión: Hierba seca en agua caliente por 10-15 minutos. También en extracto líquido.",
    fuente: "European Medicines Agency (EMA)",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "No usar durante embarazo y lactancia" },
      { tipo: "ninos", descripcion: "No recomendado para menores de 12 años" },
      { tipo: "medicamentos", descripcion: "No combinar con sedantes o ansiolíticos" }
    ],
    descripcion: "Planta trepadora con potentes efectos calmantes, ideal para ansiedad e insomnio."
  },
  {
    id: "diente-leon",
    nombre: "Diente de León",
    nombreCientifico: "Taraxacum officinale",
    propiedades: ["Diurético", "Depurativo", "Digestivo", "Hepatoprotector"],
    parteUsable: "Hojas y raíz",
    dosis: "3-5 g de raíz seca o 4-10 g de hojas secas al día",
    preparacion: "Infusión de hojas: 10 minutos. Decocción de raíz: Hervir 10-15 minutos.",
    fuente: "British Herbal Pharmacopoeia",
    contraindicaciones: [
      { tipo: "otro", descripcion: "Evitar en obstrucción de vías biliares" },
      { tipo: "alergia", descripcion: "Evitar si hay alergia a plantas de la familia Asteraceae" },
      { tipo: "medicamentos", descripcion: "Puede interactuar con diuréticos y medicamentos para diabetes" }
    ],
    descripcion: "Planta silvestre con excelentes propiedades depurativas y beneficios para el hígado y riñones."
  },
  {
    id: "cola-caballo",
    nombre: "Cola de Caballo",
    nombreCientifico: "Equisetum arvense",
    propiedades: ["Diurético", "Remineralizante", "Cicatrizante", "Astringente"],
    parteUsable: "Tallos estériles",
    dosis: "2-3 g de hierba seca en infusión, 2-3 veces al día",
    preparacion: "Decocción: Hervir la hierba por 15-20 minutos para extraer los minerales.",
    fuente: "German Commission E Monographs",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "No usar durante embarazo y lactancia" },
      { tipo: "otro", descripcion: "No usar en insuficiencia renal o cardíaca" },
      { tipo: "medicamentos", descripcion: "Puede reducir los niveles de potasio con uso prolongado" }
    ],
    descripcion: "Planta primitiva rica en sílice y minerales, excelente para retención de líquidos y salud ósea."
  },
  {
    id: "hinojo",
    nombre: "Hinojo",
    nombreCientifico: "Foeniculum vulgare",
    propiedades: ["Carminativo", "Digestivo", "Galactogogo", "Antiespasmódico"],
    parteUsable: "Semillas (frutos)",
    dosis: "1-2 cucharaditas de semillas machacadas por taza, 2-3 veces al día",
    preparacion: "Infusión: Machacar ligeramente las semillas, verter agua caliente y reposar 10 minutos.",
    fuente: "European Scientific Cooperative on Phytotherapy (ESCOP)",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "Evitar en dosis medicinales durante el embarazo" },
      { tipo: "alergia", descripcion: "Evitar si hay alergia al anís o plantas de la familia Apiaceae" },
      { tipo: "otro", descripcion: "El aceite esencial no debe usarse en epilepsia" }
    ],
    descripcion: "Planta aromática con semillas muy efectivas para gases, cólicos y problemas digestivos."
  },
  {
    id: "equinacea",
    nombre: "Equinácea",
    nombreCientifico: "Echinacea purpurea",
    propiedades: ["Inmunoestimulante", "Antibacteriana", "Antiviral", "Antiinflamatoria"],
    parteUsable: "Raíz y partes aéreas",
    dosis: "300-500 mg de extracto seco, 3 veces al día durante máximo 10 días",
    preparacion: "Infusión: 1 g de raíz seca en agua caliente por 10 minutos. Disponible en cápsulas y tintura.",
    fuente: "European Medicines Agency (EMA)",
    contraindicaciones: [
      { tipo: "embarazo", descripcion: "No recomendado durante embarazo y lactancia" },
      { tipo: "otro", descripcion: "Evitar en enfermedades autoinmunes (lupus, esclerosis múltiple)" },
      { tipo: "alergia", descripcion: "Evitar si hay alergia a plantas de la familia Asteraceae" }
    ],
    descripcion: "Planta norteamericana que fortalece el sistema inmunológico, ideal para prevenir resfriados."
  }
];

export const enfermedades: Enfermedad[] = [
  {
    id: "dolor-cabeza",
    nombre: "Dolor de Cabeza",
    descripcion: "Molestia o dolor en cualquier parte de la cabeza, puede ser tensional, migraña o por otras causas.",
    plantasRecomendadas: [
      { plantaId: "menta", razon: "El mentol tiene propiedades analgésicas y refrescantes que alivian la tensión" },
      { plantaId: "lavanda", razon: "Sus propiedades relajantes ayudan a reducir el estrés que causa cefaleas tensionales" },
      { plantaId: "jengibre", razon: "Tiene efectos antiinflamatorios y puede ayudar con las migrañas" },
      { plantaId: "manzanilla", razon: "Relaja los músculos y reduce la tensión asociada al dolor de cabeza" }
    ]
  },
  {
    id: "insomnio",
    nombre: "Insomnio",
    descripcion: "Dificultad para conciliar el sueño, mantenerlo o despertar demasiado temprano.",
    plantasRecomendadas: [
      { plantaId: "valeriana", razon: "Potente sedante natural que mejora la calidad del sueño" },
      { plantaId: "pasiflora", razon: "Reduce la ansiedad y facilita el sueño sin causar somnolencia al despertar" },
      { plantaId: "tilo", razon: "Sedante suave ideal para el insomnio leve" },
      { plantaId: "lavanda", razon: "La aromaterapia con lavanda mejora la calidad del sueño" },
      { plantaId: "manzanilla", razon: "Relajante suave que prepara el cuerpo para dormir" }
    ]
  },
  {
    id: "ansiedad",
    nombre: "Ansiedad y Estrés",
    descripcion: "Estado de preocupación excesiva, nerviosismo y tensión que afecta la vida diaria.",
    plantasRecomendadas: [
      { plantaId: "pasiflora", razon: "Ansiolítico natural que calma sin causar dependencia" },
      { plantaId: "valeriana", razon: "Reduce la ansiedad y la tensión nerviosa" },
      { plantaId: "lavanda", razon: "Efecto calmante comprobado en aromaterapia e infusión" },
      { plantaId: "tilo", razon: "Sedante suave que reduce el estrés" },
      { plantaId: "manzanilla", razon: "Relajante que ayuda a calmar los nervios" }
    ]
  },
  {
    id: "digestion",
    nombre: "Mala Digestión",
    descripcion: "Sensación de pesadez, hinchazón o malestar después de comer.",
    plantasRecomendadas: [
      { plantaId: "manzanilla", razon: "Antiespasmódica y digestiva, alivia la pesadez estomacal" },
      { plantaId: "menta", razon: "Estimula la producción de bilis y mejora la digestión" },
      { plantaId: "boldo", razon: "Excelente para la digestión de grasas y función hepática" },
      { plantaId: "hinojo", razon: "Reduce gases y mejora el proceso digestivo" },
      { plantaId: "hierba-luisa", razon: "Carminativa que alivia la hinchazón" }
    ]
  },
  {
    id: "gases",
    nombre: "Gases y Flatulencia",
    descripcion: "Acumulación excesiva de aire en el sistema digestivo que causa molestias.",
    plantasRecomendadas: [
      { plantaId: "hinojo", razon: "Uno de los mejores carminativos naturales" },
      { plantaId: "menta", razon: "Relaja los músculos del tracto digestivo facilitando la expulsión de gases" },
      { plantaId: "manzanilla", razon: "Antiespasmódica que reduce la formación de gases" },
      { plantaId: "hierba-luisa", razon: "Carminativa suave y de sabor agradable" }
    ]
  },
  {
    id: "resfriado",
    nombre: "Resfriado y Gripe",
    descripcion: "Infección viral de las vías respiratorias superiores con congestión, tos y malestar general.",
    plantasRecomendadas: [
      { plantaId: "eucalipto", razon: "Descongestionante y expectorante, alivia la congestión nasal" },
      { plantaId: "tomillo", razon: "Antiséptico respiratorio que combate la infección" },
      { plantaId: "equinacea", razon: "Fortalece el sistema inmunológico y acorta la duración del resfriado" },
      { plantaId: "jengibre", razon: "Antiinflamatorio que alivia el malestar general" }
    ]
  },
  {
    id: "tos",
    nombre: "Tos",
    descripcion: "Reflejo que ayuda a limpiar las vías respiratorias, puede ser seca o productiva.",
    plantasRecomendadas: [
      { plantaId: "tomillo", razon: "Antitusivo y expectorante natural muy efectivo" },
      { plantaId: "eucalipto", razon: "Facilita la expectoración y calma la tos" },
      { plantaId: "oregano", razon: "Propiedades antibacterianas que ayudan con infecciones respiratorias" },
      { plantaId: "menta", razon: "El mentol calma la irritación de garganta" }
    ]
  },
  {
    id: "dolor-garganta",
    nombre: "Dolor de Garganta",
    descripcion: "Irritación, dolor o picazón en la garganta, común en infecciones respiratorias.",
    plantasRecomendadas: [
      { plantaId: "salvia", razon: "Antiséptica y astringente, ideal para gárgaras" },
      { plantaId: "tomillo", razon: "Antibacteriano que combate la infección" },
      { plantaId: "manzanilla", razon: "Antiinflamatoria que calma la irritación" },
      { plantaId: "menta", razon: "Refrescante que alivia el dolor" }
    ]
  },
  {
    id: "nauseas",
    nombre: "Náuseas y Vómitos",
    descripcion: "Sensación de malestar estomacal con ganas de vomitar.",
    plantasRecomendadas: [
      { plantaId: "jengibre", razon: "Antiemético natural muy efectivo, incluso para náuseas del embarazo (consultar médico)" },
      { plantaId: "menta", razon: "Calma el estómago y reduce las náuseas" },
      { plantaId: "manzanilla", razon: "Suave y efectiva para el malestar estomacal" }
    ]
  },
  {
    id: "retencion-liquidos",
    nombre: "Retención de Líquidos",
    descripcion: "Acumulación excesiva de líquidos en los tejidos del cuerpo, causando hinchazón.",
    plantasRecomendadas: [
      { plantaId: "cola-caballo", razon: "Diurético natural que ayuda a eliminar el exceso de líquidos" },
      { plantaId: "diente-leon", razon: "Diurético suave que no depleta el potasio" },
      { plantaId: "hinojo", razon: "Ayuda a reducir la retención de líquidos" }
    ]
  },
  {
    id: "quemaduras-piel",
    nombre: "Quemaduras Leves y Problemas de Piel",
    descripcion: "Lesiones en la piel por calor, sol o irritaciones menores.",
    plantasRecomendadas: [
      { plantaId: "aloe-vera", razon: "Cicatrizante e hidratante excepcional para quemaduras" },
      { plantaId: "calendula", razon: "Regeneradora de la piel y antiinflamatoria" },
      { plantaId: "lavanda", razon: "Antiséptica y calmante para irritaciones" }
    ]
  },
  {
    id: "heridas",
    nombre: "Heridas y Cortes Menores",
    descripcion: "Lesiones superficiales de la piel que requieren cicatrización.",
    plantasRecomendadas: [
      { plantaId: "calendula", razon: "Excelente cicatrizante y antiséptica" },
      { plantaId: "aloe-vera", razon: "Acelera la regeneración de la piel" },
      { plantaId: "romero", razon: "Antiséptico que previene infecciones" }
    ]
  },
  {
    id: "circulacion",
    nombre: "Mala Circulación",
    descripcion: "Flujo sanguíneo deficiente que causa piernas cansadas, frío en extremidades.",
    plantasRecomendadas: [
      { plantaId: "romero", razon: "Estimulante circulatorio que mejora el flujo sanguíneo" },
      { plantaId: "jengibre", razon: "Mejora la circulación periférica" }
    ]
  },
  {
    id: "higado",
    nombre: "Problemas Hepáticos Leves",
    descripcion: "Malestar relacionado con la función del hígado, digestión de grasas.",
    plantasRecomendadas: [
      { plantaId: "boldo", razon: "Hepatoprotector que mejora la función del hígado" },
      { plantaId: "diente-leon", razon: "Depurativo que apoya la función hepática" },
      { plantaId: "romero", razon: "Estimula la producción de bilis" }
    ]
  },
  {
    id: "sudoracion",
    nombre: "Sudoración Excesiva",
    descripcion: "Producción excesiva de sudor, especialmente nocturno o por menopausia.",
    plantasRecomendadas: [
      { plantaId: "salvia", razon: "Antitranspirante natural muy efectivo" }
    ]
  },
  {
    id: "colicos",
    nombre: "Cólicos y Espasmos",
    descripcion: "Contracciones dolorosas de los músculos del abdomen o útero.",
    plantasRecomendadas: [
      { plantaId: "manzanilla", razon: "Antiespasmódica que relaja los músculos" },
      { plantaId: "menta", razon: "Alivia los espasmos del tracto digestivo" },
      { plantaId: "hinojo", razon: "Reduce los cólicos, especialmente en bebés (consultar pediatra)" },
      { plantaId: "hierba-luisa", razon: "Antiespasmódica suave" }
    ]
  },
  {
    id: "memoria",
    nombre: "Falta de Concentración y Memoria",
    descripcion: "Dificultad para mantener la atención o recordar información.",
    plantasRecomendadas: [
      { plantaId: "romero", razon: "Tónico cerebral que mejora la memoria y concentración" },
      { plantaId: "menta", razon: "Estimulante mental que aumenta el estado de alerta" }
    ]
  },
  {
    id: "defensas",
    nombre: "Sistema Inmune Débil",
    descripcion: "Tendencia a enfermarse frecuentemente, defensas bajas.",
    plantasRecomendadas: [
      { plantaId: "equinacea", razon: "Inmunoestimulante que fortalece las defensas naturales" },
      { plantaId: "jengibre", razon: "Propiedades antimicrobianas que apoyan el sistema inmune" }
    ]
  }
];

// Función auxiliar para obtener una planta por ID
export const getPlantaById = (id: string): Planta | undefined => {
  return plantas.find(p => p.id === id);
};

// Función auxiliar para obtener una enfermedad por ID
export const getEnfermedadById = (id: string): Enfermedad | undefined => {
  return enfermedades.find(e => e.id === id);
};

// Función para buscar plantas
export const buscarPlantas = (query: string): Planta[] => {
  const q = query.toLowerCase();
  return plantas.filter(p => 
    p.nombre.toLowerCase().includes(q) ||
    p.nombreCientifico.toLowerCase().includes(q) ||
    p.propiedades.some(prop => prop.toLowerCase().includes(q))
  );
};

// Función para buscar enfermedades
export const buscarEnfermedades = (query: string): Enfermedad[] => {
  const q = query.toLowerCase();
  return enfermedades.filter(e => 
    e.nombre.toLowerCase().includes(q) ||
    e.descripcion.toLowerCase().includes(q)
  );
};

// Mapeo de iconos para contraindicaciones
export const contraindicacionIconos: Record<Contraindicacion["tipo"], string> = {
  embarazo: "🤰",
  ninos: "👶",
  hipertension: "❤️‍🩹",
  diabetes: "🩸",
  lactancia: "🍼",
  alergia: "🤧",
  medicamentos: "💊",
  otro: "⚠️"
};

export const contraindicacionLabels: Record<Contraindicacion["tipo"], string> = {
  embarazo: "Embarazo",
  ninos: "Niños",
  hipertension: "Hipertensión",
  diabetes: "Diabetes",
  lactancia: "Lactancia",
  alergia: "Alergias",
  medicamentos: "Medicamentos",
  otro: "Precaución"
};
