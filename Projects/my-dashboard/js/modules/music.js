/**
 * ===================================================================================
 * ✨ My Ultimate Dashboard - Music Player 모듈 (숨겨진 전역 플레이어) ✨
 * ===================================================================================
 *
 * 이 모듈은 페이지 전환 시에도 음악이 끊기지 않는 전역 플레이어 기능을 제공합니다.
 * SPA 아키텍처와 통합되어 있으며, UI와 실제 플레이어 역할이 분리되어 있습니다.
 *
 * --- 아키텍처 ---
 * 1. [실제 플레이어] - 보이지 않는 YouTube IFrame 플레이어
 *    - index.html에 숨겨져 있으며 앱 생명주기 동안 1회만 생성
 *    - 음악 재생 및 제어를 담당
 * 2. [UI 리모컨] - music.html의 플레이어 UI
 *    - 실제 플레이어는 없고 전역 플레이어 상태를 보여주고 제어
 *
 * --- 주요 기능 ---
 * - 페이지 이동 시 음악 끊김 없이 백그라운드 재생
 * - 음악 페이지 진입 시 UI와 전역 플레이어 동기화
 * - YouTube 검색 API로 동영상 검색
 * - Google OAuth 2.0으로 '좋아요' 동영상 목록 등 개인화 플레이리스트 불러오기
 *
 * --- 핵심 함수 ---
 * - initMusicPlayer(): music 페이지 진입 시 UI 초기화, 전역 플레이어 동기화, 이벤트 바인딩
 * - createPlayer(): 보이지 않는 YouTube IFrame 생성, 이벤트 연결
 * - playTrack(), playNextTrack(), playPrevTrack(), togglePlayPause(): 재생 제어
 * - startProgressUpdater(), stopProgressUpdater(), seekTo(): 진행률 관리
 * - initializeGsiClient(), initializeGapiClient(): OAuth 초기화
 * - fetchLikedVideos(): 사용자의 '좋아요' 동영상 로드
 * ===================================================================================
 */

import { loadGoogleConfig } from './config.js';

// -------------------- 전역 상태 --------------------
let player = null; // YT.Player 객체
let playerInitialized = false; // 플레이어 생성 여부 체크
let tokenClient; // OAuth 토큰 클라이언트
let updateInterval; // 진행률 업데이트 인터벌

// 샘플 플레이리스트
const playlists = {
   bigbangHits: [
      {
         id: 'OsA3iPO2fEg',
         title: 'Playlist 에라 모르겠다 오늘은 빅뱅이다',
         thumbnail: 'https://img.youtube.com/vi/OsA3iPO2fEg/hqdefault.jpg',
      },
   ],
   EDM2025: [
      {
         id: 'r_8Xm3XowCM',
         title: 'Music Mix 2025 🎧 EDM Remixes Of Popular Songs',
         thumbnail: 'https://img.youtube.com/vi/r_8Xm3XowCM/hqdefault.jpg',
      },
   ],
};

let currentPlaylist = [];
let currentTrackIndex = 0;

// YouTube IFrame API 로드
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag) firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// -------------------- 모듈 초기화 --------------------
export async function initMusicPlayer() {
   const container = document.querySelector('.music-container');
   if (!container) return;

   // --- DOM 요소 캐싱 ---
   const playPauseBtn = container.querySelector('#play-pause-btn');
   const nextBtn = container.querySelector('#next-btn');
   const prevBtn = container.querySelector('#prev-btn');
   const trackTitleEl = container.querySelector('#track-title');
   const currentTimeEl = container.querySelector('#current-time');
   const durationEl = container.querySelector('#duration');
   const progressBar = container.querySelector('#progress-bar');
   const progressBarContainer = container.querySelector(
      '.progress-bar-container',
   );
   const playerMessage = container.querySelector('#player-message');
   const loginBtn = container.querySelector('#youtube-login-btn');
   const logoutBtn = container.querySelector('#youtube-logout-btn');
   const loggedOutView = container.querySelector('#auth-status-logged-out');
   const loggedInView = container.querySelector('#auth-status-logged-in');
   const userNameEl = container.querySelector('#user-name');
   const playlistGrid = container.querySelector('.playlist-grid');
   const playIcon = playPauseBtn.querySelector('.icon-play');
   const pauseIcon = playPauseBtn.querySelector('.icon-pause');

   // --- 1. 전역 플레이어 초기화 (최초 1회) ---
   if (!playerInitialized) {
      playerInitialized = true;

      window.onYouTubeIframeAPIReady = () => {
         if (document.getElementById('youtube-player') && !player)
            player = createPlayer();
      };
      if (
         window.YT?.Player &&
         document.getElementById('youtube-player') &&
         !player
      )
         player = createPlayer();

      // 실제 YouTube 플레이어 생성
      function createPlayer() {
         return new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0 },
            events: {
               onReady: onPlayerReady,
               onStateChange: onPlayerStateChange,
            },
         });
      }

      // 플레이어 준비 완료 이벤트
      function onPlayerReady() {
         playPauseBtn.addEventListener('click', togglePlayPause);
         nextBtn.addEventListener('click', playNextTrack);
         prevBtn.addEventListener('click', playPrevTrack);
         progressBarContainer.addEventListener('click', seekTo);
      }

      // 플레이어 상태 변화 이벤트
      function onPlayerStateChange(event) {
         updatePlayPauseButton(event.data);
         if (event.data === YT.PlayerState.PLAYING) {
            trackTitleEl.textContent =
               player.getVideoData().title || '제목 정보 없음';
            playerMessage?.parentElement?.classList.add('hidden');
            updateTrackInfo();
            startProgressUpdater();
         } else stopProgressUpdater();

         // 재생 종료 후 다음 트랙
         if (event.data === YT.PlayerState.ENDED && currentPlaylist.length > 1)
            playNextTrack();
      }

      // Google OAuth 초기화
      const config = await loadGoogleConfig();
      if (config) {
         initializeGsiClient(config);
         initializeGapiClient();
      }
   }

   // --- 2. SPA 대응: DOM 교체 후 UI 다시 렌더링 ---
   renderPlaylists();
   playlistGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.playlist-card');
      if (card) loadPlaylist(card.dataset.playlist);
   });
   loginBtn.addEventListener('click', handleAuthClick);
   logoutBtn.addEventListener('click', handleSignoutClick);

   // -------------------- 내부 함수 --------------------
   // 플레이리스트 UI 렌더링
   function renderPlaylists() {
      playlistGrid.innerHTML = '';
      for (const key in playlists) {
         const playlist = playlists[key];
         if (playlist.length > 0)
            addDynamicPlaylist(key, playlist[0].title, playlist);
      }
   }

   // 동적 플레이리스트 카드 생성
   function addDynamicPlaylist(key, title, videos) {
      if (playlistGrid.querySelector(`[data-playlist="${key}"]`)) return;
      if (key === 'liked')
         playlists[key] = videos.map((v) => ({ id: v.id, title: v.title }));
      const card = document.createElement('button');
      card.className =
         key === 'liked' ? 'playlist-card dynamic' : 'playlist-card';
      card.dataset.playlist = key;
      let displayName =
         key === 'bigbangHits'
            ? 'BIGBANG Hits'
            : key === 'EDM2025'
              ? '🚀 EDM Mix'
              : key === 'liked'
                ? '❤️ 좋아요 표시한 동영상'
                : title;
      card.innerHTML = `<img src="${videos[0]?.thumbnail || ''}" alt="${displayName}"><span>${displayName}</span>`;
      playlistGrid.appendChild(card);
   }

   // 플레이리스트 로드
   function loadPlaylist(name) {
      currentPlaylist = playlists[name];
      currentTrackIndex = 0;
      playTrack(currentTrackIndex);
   }

   // -------------------- 재생 제어 --------------------
   function playTrack(index) {
      if (!player || !currentPlaylist?.[index]) return;
      player.loadVideoById(currentPlaylist[index].id);
      setTimeout(() => player?.playVideo?.(), 150);
   }

   function playNextTrack() {
      if (!currentPlaylist.length) return;
      currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
      playTrack(currentTrackIndex);
   }

   function playPrevTrack() {
      if (!currentPlaylist.length) return;
      currentTrackIndex =
         (currentTrackIndex - 1 + currentPlaylist.length) %
         currentPlaylist.length;
      playTrack(currentTrackIndex);
   }

   function togglePlayPause() {
      if (!player?.getPlayerState) return;
      if (player.getPlayerState() === YT.PlayerState.PLAYING)
         player.pauseVideo();
      else player.playVideo();
   }

   function updatePlayPauseButton(state) {
      if (state === YT.PlayerState.PLAYING) {
         if (playIcon) playIcon.style.display = 'none';
         if (pauseIcon) pauseIcon.style.display = 'block';
         playPauseBtn.setAttribute('aria-label', '일시정지');
      } else {
         if (playIcon) playIcon.style.display = 'block';
         if (pauseIcon) pauseIcon.style.display = 'none';
         playPauseBtn.setAttribute('aria-label', '재생');
      }
   }

   // 진행률 표시 업데이트
   function updateTrackInfo() {
      if (!player?.getDuration) return;
      durationEl.textContent = formatTime(player.getDuration());
   }

   function startProgressUpdater() {
      stopProgressUpdater();
      updateInterval = setInterval(() => {
         if (!player?.getCurrentTime) return;
         const currentTime = player.getCurrentTime();
         const duration = player.getDuration();
         progressBar.style.width = `${(currentTime / duration) * 100 || 0}%`;
         currentTimeEl.textContent = formatTime(currentTime);
      }, 1000);
   }

   function stopProgressUpdater() {
      clearInterval(updateInterval);
   }

   function seekTo(event) {
      if (!player?.getDuration) return;
      const barWidth = progressBarContainer.clientWidth;
      const seekTime = (event.offsetX / barWidth) * player.getDuration();
      player.seekTo(seekTime, true);
   }

   function formatTime(time) {
      time = Math.round(time);
      const min = String(Math.floor(time / 60)).padStart(2, '0');
      const sec = String(time % 60).padStart(2, '0');
      return `${min}:${sec}`;
   }

   // -------------------- Google OAuth --------------------
   function initializeGapiClient() {
      if (window.gapi?.client) {
         gapi.client.init({}).then(() => gapi.client.load('youtube', 'v3'));
      } else setTimeout(initializeGapiClient, 100);
   }

   function initializeGsiClient(config) {
      if (window.google?.accounts) {
         tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: config.CLIENT_ID,
            scope: config.SCOPES,
            callback: (tokenResponse) => {
               if (tokenResponse?.access_token) {
                  gapi.client.setToken(tokenResponse);
                  showLoggedInView();
                  fetchLikedVideos();
               }
            },
         });
      } else setTimeout(() => initializeGsiClient(config), 100);
   }

   function handleAuthClick() {
      if (tokenClient) tokenClient.requestAccessToken({ prompt: 'consent' });
      else alert('인증 라이브러리가 아직 로드되지 않았습니다.');
   }

   function handleSignoutClick() {
      const token = gapi.client.getToken();
      if (token) {
         google.accounts.oauth2.revoke(token.access_token, () => {
            gapi.client.setToken(null);
            showLoggedOutView();
         });
      }
   }

   function showLoggedInView() {
      loggedInView.style.display = 'block';
      loggedOutView.style.display = 'none';
      gapi.client.youtube.channels
         .list({ part: 'snippet', mine: true })
         .then((res) => {
            if (res.result.items?.length > 0)
               userNameEl.textContent = res.result.items[0].snippet.title;
         });
   }

   function showLoggedOutView() {
      loggedInView.style.display = 'none';
      loggedOutView.style.display = 'block';
      userNameEl.textContent = '';
      playlistGrid
         .querySelectorAll('.dynamic')
         .forEach((card) => card.remove());
   }

   async function fetchLikedVideos() {
      try {
         const response = await gapi.client.youtube.videos.list({
            part: 'snippet',
            myRating: 'like',
            maxResults: 25,
         });
         const likedVideos = response.result.items.map((item) => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
         }));
         if (likedVideos.length > 0)
            addDynamicPlaylist('liked', '❤️ 좋아요 표시한 동영상', likedVideos);
      } catch (err) {
         console.error("YouTube API '좋아요' 목록 호출 오류:", err);
      }
   }
}
