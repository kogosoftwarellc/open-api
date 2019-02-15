module.exports = function getFoo() {
  if (this.dependencies.sum(1, 1) !== 2) {
    throw Error('1 + 1 != 2');
  }
  return;
};
