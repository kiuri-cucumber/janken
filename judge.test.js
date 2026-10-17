const test = require('node:test');
const assert = require('node:assert/strict');
const { judge } = require('./judge.js');

// 0: グー、1: チョキ、2: パー
const expected = [
  ['draw', 'win', 'lose'],
  ['lose', 'draw', 'win'],
  ['win', 'lose', 'draw'],
];

for (let player = 0; player < 3; player++) {
  for (let cpu = 0; cpu < 3; cpu++) {
    test(`judge(${player}, ${cpu}) = ${expected[player][cpu]}`, () => {
      assert.equal(judge(player, cpu), expected[player][cpu]);
    });
  }
}
