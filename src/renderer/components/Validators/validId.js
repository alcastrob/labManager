export const validId = (value, component) => {
  return parseInt(value) !== NaN && value > 0
}