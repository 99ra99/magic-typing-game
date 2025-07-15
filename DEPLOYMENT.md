# 🚀 배포 가이드

마법 주문 타이핑 게임을 GitHub Pages에 배포하는 방법입니다.

## 📋 사전 준비

1. **GitHub 계정** 필요
2. **Git** 설치 확인
3. **Node.js** 설치 확인

## 🔧 배포 단계

### 1. GitHub 리포지토리 생성

1. GitHub에서 새 리포지토리 생성
   - 리포지토리 이름: `magic-typing-game` (또는 원하는 이름)
   - Public으로 설정
   - README.md, .gitignore, license는 체크하지 않음 (이미 존재)

### 2. 로컬 Git 설정

```bash
# Git 초기화
git init

# 원격 리포지토리 연결 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/magic-typing-game.git

# 기본 브랜치를 main으로 설정
git branch -M main

# 모든 파일 추가
git add .

# 첫 번째 커밋
git commit -m "🎮 마법 주문 타이핑 게임 초기 버전

- React 기반 타이핑 게임 구현
- NPC 주문 사전 공개 UI
- 빈 입력 승리 버그 수정
- 마나 계산 NaN 버그 수정
- 게임스러운 UI 개선
- GitHub Pages 자동 배포 설정"

# GitHub에 업로드
git push -u origin main
```

### 3. package.json 수정

`package.json` 파일에서 homepage 필드를 수정하세요:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/magic-typing-game"
}
```

### 4. GitHub Pages 설정

1. GitHub 리포지토리 페이지로 이동
2. **Settings** 탭 클릭
3. **Pages** 섹션으로 스크롤
4. **Source**를 "GitHub Actions"로 설정

### 5. 자동 배포 확인

- 코드를 `main` 브랜치에 push하면 자동으로 배포됩니다
- **Actions** 탭에서 배포 진행상황을 확인할 수 있습니다
- 배포 완료 후 `https://YOUR_USERNAME.github.io/magic-typing-game`에서 게임을 플레이할 수 있습니다

## 🔄 업데이트 배포

코드를 수정한 후:

```bash
git add .
git commit -m "게임 업데이트: [수정 내용 설명]"
git push
```

자동으로 새 버전이 배포됩니다.

## 🐛 문제 해결

### 빌드 실패 시
- `npm run build` 명령으로 로컬에서 빌드 테스트
- 에러 메시지 확인 후 코드 수정

### 배포 실패 시
- GitHub Actions 로그 확인
- `package.json`의 homepage 필드 확인
- 브랜치 이름이 `main` 또는 `master`인지 확인

### 게임이 로드되지 않을 때
- 브라우저 캐시 삭제
- 개발자 도구 콘솔에서 에러 메시지 확인
- HTTPS 연결 확인

## 📝 추가 정보

- 배포 후 변경사항이 반영되기까지 몇 분이 걸릴 수 있습니다
- GitHub Pages는 정적 사이트만 지원하므로 백엔드 기능은 사용할 수 없습니다
- 무료 GitHub 계정의 경우 public 리포지토리에서만 GitHub Pages를 사용할 수 있습니다

---

🎮 **배포 후 게임을 즐겨보세요!** 