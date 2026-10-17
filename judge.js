// 0: グー、1: チョキ、2: パー。差が2ならプレイヤーの勝ち。
function judge(player, cpu) {
  return ['draw', 'lose', 'win'][(3 + player - cpu) % 3];
}

if (typeof module !== 'undefined') module.exports = { judge };
