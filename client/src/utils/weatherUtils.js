export function iconForCondition(condition) {
  switch (condition) {
    case 'clear':
      return '☀️'
    case 'clouds':
      return '⛅'
    case 'fog':
      return '🌫️'
    case 'rain':
      return '🌧️'
    case 'snow':
      return '❄️'
    case 'thunder':
      return '⛈️'
    default:
      return '🌡️'
  }
}

export function gradientForTemperature(tempC) {
  if (tempC == null || Number.isNaN(Number(tempC))) {
    return 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)'
  }
  const t = Number(tempC)
  // Cold → blue, Mild → green/teal, Hot → orange
  if (t <= 0) return 'linear-gradient(135deg, #5B86E5 0%, #36D1DC 100%)'
  if (t <= 15) return 'linear-gradient(135deg, #43CEA2 0%, #185A9D 100%)'
  if (t <= 28) return 'linear-gradient(135deg, #FBD786 0%, #C6FFDD 100%)'
  return 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)'
}


