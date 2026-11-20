# Grand Voyage 3D 항해 안내서

[항해 안내서 열기](https://bear2u.github.io/grand-voyage-3d-docs/)

교역·항해·함대·해전·일기토·세력전 규칙과 도감, 삽화 소설 「세 깃발의 바다」를 담았습니다. Astro와 Nimbus Docs로 만들고 한국어 본문 검색에는 Pagefind를 사용합니다.

## 로컬에서 읽고 점검하기

Node.js 24에서 실행합니다.

```sh
npm ci
npm run dev
```

배포 경로에서 링크와 그림을 검사하고 검색을 미리 보려면 다음 명령을 실행합니다.

```sh
export GUIDE_SITE_URL=https://bear2u.github.io
export GUIDE_BASE_PATH=/grand-voyage-3d-docs/
npm test
npm run typecheck
npm run build:deploy
npm run check:links
npm run preview
```

## 문서 관리

본문은 `src/content/docs/`, 소설 삽화와 게임 화면은 `src/assets/`에 있습니다. 항목을 추가하면 해당 길잡이와 날짜별 업데이트 내역도 갱신합니다. `main`에 푸시하면 GitHub Actions가 검사와 빌드를 거쳐 GitHub Pages에 게시합니다.

Nimbus의 MIT 라이선스는 `licenses/Nimbus-MIT.txt`, Noto Sans KR의 SIL Open Font License는 `public/fonts/NotoSansKR-OFL.txt`에 있습니다.
