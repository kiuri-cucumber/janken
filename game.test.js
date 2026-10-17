const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('3つのボタンを連続クリックしても、表示と通算成績が毎回一致する', () => {
  const read = (file) => fs.readFileSync(path.join(__dirname, file), 'utf8');
  const html = read('index.html');
  const elements = Object.fromEntries(
    ['match', 'result', 'score'].map((id) => [id, { textContent: '' }]),
  );
  const buttons = [...html.matchAll(/<button\b[^>]*data-hand="(\d)"[^>]*>/g)].map(
    ([, hand]) => ({
      dataset: { hand },
      addEventListener(event, listener) {
        assert.equal(event, 'click');
        this.click = listener;
      },
    }),
  );
  assert.deepEqual(buttons.map((button) => button.dataset.hand), ['0', '1', '2']);
  assert.match(html, /aria-live="polite"/);
  let cpu = 0;
  const context = vm.createContext({
    Math: { random: () => (cpu + 0.5) / 3, floor: Math.floor },
    document: {
      getElementById: (id) => elements[id],
      querySelectorAll: (selector) => {
        assert.equal(selector, '[data-hand]');
        return buttons;
      },
    },
  });
  for (const [, src] of html.matchAll(/<script\b[^>]*src="\.\/([^"]+)"[^>]*>/g)) {
    vm.runInContext(read(src), context, { filename: src });
  }
  const hands = ['グー', 'チョキ', 'パー'];
  const outcomes = [
    ['draw', 'win', 'lose'],
    ['lose', 'draw', 'win'],
    ['win', 'lose', 'draw'],
  ];
  const messages = { win: 'あなたの勝ち！', lose: 'あなたの負け！', draw: 'あいこ！' };
  const counts = { win: 0, lose: 0, draw: 0 };
  let total = 0;
  for (let round = 0; round < 100; round++) {
    for (let player = 0; player < 3; player++) {
      for (cpu = 0; cpu < 3; cpu++) {
        buttons[player].click();
        const outcome = outcomes[player][cpu];
        counts[outcome]++;
        total++;
        assert.equal(elements.match.textContent, `あなた：${hands[player]} ／ 相手：${hands[cpu]}`);
        assert.equal(elements.result.textContent, messages[outcome]);
        assert.equal(elements.score.textContent,
          `${counts.win}勝 / ${counts.lose}敗 / ${counts.draw}あいこ（${total}回）`);
      }
    }
  }
});
