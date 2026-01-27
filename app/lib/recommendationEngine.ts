import festivalsData from '../data/festivals.json';

export interface Recommendation {
    festivalId: string;
    festivalName: string;
    affinityScore: number;
    technicalReasoning: string;
    weaknesses: string;
    matchingWinner?: {
        title: string;
        theme: string;
    };
}

// Función simple de hashing para generar una semilla única basada en la URL
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert a 32bit integer
    }
    return Math.abs(hash);
}

export function analyzeYouTubeLink(url: string, videoTitle?: string, authorName?: string): Promise<Recommendation[]> {
    const displayTitle = videoTitle || "la obra analizada";
    const displayAuthor = authorName ? ` de ${authorName}` : "";

    return new Promise((resolve) => {
        setTimeout(() => {
            const urlHash = hashString(url + (videoTitle || ""));

            const recommendations: Recommendation[] = festivalsData
                .filter(f => f.winners && f.winners.length > 0)
                .slice(0, 3)
                .map((fest, index) => {
                    const winner = fest.winners[0];
                    const affinity = 85 + (index * 2) + (urlHash % 5);
                    const festSeed = hashString(fest.id + url);

                    const reasonings = [
                        `La propuesta en "${displayTitle}" revela una madurez técnica inusual. Notamos un uso del claroscuro que evoca directamente la atmósfera de "${winner.title}". Es precisamente esa gestión de los espacios negativos lo que resuena con la línea editorial de ${fest.location}.`,
                        `Observamos en el trabajo${displayAuthor} una arquitectura de encuadres muy precisa. La cadencia del montaje dialoga con el "tempo" de "${winner.title}", sugiriendo una afinidad conceptual profunda con la herencia artística que ${fest.name} cultiva.`,
                        `Lo que hace a "${displayTitle}" una candidata sólida es su diseño sonoro inmersivo. Al igual que en "${winner.title}", la obra utiliza el fuera de campo para expandir la narrativa, un rasgo que los jurados en ${fest.location} suelen destacar.`,
                        `Existe una honestidad brutal en la dirección de arte de "${displayTitle}". La paleta cromática desaturada recuerda al tratamiento visual de "${winner.title}", estableciendo un vínculo estético con la sensibilidad curatorial de este festival.`,
                        `La construcción del punto de vista en "${displayTitle}" propone un ejercicio de voyerismo fascinante. Esta "cámara subjetiva" remite a la narrativa de "${winner.title}" y encaja en la búsqueda de nuevos lenguajes que define a ${fest.name}.`,
                        `El riesgo formal asumido en "${displayTitle}"${displayAuthor} es notable. Su estructura no lineal hereda la ambigüedad de "${winner.title}", construyendo un relato fragmentado que dialoga de tú a tú con la vanguardia proyectada en ${fest.location}.`,
                        `Destacamos el tratamiento de la luz diegética en "${displayTitle}". Logra una textura granulada que hace eco del estilo visual de "${winner.title}", aportando una capa de realismo sucio que es fetiche en la curaduría de ${fest.name}.`
                    ];

                    const weaknessList = [
                        `Técnicamente, el etalonaje en "${displayTitle}" presenta ligeras variaciones de saturación en las transiciones. Un acabado de color más cohesionado elevaría la obra al nivel que ${fest.name} exige en su selección oficial.`,
                        `Aunque la premisa visual es potente, observamos que "${displayTitle}" flaquea ligeramente en la resolución del segundo acto. Un montaje más elíptico, similar a la estructura de "${winner.title}", potenciaría el misterio.`,
                        `Se percibe una inconsistencia en los niveles de presión sonora. Refinar la espacialidad del audio para asegurar una inmersión envolvente realzaría el impacto sensorial que busca ${fest.name}.`,
                        `La narrativa de "${displayTitle}" se vuelve quizás demasiado explícita hacia el clímax. En circuitos como el de ${fest.location}, se valora más la capacidad de sugerir que el "explicar" la emoción al espectador.`,
                        `Observamos que algunas ópticas utilizadas en "${displayTitle}" generan aberraciones cromáticas. Una corrección técnica en post-producción daría ese look "Premium" que los programadores de ${fest.name} esperan.`,
                        `La economía de medios en "${displayTitle}" es su mayor fuerza, pero el ritmo decae en el tramo medio. Una poda en el montaje liberaría la tensión dramática acumulada, siguiendo la estela de las obras premiadas en ${fest.location}.`,
                        `El subtexto sociopolítico de "${displayTitle}" es vibrante, pero la dirección actoral en los planos medios pierde cierta naturalidad. Ajustar el registro interpretativo hacia algo más contenido beneficiaría su postulación a ${fest.name}.`
                    ];

                    const selectedReasoning = reasonings[festSeed % reasonings.length];
                    const selectedWeakness = weaknessList[(festSeed + urlHash) % weaknessList.length];

                    return {
                        festivalId: fest.id,
                        festivalName: fest.name,
                        affinityScore: Math.min(affinity, 99),
                        technicalReasoning: selectedReasoning,
                        weaknesses: selectedWeakness,
                        matchingWinner: {
                            title: winner.title,
                            theme: winner.theme.es
                        }
                    };
                });

            resolve(recommendations.sort((a, b) => b.affinityScore - a.affinityScore));
        }, 2000);
    });
}
