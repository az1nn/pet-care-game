/**
 * Calcula a idade do pet baseado na data de criação.
 * - Idade inicial: 1 ano
 * - +1 ano por semana passada desde a criação
 * - Idade máxima: 19 anos
 */
export const calculatePetAge = (createdAt: number): number => {
  const now = Date.now();
  const timeDiff = now - createdAt;
  
  // Calcula quantas semanas passaram (1 semana = 7 dias = 7 * 24 * 60 * 60 * 1000 ms)
  const weeksPassed = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
  
  // Idade inicial é 1, adiciona 1 por semana, máximo 19
  const age = Math.min(1 + weeksPassed, 19);
  
  return age;
};
