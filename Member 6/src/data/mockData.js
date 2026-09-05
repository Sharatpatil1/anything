export const dashboardMeta = {
  location: 'Nagpur, Maharashtra',
  zoneLabel: 'Live shelter zone',
  statusLabel: 'Moderate attention',
  updatedLabel: 'Updated 4 minutes ago',
}

export const dashboardStats = [
  {
    label: 'Current temperature',
    value: '31.8',
    unit: '°C',
    detail: 'Feels like 33.1°C',
    tone: 'orange',
  },
  {
    label: 'Relative humidity',
    value: '58',
    unit: '%',
    detail: 'Within target range',
    tone: 'blue',
  },
  {
    label: 'Comfort index',
    value: '72',
    unit: '/ 100',
    detail: 'Acceptable conditions',
    tone: 'green',
  },
  {
    label: 'Heat risk',
    value: 'Moderate',
    unit: '',
    detail: 'Monitor occupancy',
    tone: 'yellow',
  },
]

export const environmentParameters = [
  { label: 'Air velocity', value: '0.4 m/s', icon: 'wind' },
  { label: 'Mean radiant temperature', value: '34.2°C', icon: 'sun' },
  { label: 'Shelter occupancy', value: '68%', icon: 'users' },
  { label: 'Solar exposure', value: 'High', icon: 'sunrise' },
]

export const temperatureTrend = [
  { time: '06:00', value: 27.1 },
  { time: '08:00', value: 28.4 },
  { time: '10:00', value: 30.2 },
  { time: '12:00', value: 32.4 },
  { time: '14:00', value: 33.1 },
  { time: '16:00', value: 31.8 },
  { time: '18:00', value: 29.6 },
]

export const humidityTrend = [
  { time: '06:00', value: 71 },
  { time: '08:00', value: 68 },
  { time: '10:00', value: 63 },
  { time: '12:00', value: 57 },
  { time: '14:00', value: 52 },
  { time: '16:00', value: 58 },
  { time: '18:00', value: 64 },
]

export const comfortTrend = [
  { time: '06:00', value: 78 },
  { time: '08:00', value: 76 },
  { time: '10:00', value: 74 },
  { time: '12:00', value: 68 },
  { time: '14:00', value: 64 },
  { time: '16:00', value: 72 },
  { time: '18:00', value: 77 },
]

export const shelterComparison = [
  { shelter: 'Bamboo', comfort: 84, temperature: 29.4, risk: 18 },
  { shelter: 'Tin roof', comfort: 61, temperature: 34.8, risk: 62 },
  { shelter: 'Concrete', comfort: 70, temperature: 32.2, risk: 41 },
  { shelter: 'Cool roof', comfort: 88, temperature: 28.6, risk: 12 },
]

export const defaultAnalysisInput = {
  airTemperature: 31.8,
  relativeHumidity: 58,
  airVelocity: 0.4,
  meanRadiantTemperature: 34.2,
  metabolicRate: 1.2,
  clothingLevel: 0.5,
  shelterType: 'Bamboo and thatch',
  location: 'Nagpur, Maharashtra',
  occupancy: 68,
}
