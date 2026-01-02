/**
 * Calcula a idade do pet baseado na data de criação.
 * - Idade inicial: 1 ano
 * - +1 ano por semana passada desde a criação
 * - Idade máxima: 19 anos
 */

const MILLISECONDS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export const calculatePetAge = (createdAt: number): number => {
  const now = Date.now();
  
  // Validação: se createdAt for inválido ou no futuro, retorna idade inicial
  if (createdAt == null || createdAt < 0 || createdAt > now) {
    return 1;
  }
  
  const timeDiff = now - createdAt;
  
  // Calcula quantas semanas passaram
  const weeksPassed = Math.floor(timeDiff / MILLISECONDS_PER_WEEK);
  
  // Idade inicial é 1, adiciona 1 por semana, máximo 19
  const age = Math.min(1 + weeksPassed, 19);
  
  return age;
};
