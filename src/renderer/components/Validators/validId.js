'use strict'

export const validId = (value) => {
  return !isNaN(value) && value > 0
}