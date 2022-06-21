## MongoDB 연동

> Create ImageSchema Commit: https://github.com/evelyn82ny/Image-Management/commit/711ec603ec313ddb7321fa20d8c22c9c3aa0edce

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

MongoDB에 정상적으로 저장되는 것을 확인할 수 있다.

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