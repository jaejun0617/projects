# My Ultimate Dashboard

> 생산성과 집중력, 그리고 휴식을 한 곳에서 관리하는 개인 맞춤형 웹 대시보드입니다.

**프로젝트 기간:** 2025년 9월 18일 ~ 진행 중

---

### **1. 프로젝트 개요**

- **프로젝트명:** My Ultimate Dashboard
- **목표:** 순수 HTML, CSS, JavaScript(ES6+ Modules)를 활용하여 생산성 향상을 위한 개인 맞춤형 웹 대시보드를 개발합니다. 이 프로젝트를 통해 프론트엔드 개발의 핵심 역량인 동적 UI 구현, 비동기 API 통신, 로컬 데이터 관리, SPA(Single Page Application) 아키텍처 설계를 종합적으로 학습하고 체득합니다.
- **핵심 컨셉:** 사용자가 필요로 하는 모든 정보와 도구를 한 화면에 통합하고, 페이지 이동 시에도 끊김 없는 사용자 경험(UX)을 제공하는 '나만의 지능형 공간'을 구현합니다.

---

### **2. 핵심 기술 스택**

- **HTML5**: 시맨틱 태그(`header`, `main`, `aside`)를 사용하여 웹 페이지의 구조를 명확하게 설계합니다.
- **CSS3**:
   - **Layout**: Flexbox와 Grid를 사용하여 반응형 위젯 레이아웃을 구성합니다.
   - **Styling**: Glassmorphism 디자인을 적용하고, CSS 변수(Variables)를 활용하여 테마 변경을 효율적으로 관리합니다.
   - **Animation**: `transition`과 `@keyframes`를 사용하여 부드러운 시각적 효과를 구현합니다.
- **JavaScript (ES6+)**:
   - **SPA (Single Page Application)**: `fetch` API를 활용하여 페이지 새로고침 없이 콘텐츠를 동적으로 로드하고 렌더링합니다.
   - **DOM Control**: 동적으로 HTML 요소를 생성하고 제어하여 사용자 인터랙션에 반응합니다.
   - **Asynchronous**: `fetch`와 `async/await`를 사용하여 외부 API 데이터(Google, 날씨 등)를 비동기적으로 가져옵니다.
   - **Data Storage**: `localStorage`를 사용하여 할 일, 습관, 메모 등 사용자 데이터를 브라우저에 영구적으로 저장합니다.
   - **Modules**: 기능별로 JavaScript 파일을 분리(모듈화)하여 코드의 유지보수성과 재사용성을 극대화합니다.
- **외부 API**:
   - **YouTube IFrame Player API**: 전역 음악 플레이어의 영상 재생 및 제어
   - **Google API (OAuth 2.0 & YouTube Data API)**: Google 계정 인증 및 개인화된 YouTube 데이터(좋아요 목록, 검색) 연동
   - **Chart.js**: '오늘 달성률' 및 '분석' 페이지의 데이터 시각화
   - **FullCalendar.js**: '전체 캘린더' 페이지의 일정 관리 기능 구현

---

### **3. 구현된 기능 상세 목록**

#### **Part 1: 메인 대시보드 (Dashboard)**

1. **실시간 시계 & 환영 메시지 (Time & Greeting)**
   - `setInterval`을 사용하여 1초마다 현재 시간과 날짜를 갱신합니다.
   - 시간에 따라 "Good Morning" 등 환영 메시지가 동적으로 변경됩니다.
2. **날씨 위젯 (Weather)**
   - (구현 예정) Geolocation API로 사용자 위치를 파악하고, OpenWeatherMap API로 날씨 정보를 표시합니다.
3. **오늘의 습관 (Habit Tracker)**
   - 카테고리(그룹) 및 개별 습관의 CRUD(생성, 읽기, 수정, 삭제) 기능을 구현했습니다.
   - 날짜가 바뀌면 모든 습관의 완료 상태가 자동으로 초기화됩니다.
   - PC에서는 더블클릭, 모바일에서는 '길게 누르기'로 카테고리 이름을 수정할 수 있습니다.
4. **오늘의 할 일 (To-Do List)**
   - 할 일의 CRUD 및 완료/진행중/전체 필터링 기능을 구현했습니다.
   - 드래그 앤 드롭으로 할 일의 순서를 자유롭게 변경할 수 있습니다.
5. **간단한 메모장 (Notepad)**
   - `textarea`에 입력된 내용을 `localStorage`에 실시간으로 자동 저장합니다.
6. **북마크 (Bookmark)**
   - 개발 및 개인 용도로 자주 사용하는 사이트 링크를 모아둔 위젯입니다.
7. **오늘 달성률 (Daily Progress)**
   - '오늘의 습관'과 '오늘의 할 일' 완료 현황을 합산하여 전체 달성률을 실시간으로 계산합니다.
   - Chart.js를 사용하여 달성률을 세련된 멀티링 도넛 차트로 시각화합니다.
   - 100% 달성 시 동적인 축하 애니메이션 효과가 나타납니다.

#### **Part 2: 개별 페이지 (Pages)**

1. **전체 캘린더 (Full Calendar)**
   - FullCalendar.js 라이브러리를 연동하여 월별 일정을 한눈에 볼 수 있는 페이지를 구현했습니다.
2. **분석 (Analytics)**
   - `localStorage`에 저장된 습관 및 할 일 데이터를 기반으로 사용자의 생산성을 분석합니다.
   - 기간(7/14/30일) 필터링 기능을 제공하며, 선택된 기간에 따라 모든 통계와 차트가 실시간으로 업데이트됩니다.
   - **시각화**: 기간별 완료 현황(막대 차트), 완료 항목 비율(도넛 차트), 성과 요약 카드(일일 평균, 최고 성과 요일 등).
3. **음악 플레이어 (Music Player)**
   - **전역 백그라운드 재생**: `index.html`에 보이지 않는 실제 플레이어를 배치하여, **어떤 페이지로 이동해도 음악이 끊기지 않습니다.**
   - **UI 동기화**: '음악' 페이지에 진입할 때마다, 현재 재생 중인 곡의 정보(썸네일, 제목, 진행률)가 UI에 완벽하게 동기화됩니다.
   - **YouTube 검색**: YouTube Data API를 연동하여 원하는 노래를 직접 검색하고 즉시 재생할 수 있습니다.
   - **Google 계정 연동**: 로그인 시, 사용자의 '좋아요' 표시 동영상 목록을 불러와 개인화된 플레이리스트를 자동으로 생성합니다.

---

### **4. 프로젝트 디렉토리 구조**

SPA 아키텍처와 모듈화를 기반으로 확장성과 유지보수성을 극대화했습니다.

```bash
my-ultimate-dashboard/
├── 📄 index.html              # 앱의 기본 골격 (Shell), 전역 플레이어 포함
├── 📂 pages/                   # SPA로 동적으로 로드될 페이지 HTML 파일들
│   ├── analytics.html
│   ├── calendar.html
│   └── music.html
├── 📂 css/                     # CSS 스타일시트
│   ├── layout.css              # 전역 레이아웃 및 반응형 그리드
│   └── components.css          # 위젯, 버튼 등 개별 컴포넌트 스타일
├── 📂 js/
│   ├── 📜 script.js            # 메인 스크립트 (모듈 로더, SPA 페이지 전환 관리)
│   ├── 📂 modules/             # 기능별 JavaScript 모듈
│   │   ├── analytics.js
│   │   ├── calendar.js
│   │   ├── daily.js            # 오늘 달성률 차트
│   │   ├── habit.js
│   │   ├── memo.js
│   │   ├── music.js            # 전역 플레이어 & 음악 페이지 UI
│   │   ├── timeManager.js      # 시계 & 환영 메시지
│   │   ├── todo.js
│   │   └── ...
│   └── 📂 utils/               # 공통 유틸리티 모듈
│       ├── config.js           # API 키 로더 (google_config.json)
│       └── storage.js          # localStorage 공통 모듈
├── 📂 data/
│   └── google_config.json      # (직접 생성 필요) Google API 설정 파일
├── 📂 assets/                  # 아이콘, 이미지 등 정적 리소스
└── 📄 README.md
```
