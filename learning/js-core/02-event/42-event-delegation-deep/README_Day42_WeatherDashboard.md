# Day 42 (Week 4 Project) — Weather Dashboard
**Thu, Feb 5, 2026**

목표: **현재 내 위치 날씨 + 도시 검색**이 되는 **실시간 날씨 앱(바닐라 JS)** 완성

---

## 1) 핵심 이론 (진짜 필요한 것만)

### 1-1. OpenWeather API가 “왜” 필요한가
날씨 데이터는 우리가 만들 수 없고, **외부 서비스(OpenWeather)**가 수집/가공해서 제공합니다. 우리는 **HTTP 요청**으로 데이터를 받고, 화면에 렌더링합니다. citeturn5view0

**현재 날씨(Current Weather) 요청 형태**
- 도시 이름: `.../data/2.5/weather?q={city}&appid={API_KEY}`
- 좌표: `.../data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}` citeturn14view0

**units=metric(섭씨)**
- `units=metric` 붙이면 온도가 섭씨로 옵니다. citeturn14view0  
  (안 붙이면 기본 단위가 달라서 “섭씨 변환”을 따로 해야 합니다)

**날씨 아이콘**
- 응답의 `weather[0].icon`으로 이미지 URL을 구성합니다. citeturn11view3  
  예: `https://openweathermap.org/img/wn/{icon}@2x.png`

**API Key는 ‘신분증’**
- 키가 없으면 요청이 거절됩니다. citeturn5view0  
- 학습용으로 코드에 박아도 되지만, 실전에서는 프론트에 노출되면 위험(누가 가져가서 호출/과금/제한 걸림).

---

### 1-2. Geolocation API가 “왜” 필요한가
도시를 모르더라도 **내 현재 위치(위도/경도)**만 있으면 즉시 날씨를 띄울 수 있습니다.

**중요 포인트**
- 사용자의 **명시적 허용(권한)**이 필요합니다. citeturn6view2  
- 브라우저는 보통 **HTTPS(secure context)**에서만 위치 API를 허용합니다. citeturn6view2  
  - 로컬 개발은 `http://localhost`가 예외로 허용되는 경우가 많습니다.

**getCurrentPosition**
- 한 번만 현재 위치를 받습니다. citeturn6view2  
- 실패하면 error 콜백으로 들어오며, 메시지를 사용자에게 보여줘야 합니다.

---

### 1-3. fetch에서 초보가 제일 많이 틀리는 지점
`fetch()`는 **HTTP 404/500이어도 Promise가 reject되지 않을 수** 있습니다.  
네트워크 자체가 실패했을 때만 reject되는 경우가 많아서, **response.ok를 직접 검사**해야 합니다. citeturn6view3

핵심 패턴:
```js
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

---

## 2) 에러/로딩 UX 전략 (실무 감각)
- **로딩 상태**: “불러오는 중…” 표시 (사용자 불안 제거)
- **에러 상태**: 한 줄 친절 메시지 + 재시도(옵션)
- **정상 상태**: 날씨 카드 렌더

에러 메시지는 보통 이 3종류로 나눠서 처리합니다.
1) 위치 권한 거부/실패  
2) 도시 검색 실패(404)  
3) 네트워크 끊김/타임아웃 등

---

## 3) 구현 구조 (최소 구조 + 깔끔한 분리)
- `getWeatherByCoords(lat, lon)`  
- `getWeatherByCity(city)`  
- `renderWeather(data)`  
- `setStatus({loading, error})`  
- `initCurrentLocation()`  
- `onSearch()`

이렇게 나누면:
- “데이터 가져오기”와 “화면 그리기”가 섞이지 않아서 유지보수 쉬움.

---

## 4) 완성본 예시 (index.html 한 파일)
아래 코드는 **그대로 붙여넣으면 동작**하는 형태입니다.  
(필수: `API_KEY`에 본인 키 입력)

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Weather Dashboard</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
    .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    input { padding: 10px 12px; border: 1px solid #ccc; border-radius: 10px; width: 240px; }
    button { padding: 10px 12px; border: 1px solid #222; background: #111; color: #fff; border-radius: 10px; cursor: pointer; }
    button:disabled { opacity: .6; cursor: not-allowed; }
    .card { margin-top: 16px; border: 1px solid #e5e5e5; border-radius: 16px; padding: 16px; box-shadow: 0 6px 18px rgba(0,0,0,.06); }
    .muted { color: #666; }
    .error { color: #c62828; margin-top: 10px; }
    .loading { margin-top: 10px; }
    .weather-top { display:flex; align-items:center; justify-content:space-between; gap: 12px; }
    .temp { font-size: 40px; font-weight: 800; }
    .grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
    .kv { border: 1px solid #f0f0f0; border-radius: 12px; padding: 10px; }
    .kv .k { font-size: 12px; color: #777; }
    .kv .v { font-size: 16px; font-weight: 700; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>실시간 날씨 앱</h1>

  <div class="row">
    <input id="cityInput" type="text" placeholder="도시 이름 (예: Seoul)" />
    <button id="searchBtn">도시 검색</button>
    <button id="myLocBtn">내 위치</button>
  </div>

  <div id="status" class="loading muted"></div>
  <div id="error" class="error"></div>

  <div id="weatherCard" class="card" style="display:none;">
    <div class="weather-top">
      <div>
        <div id="cityName" style="font-size:20px; font-weight:800;"></div>
        <div id="desc" class="muted"></div>
      </div>
      <div style="text-align:right;">
        <img id="icon" alt="" width="64" height="64" />
      </div>
    </div>

    <div class="temp"><span id="temp"></span>°C</div>

    <div class="grid">
      <div class="kv"><div class="k">체감 온도</div><div class="v"><span id="feels"></span>°C</div></div>
      <div class="kv"><div class="k">습도</div><div class="v"><span id="humidity"></span>%</div></div>
      <div class="kv"><div class="k">바람</div><div class="v"><span id="wind"></span> m/s</div></div>
      <div class="kv"><div class="k">기압</div><div class="v"><span id="pressure"></span> hPa</div></div>
    </div>

    <div class="muted" style="margin-top:10px;">
      업데이트: <span id="updatedAt"></span>
    </div>
  </div>

  <script>
    // 1) 본인 키 넣기
    const API_KEY = "YOUR_API_KEY_HERE";

    // 2) DOM
    const $ = (sel) => document.querySelector(sel);
    const cityInput = $("#cityInput");
    const searchBtn = $("#searchBtn");
    const myLocBtn = $("#myLocBtn");

    const statusEl = $("#status");
    const errorEl = $("#error");
    const cardEl = $("#weatherCard");

    const cityNameEl = $("#cityName");
    const descEl = $("#desc");
    const iconEl = $("#icon");
    const tempEl = $("#temp");
    const feelsEl = $("#feels");
    const humidityEl = $("#humidity");
    const windEl = $("#wind");
    const pressureEl = $("#pressure");
    const updatedAtEl = $("#updatedAt");

    // 3) 상태 UI
    function setStatus({ loading = false, error = "" } = {}) {
      statusEl.textContent = loading ? "불러오는 중..." : "";
      errorEl.textContent = error;
      searchBtn.disabled = loading;
      myLocBtn.disabled = loading;
    }

    // 4) fetch 공통 (핵심: response.ok 체크)
    async function fetchJson(url) {
      const res = await fetch(url);
      if (!res.ok) {
        // OpenWeather는 404/401 등의 상태 코드를 내려줌
        throw new Error(`요청 실패 (HTTP ${res.status})`);
      }
      return res.json();
    }

    // 5) API 호출
    function buildUrlByCity(city) {
      const q = encodeURIComponent(city.trim());
      return `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=metric`;
    }

    function buildUrlByCoords(lat, lon) {
      return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    }

    async function getWeatherByCity(city) {
      return fetchJson(buildUrlByCity(city));
    }

    async function getWeatherByCoords(lat, lon) {
      return fetchJson(buildUrlByCoords(lat, lon));
    }

    // 6) 렌더
    function renderWeather(data) {
      // 안전하게 필요한 값만 꺼내기
      const name = data?.name ?? "-";
      const main = data?.main ?? {};
      const wind = data?.wind ?? {};
      const weather0 = data?.weather?.[0] ?? {};

      cityNameEl.textContent = name;
      descEl.textContent = weather0.description ? weather0.description : "날씨 정보";
      tempEl.textContent = Math.round(main.temp ?? 0);
      feelsEl.textContent = Math.round(main.feels_like ?? 0);
      humidityEl.textContent = main.humidity ?? "-";
      windEl.textContent = wind.speed ?? "-";
      pressureEl.textContent = main.pressure ?? "-";

      // 아이콘
      if (weather0.icon) {
        iconEl.src = `https://openweathermap.org/img/wn/${weather0.icon}@2x.png`;
        iconEl.style.display = "";
      } else {
        iconEl.removeAttribute("src");
        iconEl.style.display = "none";
      }

      updatedAtEl.textContent = new Date().toLocaleString();
      cardEl.style.display = "block";
    }

    // 7) 내 위치
    function initCurrentLocation() {
      if (!navigator.geolocation) {
        setStatus({ loading: false, error: "이 브라우저는 위치 기능을 지원하지 않습니다." });
        return;
      }

      setStatus({ loading: true, error: "" });

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const data = await getWeatherByCoords(latitude, longitude);
            renderWeather(data);
            setStatus({ loading: false, error: "" });
          } catch (e) {
            setStatus({ loading: false, error: e.message || "날씨 요청 중 오류가 발생했습니다." });
          }
        },
        (err) => {
          // 권한 거부/시간초과/기타
          const msg =
            err.code === err.PERMISSION_DENIED ? "위치 권한이 거부되었습니다. 도시 검색을 사용하세요." :
            err.code === err.POSITION_UNAVAILABLE ? "위치 정보를 사용할 수 없습니다." :
            err.code === err.TIMEOUT ? "위치 요청 시간이 초과되었습니다." :
            "알 수 없는 위치 오류가 발생했습니다.";
          setStatus({ loading: false, error: msg });
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
      );
    }

    // 8) 도시 검색
    async function onSearch() {
      const city = cityInput.value.trim();
      if (!city) {
        setStatus({ loading: false, error: "도시 이름을 입력하세요." });
        return;
      }

      try {
        setStatus({ loading: true, error: "" });
        const data = await getWeatherByCity(city);
        renderWeather(data);
        setStatus({ loading: false, error: "" });
      } catch (e) {
        // 404면 보통 도시명을 못 찾은 케이스
        setStatus({ loading: false, error: "해당 도시를 찾을 수 없거나 요청에 실패했습니다." });
      }
    }

    // 9) 이벤트
    searchBtn.addEventListener("click", onSearch);
    myLocBtn.addEventListener("click", initCurrentLocation);
    cityInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onSearch();
    });

    // 10) 초기 실행: 내 위치
    document.addEventListener("DOMContentLoaded", initCurrentLocation);
  </script>
</body>
</html>
```

---

## 5) 체크리스트 (이거 맞으면 합격)
- [ ] 첫 로드에 위치 권한 요청 → 허용 시 현재 위치 날씨 표시
- [ ] 거부/실패 시 사용자에게 “도시 검색 쓰세요” 메시지
- [ ] 도시 검색 버튼 + Enter로 검색 가능
- [ ] fetch에서 `response.ok` 체크로 404/401 처리
- [ ] 로딩 중 버튼 비활성화 + “불러오는 중…” 표기
- [ ] 날씨 아이콘 표시

---

## 6) 흔한 문제 5개
1) **키가 틀림 / 키 없음** → 보통 401  
2) **HTTP인데 위치 권한이 안 뜸** → HTTPS에서만 되는 경우 많음 citeturn6view2  
3) **fetch 에러가 catch로 안 감** → 404여도 reject 안 될 수 있어 ok 체크 필수 citeturn6view3  
4) **도시명 공백/특수문자** → `encodeURIComponent` 안 해서 망함  
5) **아이콘이 안 뜸** → icon 코드로 URL 구성해야 함 citeturn11view3  

MD
