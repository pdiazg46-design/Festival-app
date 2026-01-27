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

export function analyzeYouTubeLink(url: string, videoTitle?: string, authorName?: string): Promise<Recommendation[]> {
    const displayTitle = videoTitle || "la obra analizada";
    const displayAuthor = authorName ? ` de ${authorName}` : "";

    return new Promise((resolve) => {
        setTimeout(() => {
            // Usamos una combinación de la URL y el nombre del festival para asegurar variedad real
            const urlSeed = url.length;

            const recommendations: Recommendation[] = festivalsData
                .filter(f => f.winners && f.winners.length > 0)
                .slice(0, 3)
                .map((fest, index) => {
                    const winner = fest.winners[0];
                    const affinity = 85 + (index * 2) + (urlSeed % 5);
                    const festSeed = fest.id.length + index + urlSeed;

                    // Pool extendido y variado de razonamientos técnicos
                    const reasonings = [
                        `La propuesta estética en "${displayTitle}" revela una madurez técnica inusual. Notamos un uso del claroscuro que evoca directamente la atmósfera de "${winner.title}", ganador aquí anteriormente. Es precisamente esa gestión del contraste lo que resuena con la línea editorial de ${fest.location}.`,
                        `Observamos en el trabajo${displayAuthor} una arquitectura de encuadres muy precisa. La cadencia del montaje dialoga con el "tempo" pausado de "${winner.title}", sugiriendo una afinidad conceptual profunda con la herencia artística que ${fest.name} ha cultivado históricamente.`,
                        `Lo que hace a "${displayTitle}" una candidata sólida es su diseño sonoro inmersivo. Al igual que sucedió con "${winner.title}", la obra utiliza el fuera de campo para expandir la narrativa, un rasgo técnico que los jurados en ${fest.location} suelen premiar con determinación.`,
                        `Existe una honestidad brutal en la dirección de arte de "${displayTitle}". La paleta cromática desaturada recuerda al tratamiento visual de "${winner.title}", estableciendo un vínculo estético directo con la sensibilidad curatorial de este festival.`,
                        `La construcción del punto de vista en "${displayTitle}" propone un ejercicio de voyerismo fascinante. Esta "cámara subjetiva" remite a la narrativa de "${winner.title}" y encaja perfectamente en la búsqueda de nuevos lenguajes que define a ${fest.name}.`
                    ];

                    const weaknessList = [
                        `Técnicamente, el etalonaje en las escenas de transición de "${displayTitle}" presenta ligeras variaciones de saturación. Un acabado de color más cohesionado elevaría la obra al nivel de excelencia que ${fest.name} exige en su selección oficial.`,
                        `Aunque la premisa visual es potente, observamos que "${displayTitle}" flaquea ligeramente en la resolución del segundo acto. Un montaje más elíptico, similar a la estructura de las obras premiadas en ${fest.location}, potenciaría el misterio.`,
                        `Se percibe una inconsistencia en los niveles de presión sonora durante los diálogos. Refinar la mezcla final para asegurar una espacialidad Dolby Atmos 5.1 realzaría el impacto sensorial que busca ${fest.name}.`,
                        `La narrativa de "${displayTitle}" se vuelve quizás demasiado explícita hacia el clímax. En circuitos como el de ${fest.location}, se valora más el subtexto y la capacidad de sugerir que el "explicar" la emoción al espectador.`,
                        `Observamos que algunas ópticas utilizadas en la secuencia inicial de "${displayTitle}" generan aberraciones cromáticas no deseadas. Una corrección técnica en post-producción daría ese look "Premium" que los programadores esperan.`
                    ];

                    // Selección pseudo-aleatoria pero consistente para este festival y esta obra
                    const selectedReasoning = reasonings[festSeed % reasonings.length];
                    const selectedWeakness = weaknessList[(festSeed + 2) % weaknessList.length];

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
