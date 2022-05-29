# Image Management

- [이미지 업로드 Percentage Bar](#percentage-bar)
- [MongoDB 연동](#mongodb-연동)
- [업로드한 이미지 바로 출력](#업로드한-이미지를-바로-출력하기)

<br>

## Percentage Bar

> Commit: https://github.com/evelyn82ny/Image-Management/commit/cd4e68a1cc04fa59ca2e05c9b0bacfca9201e286

<img src="https://user-images.githubusercontent.com/54436228/170850429-f2f7197d-012a-459f-8901-406265178709.gif">

- 이미지 업로드되는 상태를 나타내기 위한 Percentage bar
- 업로드한 이미지에 대해 제출 버튼을 누르면 서버에 전달
- 중간에 멈추면 잘린 이미지가 저장됨
- **Network**를 ```Fast 3G``` 또는 ```Slow 3G``` 로 설정해야 Percentage bar 의 움직임을 볼 수 있음 (실제로는 빠르게 처리되기 때문)

<br>

```js
const UploadForm = () => {
    const defaultFileName = "이미지 파일을 업로드 해주세요";
    const [file, setFile] = useState(null);                     // state 1
    const [imgSrc, setImgSrc] = useState(null);                 // state 2
    const [fileName, setFileName] = useState(defaultFileName);  // state 3
    const [percent, setPercent] = useState(0);                  // state 4
```

- **Components**의 hooks에서 State 4가 percentage bar 
- View에서 보이는 Percentage bar 가 변경됨에 따라 State 4 값도 변경

<br>

```js
const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await axios.post("/upload", formData, {
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: (e) => {
                    setPercent(Math.round((100 * e.loaded) / e.total));
                },
            });
```
- 업로드 되는 상태를 percent 로 설정
- 소수점 반올림을 위해 ```Math.round()``` 사용

<br>

```js
import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar-boundary">
      <div style={{ width: `${percent}%` }}>{percent}%</div>
    </div>
  );
};

export default ProgressBar;
```

- ProgressBar.css 에서 스타일링하고
- 전달받은 percent를 ```percent%``` 형식으로 출력

```js
const UploadForm = () => {
    return (
        <form onSubmit={onSubmit}>
            <img src={imgSrc} className="image-preview" />
            <ProgressBar percent ={percent} />
            <div className="file-dropper">
```

- ```이미지 미리보기```와 ```이미지 업로드 위치``` 사이에 ```Percentage bar```를 위치

<br>

### 이미지 업로드 후 처음 상태로 돌아가기

<img src = "https://user-images.githubusercontent.com/54436228/170850608-38df45d2-bde1-4225-9a80-70ab9f2d217b.gif">

![png](/_img/convert_to_initial_state.png)

```js
const onSubmit = async (e) => {
        try {
            // axios로 이미지 처리
            toast.success("이미지 업로드 성공!");
            setTimeout(() => {
                setPercent(0);
                setFileName(defaultFileName);
                setImgSrc(null);
            }, 3000);
        } catch (err) {
            toast.error(err.message);
            setPercent(0);
            setFileName(defaultFileName);
            setImgSrc(null);
            console.error(err);
        }
```

- 이미지 업로드가 성공적으로 끝나거나 에러가 발생했을 경우 처음 상태를 출력
- 처음 상태: percentage를 0으로 설정하고 이미지 업로드 부분에 새로운 이미지 업로드를 위한 메시지 작성
    - ```setPercent(0)```: percentage를 0으로 설정
    - ```setFileName(defaultFileName)```: 새로운 이미지 업로드를 위한 메시지 작성
    - ```setImgSrc(null)```: 이미지 미리보기 없음

<br>

## MongoDB 연동

> Commit: https://github.com/evelyn82ny/Image-Management/commit/711ec603ec313ddb7321fa20d8c22c9c3aa0edce

```text
{
  fieldname: 'image',
  originalname: 'IMG_3038.jpeg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: './uploads',
  filename: '1f3fe0e8-d429-4896-902e-eaadf284cdc3.jpeg',
  path: 'uploads/1f3fe0e8-d429-4896-902e-eaadf284cdc3.jpeg',
  size: 1064257
}
```
- Image를 Upload하면 Requset에 담겨 있는 파일 정보에서 ```originalname```과 ```filename``` field로 Schema 생성
<br>

```js
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    key: { type: String, required: true },
    originalFileName: { type: String, required: true}
},
{timestamps: true}
);

module.exports = mongoose.model("image", ImageSchema);
```

- ```_id```: MongoDB 에서 자동 생성
- ```key```: 이미지의 filename field (uuid로 생성되기 때문에 중복될 가능성 거의 없음)
    - 이미지의 originalname field 는 중복될 가능성 있음
- ```originalFileName```: 이미지의 originalname field
<br>

![png](/_img/post_images_result.png)

![png](/_img/post_images_mongodb_result.png)

MongoDB에 정상적으로 저장됨을 확인할 수 있다.
<br>

### GET images

```js
app.get("/images", async (req, res) => {
        const images = await Image.find();
        res.json(images);
    })
```

- MongoDB에 있는 모든 Image를 가져오는 API 생성
- ```http://localhost:5050/images```

![png](/_img/get_images_result.png)

MongoDB에 정상적으로 이미지를 가져오는 것을 확인할 수 있다.

<br>

## 업로드한 이미지를 바로 출력하기

> Commit: https://github.com/evelyn82ny/Image-Management/commit/d801cc720cce7bf5bddea392d03c7aae59e9624c

<img src="https://user-images.githubusercontent.com/54436228/170866356-ea1fdf25-68ce-42b9-b399-5256d5db445f.gif" style="margin-left: auto; margin-right: auto; display: block;" />