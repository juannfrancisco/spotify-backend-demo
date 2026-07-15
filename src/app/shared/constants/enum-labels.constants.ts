export const ENUM_LABELS: Record<string, string> = {
  // ProjectStatus
  PLANNED: 'Planificado',
  ACTIVE: 'Activo',
  WARRANTY: 'Garantía',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  FROZEN: 'Congelado',

  // RiskReason
  LICENSE: 'Licencia',
  SCOPE_CHANGE: 'Cambio de alcance',
  DELAYS: 'Retrasos',
  OTHER: 'Otro',

  // RiskType
  INTERNAL: 'Interno',
  EXTERNAL: 'Externo',

  // RiskStatus
  MATERIALIZED: 'Materializado',
  MITIGATED: 'Mitigado',
  CLOSED: 'Cerrado',

  // RiskProbability
  RARE: 'Raro',
  UNLIKELY: 'Poco probable',
  MODERATE: 'Moderado',
  LIKELY: 'Probable',
  ALMOST_CERTAIN: 'Casi seguro',

  // RiskImpact
  INSIGNIFICANT: 'Insignificante',
  MINOR: 'Menor',
  SIGNIFICANT: 'Significativo',
  MAJOR: 'Mayor',
  SEVERE: 'Severo',

  // RiskLevel
  LOW: 'Bajo',
  MEDIUM: 'Medio',
  HIGH: 'Alto',

  // General workflow statuses
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  SKIPPED: 'Omitida',
  DRAFT: 'Borrador',
  UNREAD: 'No leída',
  READ: 'Leída',
  TRASHED: 'Eliminada',

  // Recruitment
  HIRED: 'Contratado/a',
  APPLIED: 'Agregado',
  SCREENING: 'Screening',
  PSYCHOLABORAL: 'Psicolaboral',
  TECHNICAL: 'Técnica',
  MANAGER_INTERVIEW: 'Entrevista con lider',
  CLIENT_INTERVIEW: 'Entrevista con cliente',
  OFFER: 'Oferta',

  // Risk level aliases
  POSSIBLE: 'Posible',
  PROBABLE: 'Probable',


  //Assignment Position
  PROJECT_MANAGER: 'Project Manager',
  TECH_LEAD: 'Tech Lead',
  DEVELOPER: 'Developer',
  DESIGNER: 'Designer',
  TESTER: 'Tester',
  ANALYST: 'Analyst',
  DEVOPS: 'DevOps',
  ARCHITECT: 'Architect',
};

export function enumToOptions<T extends Record<string, string>>(enumObj: T): { id: string; name: string }[] {
  return Object.values(enumObj).map(value => ({
    id: value,
    name: ENUM_LABELS[value] || value,
  }));
}
