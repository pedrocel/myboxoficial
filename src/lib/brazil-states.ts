/** Centros aproximados dos estados (fallback quando não há lat/lng) */
export const STATE_CENTERS: Record<string, [number, number]> = {
  AC: [-9.97, -67.81],
  AL: [-9.57, -36.78],
  AM: [-3.13, -60.02],
  AP: [0.03, -51.07],
  BA: [-12.97, -38.51],
  CE: [-3.73, -38.53],
  DF: [-15.79, -47.88],
  ES: [-20.32, -40.34],
  GO: [-16.68, -49.25],
  MA: [-2.53, -44.28],
  MG: [-19.92, -43.94],
  MS: [-20.44, -54.64],
  MT: [-15.6, -56.1],
  PA: [-1.46, -48.5],
  PB: [-7.12, -34.86],
  PE: [-8.05, -34.9],
  PI: [-5.09, -42.8],
  PR: [-25.43, -49.27],
  RJ: [-22.91, -43.2],
  RN: [-5.79, -35.21],
  RO: [-8.76, -63.9],
  RR: [2.82, -60.67],
  RS: [-30.03, -51.23],
  SC: [-27.59, -48.55],
  SE: [-10.91, -37.07],
  SP: [-23.55, -46.63],
  TO: [-10.18, -48.33],
}

export const STATE_NAMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul', MT: 'Mato Grosso',
  PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco', PI: 'Piauí', PR: 'Paraná',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RO: 'Rondônia', RR: 'Roraima',
  RS: 'Rio Grande do Sul', SC: 'Santa Catarina', SE: 'Sergipe', SP: 'São Paulo',
  TO: 'Tocantins',
}

/** Espalha unidades no mesmo estado para não sobrepor no mapa */
export function getFallbackCoords(estado: string, index: number): [number, number] {
  const center = STATE_CENTERS[estado] ?? [-14.24, -51.93]
  const angle = (index * 137.5 * Math.PI) / 180
  const radius = 0.15 + (index % 5) * 0.08
  return [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius]
}
