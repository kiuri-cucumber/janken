const hands = ['グー', 'チョキ', 'パー'];
const messages = { win: 'あなたの勝ち！', lose: 'あなたの負け！', draw: 'あいこ！' };
const scores = { win: 0, lose: 0, draw: 0 };
const match = document.getElementById('match');
const result = document.getElementById('result');
const score = document.getElementById('score');

document.querySelectorAll('[data-hand]').forEach((button) => {
  button.addEventListener('click', () => {
    const player = Number(button.dataset.hand);
    const cpu = Math.floor(Math.random() * 3);
    const outcome = judge(player, cpu);
    scores[outcome] += 1;
    match.textContent = `あなた：${hands[player]} ／ 相手：${hands[cpu]}`;
    result.textContent = messages[outcome];
    const total = scores.win + scores.lose + scores.draw;
    score.textContent = `${scores.win}勝 / ${scores.lose}敗 / ${scores.draw}あいこ（${total}回）`;
  });
});
