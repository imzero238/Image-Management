## Image Management

- Front-end: REACT
- Back-end: Node.js
- Database: MongoDB
- Storage: AWS S3

<br>

<img src="https://user-images.githubusercontent.com/54436228/173770479-4ae612ed-3da8-4f5e-b134-f18ba1b0570e.gif" />

사용자가 이미지를 공개 또는 비공개로 업로드할 수 있고, [Cursor-based pagination](https://medium.com/@nayoung8142/cursor-based-pagination-ed36296ce171) 기반의 Infinite Scroll으로 업로드한 사진을 볼 수 있는 서비스입니다.

<br>

![png](/_img/service_architecture.png)

- 사용자가 이미지에 대해 **GET** 요청하면 서버를 거치지 않고 AWS S3에 접근해 이미지를 가져온다.
- 사용자가 이미지에 대해 **POST** 요청하는 것은 **해당 서비스에 권한이 있어야 하므로** 서버에게 **Pre-signed Url**을 받아와 AWS S3에 접근해 저장한다.
- 사용자가 이미지에 대해 **POST** 요청하면 서버는 MongoDB에도 저장한다.
- 원본 이미지를 raw 폴더에 저장하고 **AWS Lambda**를 사용해 원본 이미지를 2가지 사이즈로 규격화한다.

<br>

## 🛠 기능

### 계정

> https://github.com/nayoung8142/Image-Management/blob/main/_review/account.md

- 계정 관련 기능은 회원 가입, 로그인 그리고 로그아웃
- 회원 가입을 하면 **password에 암호화**
- 회원 가입과 로그인 후 사용자 상태가 유지될 수 있도록 session 적용
<br>

### 이미지

> https://github.com/nayoung8142/Image-Management/blob/main/_review/image_feat.md

- 이미지를 업로드되는 상태를 출력하기 위한 Percentage bar 기능 추가
- 이미지를 업로드하면 Main Page에 바로 출력
- 이미지를 공개와 비공개로 구분
<br>

### 이미지 관리

> https://github.com/nayoung8142/Image-Management/blob/main/_review/mongodb_connection.md

- **MongoDB**와 **AWS S3**에서 이미지를 관리
- **AWS S3**에서 원본 이미지를 2가지 사이즈로 규격화하여 관리
<br>

### 이미지 출력

> - https://medium.com/@nayoung8142/cursor-based-pagination-ed36296ce171
> - https://medium.com/@nayoung8142/react-encountered-two-children-with-the-same-key-%EC%97%90%EB%9F%AC-2a5294d1a861

- **데이터가 중복 로드되는 것을 막기 위해** Cursor-based Pagination 적용
- Infinite Scroll 적용

<br>

## ❗️ 발생한 이슈

### 비동기 처리로 인해 접근 권한을 받지 못한 문제

> https://medium.com/@nayoung8142/javascript-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%B2%98%EB%A6%AC%EB%A1%9C-%EC%9E%91%EC%97%85-%EC%88%9C%EC%84%9C-%EC%A1%B0%EC%A0%88%ED%95%98%EA%B8%B0-734f9d0df068

- 비공개 이미지를 가져올 때 접근 권한이 없다는 문제가 발생해 이미지 로드 불가능
- JavaScript의 비동기 처리로 인해 발생하는 문제였으며, 접근 권한을 확인하는 작업과 이미지를 가져오는 작업의 순서를 제어해 해결함
  - callback 함수가 실행되는 우선순위는 Microtask Queue > Animation Frame > (macro) Task Queue
  - 접근 권한을 확인하는 작업에는 ```async/await``` 를 사용해 **Microtask Queue**에서 처리
  - 이미지를 가져오는 작업에는 ```setTimeout()``` 을 사용해 **(macro) Task Queue**에서 처리

<br>

### AWS S3 연결하고 발생한 문제들

> https://medium.com/@nayoung8142/aws-s3-pre-signed-url-%EC%82%AC%EC%9A%A9-%ED%9B%84-%EB%B0%9C%EC%83%9D%ED%95%9C-%EB%AC%B8%EC%A0%9C%EB%93%A4-feat-cors-fc5fdfe4077d

- AWS S3를 연결하고 **CORS 정책 문제**가 발생했는데 구성을 추가해 해결
- 사용자가 이미지를 업로드하면 새로고침을 해야만 화면에 출력되는 문제가 발생했고 이는 접근할 수 없는 image source에 접근했기 때문에 생긴 문제
    - 이를 image source가 유효한지 확인하는 Component를 생성해 해당 문제를 해결
- 사용자가 업로드하는 이미지의 크기는 다양하기 때문에 규격화하여 이미지를 가져올 때의 속도를 개선하고자 함 
<br>

### Infinite Scroll 구현하고 발생한 문제들

> https://medium.com/@nayoung8142/react-encountered-two-children-with-the-same-key-%EC%97%90%EB%9F%AC-2a5294d1a861

- 스크롤을 내리면 새로운 이미지가 제대로 로드되었지만 스크로를 다시 위로 올리면 Same Key라는 문제가 발생
    - 이는 Observer에게 기존 관찰 대상에 대한 관찰을 중지시켜 문제 해결
- 특정 이미지에 대한 상태를 변경하고 Main 화면으로 돌아오면 이미지가 알 수 없는 순서로 재배치됨
    - 이는 이미지를 불러올 때 정렬 기준을 잘못 작성해 발생한 문제