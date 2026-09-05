import {
  comfortTrend,
  dashboardMeta,
  dashboardStats,
  defaultAnalysisInput,
  environmentParameters,
  humidityTrend,
  shelterComparison,
  temperatureTrend,
} from '../data/mockData'

const wait = (duration = 450) => new Promise((resolve) => setTimeout(resolve, duration))
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function requestJson(path, options = {}) {
  if (!API_BASE_URL) throw new ApiError('Backend URL is not configured.', 0)

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
  } catch {
    throw new ApiError('Unable to connect to the backend.')
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`
    const payload = await response.json().catch(() => ({}))
    message = payload.message || payload.detail || message
    throw new ApiError(message, response.status)
  }

  return response.json()
}

const getComfortCategory = (index) => {
  if (index >= 80) return 'Comfortable'
  if (index >= 65) return 'Acceptable'
  if (index >= 50) return 'Warm'
  return 'High heat stress'
}

export function validateThermalInput(input) {
  const errors = {}
  const rules = [
    ['airTemperature', -20, 60, 'Air temperature must be between -20°C and 60°C.'],
    ['relativeHumidity', 0, 100, 'Relative humidity must be between 0% and 100%.'],
    ['airVelocity', 0, 10, 'Air velocity must be between 0 and 10 m/s.'],
    ['meanRadiantTemperature', -20, 70, 'Mean radiant temperature must be between -20°C and 70°C.'],
    ['metabolicRate', 0.8, 4, 'Metabolic rate must be between 0.8 and 4 met.'],
    ['clothingLevel', 0, 2, 'Clothing level must be between 0 and 2 clo.'],
    ['occupancy', 0, 100, 'Occupancy must be between 0% and 100%.'],
  ]

  rules.forEach(([field, minimum, maximum, message]) => {
    const value = Number(input[field])
    if (!Number.isFinite(value) || value < minimum || value > maximum) errors[field] = message
  })

  if (!input.shelterType) errors.shelterType = 'Select a shelter type.'
  if (!input.location?.trim()) errors.location = 'Enter a location or region.'
  return errors
}

export async function getDashboardData() {
  if (API_BASE_URL) return requestJson('/api/dashboard')
  await wait(250)
  return { meta: dashboardMeta, stats: dashboardStats, environmentParameters, temperatureTrend, updatedAt: new Date().toISOString(), source: 'mock' }
}

export const fetchDashboardData = getDashboardData

export async function getVisualizationData() {
  if (API_BASE_URL) return requestJson('/api/visualization')
  await wait(250)
  return { temperatureTrend, humidityTrend, comfortTrend, shelterComparison, source: 'mock' }
}

export async function getTemperatureHistory() {
  if (API_BASE_URL) return requestJson('/api/visualization/temperature')
  await wait(200)
  return temperatureTrend
}

export async function getHumidityHistory() {
  if (API_BASE_URL) return requestJson('/api/visualization/humidity')
  await wait(200)
  return humidityTrend
}

export async function getComfortHistory() {
  if (API_BASE_URL) return requestJson('/api/visualization/comfort')
  await wait(200)
  return comfortTrend
}

export async function getShelterComparison() {
  if (API_BASE_URL) return requestJson('/api/visualization/shelters')
  await wait(200)
  return shelterComparison
}

export async function runThermalAnalysis(input = defaultAnalysisInput) {
  if (API_BASE_URL) return requestJson('/api/thermal-analysis', { method: 'POST', body: JSON.stringify(input) })
  await wait()

  const temperaturePenalty = Math.abs(input.airTemperature - 24) * 2.4
  const humidityPenalty = Math.max(0, Math.abs(input.relativeHumidity - 50) * 0.35)
  const velocityBonus = Math.min(input.airVelocity * 8, 5)
  const occupancyPenalty = Math.max(0, (input.occupancy - 70) * 0.08)
  const comfortIndex = Math.max(
    0,
    Math.min(100, Math.round(100 - temperaturePenalty - humidityPenalty - occupancyPenalty + velocityBonus)),
  )
  const category = getComfortCategory(comfortIndex)
  const isAlert = comfortIndex < 65

  return {
    comfortIndex,
    comfortCategory: category,
    temperature: input.airTemperature,
    humidity: input.relativeHumidity,
    heatRisk: isAlert ? 'Elevated' : 'Moderate',
    recommendations: isAlert
      ? ['Increase cross-ventilation', 'Offer cool drinking water', 'Reduce direct solar exposure']
      : ['Maintain current ventilation', 'Keep shaded openings clear', 'Recheck conditions in 2 hours'],
    source: 'mock',
  }
}
