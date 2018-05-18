function arrayWrap(value) {
  if (value instanceof Array) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }

  return [value];
}


module.exports = {
  arrayWrap
}