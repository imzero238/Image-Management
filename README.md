# Image Management

> - Front-end: REACT
> - Back-end: Node.js
> - Database: MongoDB

<br>

## 기능 설명

### 계정

> https://github.com/evelyn82ny/Image-Management/blob/main/_review/account.md

- 계정 관련 기능은 회원 가입, 로그인 그리고 로그 아웃
- 회원 가입을 하면 password에 암호화하여 보안을 강화하고자 함
- 회원 가입과 로그인 후 사용자 상태가 유지될 수 있도록 Session 적용
<br>

### 이미지

> https://github.com/evelyn82ny/Image-Management/blob/main/_review/image_feat.md

- 이미지를 업로드되는 상태를 출력하기 위한 Percentage bar 기능 추가
- 이미지를 업로드하면 Main Page에 바로 출력
- 이미지를 공개, 비공개로 구분
<br>

### 이미지 관리

> https://github.com/evelyn82ny/Image-Management/blob/main/_review/mongodb_connection.md

- **MongoDB**와 **AWS S3**에서 이미지를 관리
- **AWS S3**에서 원본 이미지를 2가지 사이즈로 규격화하여 관리
<br>

### 이미지 출력

- Cursor-based Pagination 적용: https://velog.io/@evelyn82ny/cursor-based-pagination
- Infinite Scroll 적용: https://velog.io/@evelyn82ny/infinite-scroll

<br>

## 발생한 이슈

### 비동기 처리로 인해 접근 권한을 받지 못한 문제

> https://velog.io/@evelyn82ny/JavaScript-Asynchronous-issue

공개, 비공개 이미지로 서비스를 분리하니 비공개 이미지를 가져올 때만 접근 권한이 없다는 문제가 발생해 이미지를 불러올 수 없었다. 이는 JavaScript의 비동기 처리로 인해 발생하는 문제였으며 **setTimeout** 을 추가해 해당 문제를 해결했다.
<br>

### AWS S3 연결하고 발생한 문제들

> https://velog.io/@evelyn82ny/Issues-caused-by-AWS-S3-and-pre-signed-URL

- AWS S3를 연결하고 **CORS 정책 문제**가 발생했는데 구성을 추가해 해결했다.
- 사용자가 이미지를 업로드하면 새로고침을 해야만 화면에 출력되는 문제가 발생했고 이는 접근할 수 없는 image source에 접근했기 때문에 생긴 문제였다. 이를 image source가 유효한지 확인하는 Component를 생성해 해당 문제를 해결했다.
- 사용자가 업로드하는 이미지의 크기는 다양하기 때문에 규격화하여 이미지를 가져올 때의 속도를 개선하고자 했다. 
<br>

### Infinite Scroll 구현하고 발생한 문제들

> https://velog.io/@evelyn82ny/infinite-scroll

- 스크롤을 내리면 새로운 이미지가 제대로 로드되었지만 스크로를 다시 위로 올리면 Same Key라는 문제가 발생했다. 이는 Observer에게 기존 관찰 대상에 대한 관찰을 중지시켜 문제를 해결했다.
- 특정 이미지에 대한 상태를 변경하고 Main 화면으로 돌아오면 이미지가 알 수 없는 순서로 재배치되었다. 이는 이미지를 불러올 때 정렬 기준을 잘못 작성해 발생한 문제였다.