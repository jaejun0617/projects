# Day 35 — Week 3 Project: Paint App

## 🎯 핵심 요약 (한 줄)
웹 그림판은 **마우스 상태 관리 + 좌표 변환 + 캔버스 드로잉 파이프라인** 이 3가지만 정확히 이해하면 구현된다.

---

## 1. 이 프로젝트의 본질적 개념

### 1) State Machine (마우스 상태)
그림판은 이벤트가 아니라 **상태 전이** 문제다.

- idle → drawing → idle
- `isDrawing = true/false` 하나로 제어

| 이벤트 | 의미 | 상태 변화 |
|---|---|---|
| mousedown | 그리기 시작 | false → true |
| mousemove | 그리는 중 | true 유지 |
| mouseup / mouseleave | 종료 | true → false |

👉 클릭 이벤트만으로는 **연속 좌표**를 얻을 수 없기 때문에 불가능

---

### 2) 좌표계 변환 (가장 중요한 이론)
브라우저 이벤트 좌표 ≠ 캔버스 내부 좌표

- 이벤트는 **뷰포트 기준**
- 캔버스는 **자기 픽셀 버퍼 기준**

```js
function getPos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}
```

✔ CSS 크기 / DPR이 달라져도 정확한 좌표 보장  
✔ 실무에서 가장 안전한 방식

---

### 3) Canvas는 DOM이 아니다
- `<div>`: 구조 + 요소
- `<canvas>`: **픽셀 비트맵**

👉 선 하나를 DOM처럼 삭제할 수 없음  
👉 상태 기반 “다시 그리기” 사고가 중요

---

## 2. 드로잉 파이프라인 (암기 수준)

```text
beginPath → moveTo → lineTo → stroke
```

| 메서드 | 역할 |
|---|---|
| beginPath | 새 선 시작 |
| moveTo | 시작점 지정 |
| lineTo | 선 연결 |
| stroke | 실제 렌더 |

❗ mousedown에서 moveTo 안 하면  
→ (0,0)에서 선이 튀는 버그 발생

---

## 3. 선 품질을 결정하는 옵션

```js
ctx.lineWidth = 6;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
```

| 옵션 | 설명 |
|---|---|
| lineWidth | 선 굵기 |
| lineCap | 끝 모양 |
| lineJoin | 꺾임 모양 |

👉 이 3개가 그림판 감성의 80%

---

## 4. 색상 변경의 본질
색 버튼은 **그림을 그리는 게 아님**

- 상태만 변경
- 이후 드로잉에 반영

```js
let currentColor = '#111';
ctx.strokeStyle = currentColor;
```

👉 상태 중심 사고 = React로 그대로 연결됨

---

## 5. 실무 버그 체크리스트

- 첫 선이 0,0에서 튄다 → moveTo 누락
- 캔버스 밖에서도 그려짐 → mouseleave / window mouseup 누락
- 좌표 어긋남 → clientX 그대로 사용
- 선 흐림 → CSS 크기와 canvas width 불일치
- 드래그 안 됨 → isDrawing 조건 누락

---

## 6. 최소 구현 코드 (완성본)

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>Paint App</title>
  <style>
    body { font-family: system-ui; padding: 20px; }
    canvas { border: 1px solid #ddd; display: block; }
    .palette { margin-top: 12px; display: flex; gap: 8px; }
    .palette button {
      width: 32px; height: 32px;
      border-radius: 6px; border: 1px solid #ccc;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <canvas id="c" width="800" height="600"></canvas>

  <div class="palette" id="palette">
    <button data-color="#111" style="background:#111"></button>
    <button data-color="#e11d48" style="background:#e11d48"></button>
    <button data-color="#2563eb" style="background:#2563eb"></button>
    <button data-color="#16a34a" style="background:#16a34a"></button>
  </div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const palette = document.getElementById('palette');

    let isDrawing = false;
    let currentColor = '#111';

    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const { x, y } = getPos(e);
      ctx.strokeStyle = currentColor;
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    canvas.addEventListener('mouseleave', () => isDrawing = false);
    window.addEventListener('mouseup', () => isDrawing = false);

    palette.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-color]');
      if (!btn) return;
      currentColor = btn.dataset.color;
    });
  </script>
</body>
</html>
```

---

## 7. 다음 단계 확장
- 지우개: `globalCompositeOperation`
- 굵기 슬라이더
- 캔버스 저장 (PNG)
- 모바일 터치 대응

---

## 🎯 이 Day의 의미
이제부터는  
**“상태 → 입력 → 렌더링”** 구조를  
DOM이든 Canvas든 동일하게 다룰 수 있는 단계다.
