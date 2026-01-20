# Day 32 — Form Handling
**Mon, Jan 26, 2026**  
실시간으로 아이디/비밀번호 규칙을 검사하고 에러 메시지를 띄우는 회원가입 폼

---

## 🎯 미션 목표
- `input.value`로 **실시간 입력값** 읽기
- `input` vs `change` 이벤트 차이 체감
- `submit`에서 `preventDefault()`로 **새로고침 막고** 최종 검증
- 에러 메시지를 **검증 함수(Validation Layer)** 한 곳에서 일관되게 관리

---

## ✅ 최종 결과물 정의
- 아이디/비밀번호 입력 시 **실시간 검증**
- 규칙 위반 시 **즉시 에러 메시지** + 입력 테두리 강조
- 제출 시(Submit)에는 **필수 입력까지 포함한 최종 검증**
- 통과 시: `"회원가입 성공!"` 로그  
- 실패 시: `"회원가입 실패!"` 로그 + 에러 유지

---

## 🧠 핵심 개념 / 핵심 이론 (실무 기준)

### 1) 이벤트 타이밍: `input` vs `change` vs `submit`
- `input`  
  - 타이핑/붙여넣기/삭제 등 **값이 바뀌는 즉시** 발생  
  - **실시간 검증(UX 피드백)**에 최적
- `change`  
  - 입력을 마치고 **포커스가 빠질 때** 발생  
  - “입력 완료 후 검사”에 적합(실시간은 아님)
- `submit`  
  - 폼 제출 시 발생  
  - **최종 검증** + 서버 전송 트리거 지점

✅ 실무 폼 UX 권장 조합  
- 실시간: `input` (단, 빈 값은 조용히 처리 가능)  
- 최종: `submit` (필수/전체 규칙 강제)

---

### 2) `preventDefault()`는 폼에서 “필수”
폼의 기본 동작은 **페이지 새로고침/이동**.  
우리는 JS로 검증하고, 성공하면 API로 보내야 하므로:

- `e.preventDefault()`를 **submit 핸들러 시작점에 무조건 배치**

---

### 3) “검증 로직”과 “UI 표시”를 분리하는 이유
실무에서 폼이 커지면(필드 10개+) 제일 먼저 망가지는 게 “중복된 조건문”입니다.  
그래서 구조를 2층으로 나눕니다.

- **Validation Layer**: 문자열 입력 → `{ ok, msg }` 결과 반환  
- **UI Layer**: 결과를 보고 에러 UI를 표시/해제

이렇게 하면:
- 규칙 변경이 쉬움 (메시지/정규식 수정 지점이 1곳)
- 테스트가 쉬움 (DOM 없이 validate만 단위 테스트 가능)

---

### 4) 정규식(Regex) 핵심만 (딱 필요한 것)
- 아이디: 영문/숫자만 → `^[a-zA-Z0-9]+$`
- 영문 포함 → `/[a-zA-Z]/`
- 숫자 포함 → `/\d/`

⚠️ 팁  
- 정규식은 “통과/불통과”를 빠르게 판정하는 도구  
- 메시지는 “사용자가 고칠 행동”이 보이도록 짧고 구체적으로

---

### 5) UX 디테일 (실무에서 평가 갈리는 포인트)
- 입력 중 빈 값에서 바로 빨간 에러를 띄우면 스트레스가 큼  
  - ✅ 추천: **빈 값은 조용히(clear)**, 제출 시에만 “필수” 표시
- `trim()` 정책  
  - 아이디는 보통 앞뒤 공백 제거(`trim`) 후 검사  
  - 비밀번호는 정책에 따라 다름(보통 공백도 “문자”로 취급하지만, 서비스 정책에 맞춰 제한하기도 함)

---

### 6) 접근성(A11y) 최소 세트
- 에러 메시지 영역에 `aria-live="polite"`  
  → 스크린리더가 에러 변화를 읽을 수 있음
- input에 `aria-invalid="true/false"`  
- 에러 div에 `role="alert"`(선택) 또는 `aria-live`

---

## ✅ 요구사항 체크리스트

### 아이디 규칙
- [ ] 길이 5글자 이상
- [ ] 영문/숫자만 허용(특수문자/공백 불가)

### 비밀번호 규칙
- [ ] 길이 8글자 이상
- [ ] 영문 1개 이상 포함
- [ ] 숫자 1개 이상 포함

### 제출 규칙
- [ ] `submit`에서 `preventDefault()`
- [ ] 둘 다 통과 시 성공 로그
- [ ] 실패 시 실패 로그 + 에러 메시지 유지

---

## 🧩 설계(추천 아키텍처)
아래 구조만 지키면 폼이 커져도 유지보수 가능합니다.

1) DOM 캐싱 (한 번만)
2) UI 유틸: `setError`, `clearError`
3) 검증 함수: `validateId`, `validatePw` (문자열 → 결과)
4) 실시간 이벤트: input → validate → UI 업데이트
5) 제출 이벤트: submit → 강제 검증 → 성공/실패 처리

---

## 💻 README용 정답 예시 (단일 파일 / 즉시 실행)

> 복붙 → `index.html` 저장 → 실행 → F12 콘솔 확인

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Day 32 — Signup Form</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; }
    form { max-width: 360px; display: grid; gap: 12px; }
    label { font-weight: 700; display: inline-block; margin-bottom: 6px; }
    input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 10px; outline: none; }
    input:focus { border-color: #333; }
    button { padding: 12px; border: 0; border-radius: 12px; cursor: pointer; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .error { color: #d32f2f; font-size: 13px; min-height: 18px; margin-top: 6px; }
    .hidden { display: none; }
    .invalid { border-color: #d32f2f; }
    .row { display: grid; gap: 6px; }
  </style>
</head>
<body>
  <h1>회원가입 폼</h1>

  <form id="signupForm" novalidate>
    <div class="row">
      <label for="userId">아이디</label>
      <input id="userId" type="text" autocomplete="username" aria-invalid="false" />
      <div id="idError" class="error hidden" aria-live="polite"></div>
    </div>

    <div class="row">
      <label for="userPw">비밀번호</label>
      <input id="userPw" type="password" autocomplete="new-password" aria-invalid="false" />
      <div id="pwError" class="error hidden" aria-live="polite"></div>
    </div>

    <button id="submitBtn" type="submit" disabled>회원가입</button>
  </form>

  <script>
    // ===== 1) DOM 캐싱 =====
    const form = document.querySelector("#signupForm");
    const idInput = document.querySelector("#userId");
    const pwInput = document.querySelector("#userPw");
    const idError = document.querySelector("#idError");
    const pwError = document.querySelector("#pwError");
    const submitBtn = document.querySelector("#submitBtn");

    // ===== 2) 에러 UI 유틸 =====
    function setError(inputEl, errorEl, message) {
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
      inputEl.classList.add("invalid");
      inputEl.setAttribute("aria-invalid", "true");
    }

    function clearError(inputEl, errorEl) {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
      inputEl.classList.remove("invalid");
      inputEl.setAttribute("aria-invalid", "false");
    }

    // ===== 3) 검증 함수: 문자열 -> { ok, msg, silent? } =====
    function validateId(rawValue) {
      const value = String(rawValue ?? "").trim();

      // 입력 중 UX: 비어있으면 조용히(에러 숨김)
      if (value.length === 0) return { ok: false, silent: true, msg: "" };

      if (value.length < 5) {
        return { ok: false, msg: "아이디는 5글자 이상이어야 합니다." };
      }

      const idRegex = /^[a-zA-Z0-9]+$/;
      if (!idRegex.test(value)) {
        return { ok: false, msg: "아이디는 영문자와 숫자만 포함해야 합니다." };
      }

      return { ok: true };
    }

    function validatePw(rawValue) {
      const value = String(rawValue ?? "");

      if (value.length === 0) return { ok: false, silent: true, msg: "" };

      if (value.length < 8) {
        return { ok: false, msg: "비밀번호는 8글자 이상이어야 합니다." };
      }

      if (!/[a-zA-Z]/.test(value)) {
        return { ok: false, msg: "비밀번호는 영문자를 1개 이상 포함해야 합니다." };
      }

      if (!/\d/.test(value)) {
        return { ok: false, msg: "비밀번호는 숫자를 1개 이상 포함해야 합니다." };
      }

      return { ok: true };
    }

    // ===== 4) 공통: 특정 input을 검사하고 UI 반영 =====
    function applyValidation(inputEl, errorEl, validator) {
      const result = validator(inputEl.value);

      if (result.ok) {
        clearError(inputEl, errorEl);
        return true;
      }

      if (result.silent) {
        clearError(inputEl, errorEl);
        return false;
      }

      setError(inputEl, errorEl, result.msg);
      return false;
    }

    // ===== 5) 버튼 활성화 제어(실무 업그레이드) =====
    function updateSubmitState() {
      const idOk = validateId(idInput.value).ok;
      const pwOk = validatePw(pwInput.value).ok;
      submitBtn.disabled = !(idOk && pwOk);
    }

    // ===== 6) 실시간 이벤트(input) =====
    idInput.addEventListener("input", () => {
      applyValidation(idInput, idError, validateId);
      updateSubmitState();
    });

    pwInput.addEventListener("input", () => {
      applyValidation(pwInput, pwError, validatePw);
      updateSubmitState();
    });

    // ===== 7) 제출(submit) — 최종 검증(필수 포함) =====
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // 제출 시에는 "필수"를 강제로 띄움
      const idValue = idInput.value.trim();
      const pwValue = pwInput.value;

      let idOk = false;
      let pwOk = false;

      if (idValue.length === 0) {
        setError(idInput, idError, "아이디는 필수입니다.");
      } else {
        idOk = applyValidation(idInput, idError, validateId);
      }

      if (pwValue.length === 0) {
        setError(pwInput, pwError, "비밀번호는 필수입니다.");
      } else {
        pwOk = applyValidation(pwInput, pwError, validatePw);
      }

      updateSubmitState();

      if (idOk && pwOk) {
        console.log("회원가입 성공!");
        // 실무: 서버 전송(fetch/axios)
        // form.reset();
        // updateSubmitState();
      } else {
        console.log("회원가입 실패! 입력 내용을 다시 확인해주세요.");
      }
    });
  </script>
</body>
</html>
```

---

## 🧪 테스트 케이스 (이걸로 검증하면 “완성”)
### 아이디
- `abcd` → 길이 에러
- `abcde` → 통과
- `ab cd` / `abc!d` → 문자 제한 에러
- `  abcde  ` → trim 후 통과

### 비밀번호
- `1234567` → 길이 에러
- `abcdefgh` → 숫자 포함 에러
- `12345678` → 영문 포함 에러
- `abc12345` → 통과

### 제출
- 빈 값 제출 → “필수” 메시지 출력
- 둘 다 통과 후 제출 → 성공 로그
- 하나만 통과 → 실패 로그 + 해당 필드 에러 유지

---

## 🔥 실무 업그레이드 옵션 (선택)
- **Debounce**로 input 검증 빈도 줄이기 (대형 폼/비용 큰 검증에 유리)
- 비밀번호 강도(약/중/강) 표시
- 서버 에러(이미 존재하는 아이디) 메시지 핸들링
- 에러 메시지 다국어(i18n) 대응: 메시지 상수화

---

## 🎯 오늘 얻어가는 것
- 이벤트 흐름(`input` → `submit`)이 손에 익음
- 검증 로직을 “순수 함수”로 분리하는 습관
- 실무에서 그대로 재사용 가능한 폼 패턴 1개 확보
