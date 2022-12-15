const divideStringOn = (s: string, search: string) => {
  const index = s.indexOf(search);
  const first = `${s.slice(0, index)}`;
  const rest = `${s.slice(index + search.length)}`;
  return [first, rest];
};

export default divideStringOn;
