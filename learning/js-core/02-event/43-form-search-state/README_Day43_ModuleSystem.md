# Day 43 — Module System
---
## 🗓 일정
- Fri, Feb 6, 2026

---
## 🎯 미션 목표
거대한 JavaScript 파일을 기능 단위 모듈로 분리하고 다시 조립한다.

---
## 🧠 핵심 개념 요약
- Module = 기능 단위 파일
- import / export로 의존성 명시
- Module Scope로 전역 오염 방지

---
## 왜 모듈이 필요한가
- 파일 하나에 모든 코드 → 유지보수 지옥
- 이름 충돌, 재사용 불가, 협업 불가
- 모듈은 **구조 설계 도구**

---
## Module Scope
- 각 모듈은 독립된 스코프
- export한 것만 외부 접근 가능

---
## export (내보내기)

### Named Export
```js
// api.js
export function fetchItems() {
  return Promise.resolve([
    { id: 1, name: '사과' },
    { id: 2, name: '바나나' }
  ]);
}
```

### Default Export
```js
// calculator.js
export default class Calculator {
  add(a, b) {
    return a + b;
  }
}
```

---
## import (가져오기)

```js
// main.js
import { fetchItems } from './api.js';
import Calculator from './calculator.js';
```

---
## HTML에서 모듈 사용
```html
<script type="module" src="main.js"></script>
```

⚠️ type="module" 없으면 import/export 동작 안 함

---
## 🏗️ 미션 구조 예시
```
index.html
main.js
api.js
dom.js
```

---
## 역할 분리 설계
- api.js → 데이터 책임
- dom.js → 화면 책임
- main.js → 흐름 제어

---
## 🔥 실무 핵심 포인트
- 모듈은 **코드 정리 기술이 아니라 설계 기술**
- main.js는 항상 orchestration 역할
- 모듈 분리 기준 = 책임 기준

---
## 🎯 얻어가는 것
- 실무형 파일 구조 감각
- 전역 스코프 오염 방지
- 프레임워크 구조 이해 기반

---
## 📚 키워드
- ESM (ECMAScript Modules)
- Module Scope
- Named vs Default Export
- script type="module"
