const nameEl = document.getElementById('name');
const hpEl = document.getElementById('hp');
const logEl = document.getElementById('log');

const btnAttack = document.getElementById('btnAttack');
const btnHeal = document.getElementById('btnHeal');

// 숫자를 범위 안으로 고정하는 유틸
function clamp(value, min, max) {
   return Math.max(min, Math.min(max, value));
}

// 상태 + 행동을 함께 가진 엔티티
const hero = {
   name: 'Hero',
   maxHealth: 100,
   health: 100,
   attackPower: 15,
   healPower: 10,

   isAlive() {
      return this.health > 0;
   },

   attack() {
      if (!this.isAlive()) return '이미 쓰러진 상태입니다.';
      this.health = clamp(this.health - this.attackPower, 0, this.maxHealth);
      return `공격 받음 (-${this.attackPower})`;
   },

   heal() {
      if (!this.isAlive()) return '쓰러진 상태에서는 회복할 수 없습니다.';
      const before = this.health;
      this.health = clamp(this.health + this.healPower, 0, this.maxHealth);
      const actual = this.health - before;
      return `회복 (+${actual})`;
   },
};

// 상태 → UI 반영
function render(message = '') {
   nameEl.textContent = hero.name;
   hpEl.textContent = `${hero.health} / ${hero.maxHealth}`;
   logEl.textContent = message;
}

// 이벤트 = 객체의 메서드 호출
btnAttack.addEventListener('click', () => {
   const msg = hero.attack();
   render(msg);
});

btnHeal.addEventListener('click', () => {
   const msg = hero.heal();
   render(msg);
});

// 초기 렌더
render('대기 중');
