const formatPhone = (value) => {
  var numbers = value.toString().replace(/\D/g, ''),
    char = {0: '(', 3: ') ', 6: '-'}
  value = ''
  for (var i = 0; i < numbers.length; i++) {
    value += (char[i] || '') + numbers[i]
  }
  return value
}

export {formatPhone}
