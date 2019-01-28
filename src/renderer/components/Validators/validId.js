"use strict";

export const validId = (value) => {
  return parseInt(value) !== NaN && value > 0
}