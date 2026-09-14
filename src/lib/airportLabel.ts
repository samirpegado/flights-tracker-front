const IATA_CITY: Record<string, string> = {
  NAT: 'Natal',
  LIS: 'Lisboa',
  GVA: 'Genebra',
  GRU: 'Guarulhos',
  CGH: 'Congonhas',
  GIG: 'Galeão',
  BSB: 'Brasília',
  VCP: 'Campinas',
  CNF: 'Belo Horizonte',
  SSA: 'Salvador',
  REC: 'Recife',
  FOR: 'Fortaleza',
  MAO: 'Manaus',
  CWB: 'Curitiba',
  POA: 'Porto Alegre',
  BEL: 'Belém',
  SLZ: 'São Luís',
  MCZ: 'Maceió',
  JPA: 'João Pessoa',
  AJU: 'Aracaju',
  MAD: 'Madrid',
  BCN: 'Barcelona',
  OPO: 'Porto',
  FCO: 'Roma',
  MXP: 'Milão',
  LIN: 'Milão',
  CDG: 'Paris',
  ORY: 'Paris',
  AMS: 'Amsterdã',
  FRA: 'Frankfurt',
  MUC: 'Munique',
  ZRH: 'Zurique',
  LHR: 'Londres',
  LGW: 'Londres',
  MIA: 'Miami',
  JFK: 'Nova York',
  EWR: 'Newark',
  MVD: 'Montevidéu',
  SCL: 'Santiago',
  EZE: 'Buenos Aires',
  AEP: 'Buenos Aires',
  ATH: 'Atenas',
}

const NAME_HINTS: [RegExp, string][] = [
  [/natal/i, 'Natal'],
  [/lisbon|lisboa|portela/i, 'Lisboa'],
  [/geneva|genebra|cointrin/i, 'Genebra'],
  [/guarulhos/i, 'Guarulhos'],
  [/gale[aã]o/i, 'Galeão'],
  [/congonhas/i, 'Congonhas'],
]

const FILLER =
  /\b(greater|international|regional|municipal|airport|airfield|field|aeroporto|internacional)\b/gi

export function airportLabel(raw: string | null | undefined): string {
  const value = (raw || '').trim()
  if (!value) return '—'

  if (/^[A-Za-z]{3}$/.test(value)) {
    const code = value.toUpperCase()
    return IATA_CITY[code] ?? code
  }

  for (const [pattern, city] of NAME_HINTS) {
    if (pattern.test(value)) return city
  }

  const cleaned = value
    .replace(FILLER, ' ')
    .replace(/[/,].*$/, '')
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned || value
}
