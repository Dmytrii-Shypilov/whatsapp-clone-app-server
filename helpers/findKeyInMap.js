function findKey(map, valueToFind) {
    for (let [key, value] of map) {
      if (value === valueToFind) {
        return key
      }
    }
  }

  module.exports = findKey