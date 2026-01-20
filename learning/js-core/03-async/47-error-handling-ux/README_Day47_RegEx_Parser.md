# Day 47 — RegEx (Regular Expressions)  
**Tue, Feb 10, 2026**

복잡한 텍스트에서 **전화번호/이메일만 추출**해 **하이퍼링크로 변환**하는 파서 만들기

---

## 🧠 오늘의 핵심 요약 (한 줄)
> **정규식 = “텍스트에서 ‘모양(패턴)’으로 데이터를 찾고/검증하고/치환하는 도구”**

---

## 🎯 미션 목표
- RegEx 기본 구성: **Pattern / Flags**
- 핵심 메서드: **test / match / replace**
- 텍스트에서 **전화번호 + 이메일**을 찾아서
  - 전화번호 → `tel:` 링크
  - 이메일 → `mailto:` 링크
- 변환 결과를 `innerHTML`로 화면에 표시

---

## 📌 왜 이걸 배우는가 (실무 관점)
정규식은 “데이터 처리”에서 빠질 수 없다.

- 회원가입 폼 검증(이메일/전화번호)
- 로그/문서에서 특정 형식만 추출
- 텍스트에서 링크 자동 생성(채팅/게시글/CS툴)
- 검색어 하이라이팅

**한 줄로 대량 처리**가 가능한 게 정규식의 가치다.

---

## 🧩 핵심 이론 정리

### 1️⃣ 정규식은 “패턴”이다
문자열을 정확히 일치시키는 게 아니라, **형태**로 찾는다.

- `includes("010-")` → 너무 약함
- RegEx `/\d{2,3}[-\s]?\d{3,4}[-\s]?\d{4}/g` → 전화번호 패턴으로 찾음

---

### 2️⃣ RegEx 생성 방식 2가지
**(1) 리터럴 방식 (추천, 가장 많이 씀)**

```js
const re = /abc/g;
```

**(2) 생성자 방식 (패턴이 변수로 바뀔 때)**

```js
const word = "hello";
const re = new RegExp(word, "gi");
```

---

### 3️⃣ Flags (플래그)
- `g` (global): 전체에서 모두 찾기
- `i` (ignore case): 대소문자 무시
- `m` (multiline): 여러 줄 기준
- `u` (unicode): 유니코드 처리 강화

오늘 미션에서는 **g가 필수**다. (여러 개 찾아야 하니까)

---

### 4️⃣ 자주 쓰는 패턴 조각 (핵심만)
- `\d` : 숫자 1개 (0~9)
- `\w` : 영문/숫자/_ (단어 문자)
- `\s` : 공백(스페이스/탭/줄바꿈)
- `+` : 1개 이상
- `*` : 0개 이상
- `?` : 0 또는 1개
- `{n}` : 정확히 n개
- `{n,m}` : n~m개
- `(...)` : 그룹
- `|` : OR
- `\.` : 점(.)은 이스케이프 필요

---

## ✅ 오늘 필수 메서드 3개 (Test / Match / Replace)

### 1) `test()` — “있어/없어?” (boolean)
```js
const re = /\d{3}-\d{4}-\d{4}/;
re.test("010-1234-5678"); // true
```

### 2) `match()` — “뽑아줘” (array)
```js
const text = "010-1111-2222, 010-3333-4444";
text.match(/\d{3}-\d{4}-\d{4}/g);
// ["010-1111-2222", "010-3333-4444"]
```

### 3) `replace()` — “바꿔줘” (string)
- `$&` = “매칭된 전체 문자열”

```js
const text = "mail me: a@b.com";
text.replace(/\w+@\w+\.\w+/g, "<a href='mailto:$&'>$&</a>");
```

---

## 🧠 미션에서 가장 중요한 사고방식
> **“추출(match)보다 변환(replace)이 목적이다.”**

- 우리가 원하는 결과: 전화번호/이메일이 **링크로 렌더링된 HTML**
- 그래서 replace를 2번 적용한다:
  1) phone → `<a href="tel:...">...</a>`
  2) email → `<a href="mailto:...">...</a>`

---

## ⚠️ 실무에서 자주 터지는 포인트 (핵심 보강)

### A) `innerHTML` vs `textContent`
- `textContent`로 넣으면 `<a>`가 글자로 보인다
- 링크를 실제로 만들려면 **innerHTML**을 써야 한다

### B) 치환 순서
- 전화번호 먼저, 이메일 다음(혹은 반대도 가능)
- 다만 패턴이 겹칠 가능성은 낮지만, 실무에선 “중복 치환”을 조심한다

### C) 전화번호는 “형태가 다양”하다
- `010-1234-5678`
- `02-123-4567`
- `010 5555 6666`
- `01012345678`

→ 그래서 `[-\s]?` 같은 “구분자 옵션”을 넣는다

### D) 링크에 들어갈 값은 “정규화”가 안정적
`tel:`은 공백/하이픈을 제거한 숫자 형태가 더 안전하다.  
즉, 보여주는 건 원본 그대로, `href`는 정리된 값으로 넣는 게 좋다.

---

## 🏗️ 미션 구현 (단일 HTML + script)

### ✅ index.html (한 파일로 완성)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RegEx Parser - Day 47</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
    .grid { display: grid; gap: 16px; max-width: 900px; }
    .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
    pre { white-space: pre-wrap; word-break: break-word; margin: 0; }
    a { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>RegEx Parser</h1>

  <div class="grid">
    <div class="card">
      <h2>원본 텍스트</h2>
      <pre id="originalText">
안녕하세요! 프론트엔드 수업에 오신 걸 환영합니다.
궁금한 점이 있다면 언제든지 010-1234-5678로 전화 주세요.
혹은 seonbae@example.com으로 메일을 보내셔도 좋습니다.
저희 사무실 전화번호는 02-987-6543이고, 다른 이메일은 info@mycompany.net입니다.
가끔 010 5555 6666 처럼 공백으로 된 번호도 있을 수 있어요.
      </pre>
    </div>

    <div class="card">
      <h2>파싱 결과 (링크 변환)</h2>
      <div id="parsedResult"></div>
    </div>
  </div>

  <script>
    // 1) 원본 텍스트 가져오기
    const rawText = document.getElementById("originalText").textContent;

    // 2) 이메일 정규식 (실무 최소형)
    // - 아이디: 영숫자/._%+-
    // - 도메인: 영숫자/.-
    // - TLD: 2자 이상
    const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

    // 3) 전화번호 정규식 (한국 형태 대응: 02, 010 등 / 하이픈 또는 공백 또는 없음)
    // - 지역번호/통신: 0 + 1~2자리 (02, 031, 010 등) 또는 010/011 등도 포함
    // - 중간: 3~4자리
    // - 마지막: 4자리
    // - 구분자: 하이픈 또는 공백이 있을 수도/없을 수도
    const phoneRegex = /0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}/g;

    // 4) phone -> tel 링크 (href는 숫자만 남기도록 정규화)
    let processed = rawText.replace(phoneRegex, (match) => {
      const normalized = match.replace(/[-\s]/g, ""); // tel에는 공백/하이픈 제거
      return `<a href="tel:${normalized}">${match}</a>`;
    });

    // 5) email -> mailto 링크
    processed = processed.replace(emailRegex, (match) => {
      return `<a href="mailto:${match}">${match}</a>`;
    });

    // 6) 결과 출력 (링크로 렌더링되려면 innerHTML)
    const $result = document.getElementById("parsedResult");
    $result.innerHTML = processed.replace(/\n/g, "<br>");
  </script>
</body>
</html>
```

---

## ✅ 요구사항 체크리스트
- [x] 텍스트에서 전화번호 추출
- [x] 텍스트에서 이메일 추출
- [x] 전화번호 → `tel:` 링크 변환
- [x] 이메일 → `mailto:` 링크 변환
- [x] 결과를 화면에 링크로 표시 (`innerHTML`)

---

## 🔥 오늘 반드시 가져가야 할 것 (실무 기준)
- 정규식은 “문자열 검색”이 아니라 **패턴 매칭 엔진**
- `g` 플래그 없이 match/replace하면 “첫 개만” 처리될 수 있다
- 링크 렌더링은 `innerHTML` (단, XSS 위험이 있으니 실무는 sanitize 고려)
- 치환할 때 `$&`도 되지만, **함수 콜백 replace**가 더 실무적(정규화 가능)

---

## 🚀 (선택) 확장 과제
- 전화번호 형식 통일: `010-1234-5678`로 출력 표준화
- 국제번호(`+82`)도 지원
- 링크 클릭 시 복사 버튼 붙이기
- 결과에서 매칭된 전화/이메일 목록을 별도로 추출(match)해서 하단에 리스트로 출력

---

## 📚 참고 키워드
- RegEx Patterns / Flags
- test / match / replace
- capturing group / non-capturing group
- greedy vs lazy
- XSS / sanitize (innerHTML 사용 시)
- regex101 / regexr (온라인 테스트)
