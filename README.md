# Image Management

- Front-end: REACT
- Back-end: Node.js
- Database: MongoDB

<br>

- [이미지 업로드 Percentage Bar](#percentage-bar)
- [MongoDB 연동](#mongodb-연동)
- [업로드한 이미지 바로 출력](#업로드한-이미지를-바로-출력하기)
- [계정 관리 및 Session 적용](#계정-관리)

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

<br>

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
- ```key```: 이미지의 filename field (uuid로 생성되기 때문에 중복될 가능성 거의 없음, 이미지의 originalname field 는 중복될 가능성 있음)
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

<img src="https://user-images.githubusercontent.com/54436228/170871509-aaf832cc-ab21-43d6-8a4c-a3fd8fbb44bc.gif">

<br>

## 계정 관리

```js
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        username: { type: String, required: true, unique: true },
        password: {type: String, required: true}
    },
    { timestamps: true }
);
module.exports = mongoose.model("user", UserSchema);
```

```name```, ```username```, ```password``` field를 갖는 user로 회원가입, 로그인 그리고 로그아웃 기능을 만든다.
<br>

### Signup

> Commit: https://github.com/evelyn82ny/Image-Management/commit/05fe39145ca1362246dcc824fe05298f2ae56e6a

![png](/_img/signup.png)

- POST: ```http://localhost:5050/users/singup```
- JSON 형식으로 ```name```, ```username```, ```password``` field 값을 채워 POST 요청

<br>

> Hashed password commit: https://github.com/evelyn82ny/Image-Management/commit/8d3912dbae530a2bb1ad215ef479a5e9940d7c64


```js
userRouter.post("/register", async(req, res) => {
    const hashedPassword = await hash(req.body.password, 10);
    await new User({
        name: req.body.name,
        username: req.body.username,
        hashedPassword
    }).save();
});
```

- 네트워크 상에서 비밀번호를 전달하는 것은 위험
- 비밀번호 암호화를 위해 ```bcryptjs``` 모듈의 ```hash()``` 사용
- ```hash(field, salt)``` -> salt 값이 클수록 더 복잡한 값이 생성되지만 많은 시간 소요
<br>

```js
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        username: { type: String, required: true, unique: true },
        hashedPassword: {type: String, required: true}
    },
    { timestamps: true }
};
```
- user collection에서 ```password```를 ```hashedPassword```로 변경

<br>

> Apply session commit: https://github.com/evelyn82ny/Image-Management/commit/b1e9a53be4e99149a6950a146662b9139874ccbb

```js
userRouter.post("/signup", async(req, res) => {
    try {
        const hashedPassword = await hash(req.body.password, 10);
        const user = await new User({
            name: req.body.name,
            username: req.body.username,
            hashedPassword,
            sessions: [{ createdAt: new Date() }]
        }).save();
        const session = user.sessions[0];
        res.json({ 
            message: "user registered",
            sessionId: session._id,
            name: user.name
        });
    }// 생략
});
```

- 위 사진을 보면 회원 가입 후 server에서 sessionid를 생성
- 로그인상태를 유지하기 위해 Session 적용
- User를 생성할 때 session 을 추가
- 같은 계정을 여러 기기에서 접속하는 경우를 생각해 사용자는 여러 SessionId를 갖게 함
- 즉, sessions 에 추가
- 회원가입 후 만들어지는 session은 첫번째 session 이므로 ```user.sessions[0]``` 으로 접근
<br>

### Login

![png](/_img/login.png)

```js
userRouter.patch("/login", async (req, res) => {
    try{
        const user = await User.findOne({ username: req.body.username });
        const isValid = await compare(req.body.password, user.hashedPassword);
        if(!isValid)
            throw new Error("입력하신 정보가 올바르지 않습니다.");
        user.sessions.push({ createdAt: new Date() });
        const session = user.sessions[user.sessions.length - 1];
        await user.save();
        res.json({ 
            message: "login success",
            sessionId: session._id,
            name: user.name
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
```
- PATCH: ```http://localhost:5050/users/login```   
- 로그인 시 sessionid 만 추가하기 때문에 POST 에서 PATCH 로 변경
- JSON 형식으로 ```username```과 ```password``` 를 작성해 PATCH 요청
<br>

- password는 ```bcryptjs``` 모듈의 ```hash()``` 사용해 Hashed 함
- 그렇기 때문에 ```bcryptjs``` 모듈의 ```compare()``` 로 사용자가 입력한 ```password```와 DB에서 관리되는 ```hashedPassword```를 비교
<br>

### Log out

> Commit: https://github.com/evelyn82ny/Image-Management/commit/ff20682fe8ef27b2e6df1f17700a09731c708a1b

![png](/_img/logout.png)

```js
userRouter.patch("/logout", async (req, res)=> {
    try {
        const { sessionid } = req.headers;
        if(!mongoose.isValidObjectId(sessionid)) 
            throw new Error("invalid sessionid");
        const user = await User.findOne({ "sessions._id": sessionid });
        if(!user)
            throw new Error("No applicable users");
        await User.updateOne(
            { _id: user.id },
            { $pull: { sessions: { _id: sessionid } } }
        );
        res.json({ message: "log-out" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
```

- PATCH: ```http://localhost:5050/users/logout``` 
- 한 사용자의 여러 sessonid 중 해당되는 sessionid 를 삭제하므로 PATCH
- request header 로 sessionid를 넘겨줌
- ```updateOne()```으로 해당되는 sessionid 를 삭제하는데 ```$pull``` 사용하면 수정됨