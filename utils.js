function arrayWrap(value) {
  if (value instanceof Array) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }

  return [value];
}

function parseJWT(token) {
  if(token === undefined) {
    return null
  }
  let partials = token.split(' ')
  if(partials.length > 1) {
    token = partials[1]
  }
  return token;
}

function formatError(type, data) {

  return {
    type,
    data
  }
}


module.exports = {
  arrayWrap,
  parseJWT,
  formatError
}
