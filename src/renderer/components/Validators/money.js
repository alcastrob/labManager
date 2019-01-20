"use strict";

export const money = (value) => {
  var regex = /^[-]?\d*(\.\d+)?\s*€?$/
  return  regex.exec(value)
}