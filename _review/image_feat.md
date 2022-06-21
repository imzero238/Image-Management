# Image

- **MongoDB**와 **AWS S3**로 사용자와 사진을 관리

<br>

## Percentage Bar

> Create a bar that displays percentages commit: https://github.com/evelyn82ny/Image-Management/commit/cd4e68a1cc04fa59ca2e05c9b0bacfca9201e286

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


## 업로드한 이미지를 바로 출력하기

> Display uploaded images right away commit: https://github.com/evelyn82ny/Image-Management/commit/d801cc720cce7bf5bddea392d03c7aae59e9624c

<img src="https://user-images.githubusercontent.com/54436228/170871509-aaf832cc-ab21-43d6-8a4c-a3fd8fbb44bc.gif">

```js
const UploadForm = () => {
    const [images, setImages] = useContext(ImageContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await axios.post("/images", formData, {
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: (e) => {
                    setPercent(Math.round((100 * e.loaded) / e.total));
                },
            });
            setImages([...images, res.data]);
            toast.success("이미지 업로드 성공!");
        // 생략
        }
    };
```

- 이미지를 업로드하면 ```setImages([...images, res.data])``` 기존에 저장된 이미지에 새로운 이미지를 추가
<br>

```js
const ImageList = () => {
    const [images] = useContext(ImageContext);
    const imgList = images.map((image) => (
        <img 
            key={image.key} 
            style={{width:"33%"}} 
            src={`http://localhost:5050/uploads/${image.key}`} />
    ));
    return (
        <div>
            <h4>Image List</h4>
            {imgList}
        </div>
    );
};
```

- image를 배열로 가져와 출력

<br>

## 이미지 공개/비공개 설정

> Set photo access authority commit: https://github.com/evelyn82ny/Image-Management/commit/6a1d6c23ffff2c18144257fa8b83aa29fa02128a

```js
const ImageSchema = new mongoose.Schema({
    user:{
        _id: {type: mongoose.Types.ObjectId, required: true, index: true},
        name: { type: String, required: true},
        username: {type: String, required: true}
    },
    public: { type: Boolean, required: true, default: false },
    key: { type: String, required: true },
    originalFileName: { type: String, required: true}
},
{timestamps: true}
);

module.exports = mongoose.model("image", ImageSchema);
```

- ```user```: Image의 소유자 정보를 추가
- ```public```: Boolean 타입으로 true(모든 사용자가 볼 수 있음) / false(소유자만 볼 수 있음)

<br>

```js
imageRouter.get("/", async (req, res) => {
    const images = await Image.find({ public: true });
    res.json(images);
});
```
- 모든 사용자의 이미지를 보고 싶어 ```http://localhost:5050/images``` GET 요청하면 권한이 public 인 것만 접근 가능

<br>

```js
userRouter.get("/me/images", async(req, res) => {
    try{
        if(!req.user)
            throw new Error("접근권한이 없습니다.");
            const images = await Image.find({ "user._id": req.user.id });
            res.json(images);
    } catch(err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});
```
- 자신의 이미지를 요청할 경우 권한에 상관없이 모두 가져옴

<br>

## Like and Unlike

> Like and Unlike commit: https://github.com/evelyn82ny/Image-Management/commit/bf930e553c0de7a94787ba90d568de09c4f45c77

```js
const ImageSchema = new mongoose.Schema({
    user:{
        _id: {type: mongoose.Types.ObjectId, required: true, index: true},
        name: { type: String, required: true},
        username: {type: String, required: true}
    },
    public: { type: Boolean, required: true, default: false },
    likes: [{ type: mongoose.Types.ObjectId }],
    key: { type: String, required: true },
    originalFileName: { type: String, required: true}
},
{timestamps: true}
);

module.exports = mongoose.model("image", ImageSchema);
```

- image를 좋아요한 userId를 배열로 설정

<br>

```js
imageRouter.patch("/:imageId/like", async (req, res) => {
    try{
        if(!req.user)
            throw new Error("권한이 없습니다.");
        if(!mongoose.isValidObjectId(req.params.imageId))
        throw new Error("올바르지 않는 imageId 입니다.");
        const image = await Image.findOneAndUpdate(
            {_id: req.params.imageId}, 
            {$addToSet: { likes: req.user.id }}, 
            {new: true}
        );
        res.json(image);
    } catch(err){
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});
```

- 이미지에 ```좋아요```를 반영하기 위해 ```http://localhost:5050/images/imageId/like``` PATCH 요청
- ```findOneAndUpdate``` 를 사용하며 Update 후 결과를 받기 위해 ```new: true```로 설정
    - ```new: false```가 default
- 한 이미지에 같은 아이디가 중복되는 것을 막기 위해 ```$addToSet``` 사용