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

    // Simulación de análisis técnico y elegante
    return new Promise((resolve) => {
        setTimeout(() => {
            // Extraemos un "ID" ficticio de la URL para dar variedad a las recomendaciones simladas
            const seed = url.length % 5;

            const recommendations: Recommendation[] = festivalsData
                .filter(f => f.winners && f.winners.length > 0)
                .slice(0, 3) // Tomamos 3 para el ejemplo
                .map((fest, index) => {
                    const winner = fest.winners[0];
                    const affinity = 85 + (index * 2) + seed;

                    return {
                        festivalId: fest.id,
                        festivalName: fest.name,
                        affinityScore: Math.min(affinity, 99),
                        technicalReasoning: `Tras analizar "${displayTitle}"${displayAuthor}, se detecta una arquitectura visual que dialoga directamente con la estética de "${winner.title}". La gestión de los espacios negativos y el tempo interno de la obra sugieren una madurez técnica comparable a las producciones que ${fest.location} ha premiado históricamente.`,
                        weaknesses: index === 0
                            ? `Aunque "${displayTitle}" posee una fuerza visual innegable, se observa una ligera inconsistencia en el diseño sonoro durante las transiciones críticas. Refinar la espacialidad del audio elevaría el impacto narrativo.`
                            : `La estructura de "${displayTitle}" podría beneficiarse de un montaje más elíptico en su tramo medio para evitar la saturación de información y potenciar la curiosidad del espectador.`,
                        matchingWinner: {
                            title: winner.title,
                            theme: winner.theme.es
                        }
                    };
                });

            resolve(recommendations.sort((a, b) => b.affinityScore - a.affinityScore));
        }, 2000); // Simula carga de "análisis científico"
    });
}
