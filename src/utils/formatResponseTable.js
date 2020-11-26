module.exports = (resultObj) => {
  const result = [];

  if (resultObj.records.length > 0) {
    resultObj.records.map(({ keys, _fields }) => {
      result.push(Object.fromEntries(keys.map((_, i) => [keys[i], _fields[i]])));
    });
  }
  return result;
};
