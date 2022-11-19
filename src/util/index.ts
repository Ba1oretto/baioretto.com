function Interaction<T extends string>(condition: boolean, t: T, f: T) {
  const obj: {[index: string]: boolean} = {};
  obj[t] = condition;
  obj[f] = !condition;
  return obj;
}

export { Interaction };