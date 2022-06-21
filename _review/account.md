# Account

```js
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        username: { type: String, required: true, unique: true },
        hashedPassword: {type: String, required: true},
        sessions:[
            {
            createdAt: { type: Date, required: true}
            }
        ]
    },
    { timestamps: true }
);
module.exports = mongoose.model("user", UserSchema);
```

- ```name```: 이름
- ```username```: 활동명
- ```hashedPassword```: 회원 가입 시 입력한 Password에 암호화하여 저장
- ```sessions```: 로그인 상태를 유지하기 위한 세션으로 여러 기기에서 로그인할 수 있기 때문에 배열로 생성

<br>

## Signup

> Create a sign-up API commit: https://github.com/evelyn82ny/Image-Management/commit/05fe39145ca1362246dcc824fe05298f2ae56e6a

![png](/_img/signup.png)

- POST: ```http://localhost:5050/users/singup```
- JSON 형식으로 ```name```, ```username```, ```password``` 값을 채워 POST 요청
- 사용자가 입력한 ```password```를 hashed하여 데이터베이스에 저장
- 생성한 sessionid 값을 Response에 전달

<br>

### hashed password로 변경

> Hashed password commit: https://github.com/evelyn82ny/Image-Management/commit/8d3912dbae530a2bb1ad215ef479a5e9940d7c64

```js
userRouter.post("/signup", async(req, res) => {
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
- ```hash(field, salt)``` : salt 값이 클수록 더 복잡한 값이 생성되지만 많은 시간이 소요됨

<br>

### Session 적용

> Apply session commit: https://github.com/evelyn82ny/Image-Management/commit/b1e9a53be4e99149a6950a146662b9139874ccbb

<img src="https://user-images.githubusercontent.com/54436228/171525657-43b4395b-1879-4d77-962c-de72129bd9f3.gif">

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

- 위 GIF 파일을 보면 회원 가입 후 서버에서 **sessionid**를 생성해 client에게 전달
- 로그인 상태를 유지하기 위해 Session 적용
- 같은 계정을 여러 기기에서 접속하는 경우를 생각해 사용자는 여러 **Sessionid**를 가질 수 있고 여러 sessionid를 sessions에 추가
- 회원가입 후 만들어지는 session은 첫번째 session이므로 ```user.sessions[0]``` 에 접근

<br>

## Login

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
- 로그인 시 sessionid만 추가하기 때문에 ```POST``` 에서 ```PATCH``` 로 변경
- JSON 형식으로 ```username```과 ```password``` 를 작성해 PATCH 요청
<br>

- password는 ```bcryptjs``` 모듈의 ```hash()``` 사용해 Hashed 함
- 그렇기 때문에 ```bcryptjs``` 모듈의 ```compare()``` 로 사용자가 입력한 ```password```와 DB에서 관리되는 ```hashedPassword```를 비교

<br>

### Session 적용

<img src="https://user-images.githubusercontent.com/54436228/171525748-6cde61f1-8abd-4083-a7d4-a631047ccaf8.gif">

- 로그인 후 생성된 **sessionid**가 **LocalStorage**에 저장
- LocalStorage에서 sessionid가 계속 유지되기 때문에 로그인 후 새로고침 버튼을 눌러도 로그인 상태 유지

<br>

## Log out

> Create a logout API commit: https://github.com/evelyn82ny/Image-Management/commit/ff20682fe8ef27b2e6df1f17700a09731c708a1b

<img src="https://user-images.githubusercontent.com/54436228/171525836-c18727eb-45da-4de6-b41d-90f5d6081bed.gif">

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
- 한 사용자의 여러 sessonid 중 해당되는 **sessionid**를 삭제하므로 PATCH
- request header로 sessionid를 넘겨줌
- ```updateOne()```으로 해당되는 sessionid 를 삭제하는데 ```$pull``` 사용해 수정

<br>

## Session 유지

> Keep the session commit: https://github.com/evelyn82ny/Image-Management/commit/61d4bbccea52b6c4e89313d5bed0e845fdba5f7e#diff-6b57789b3d5e5b5d6417920ab9dbe3b43581c6ae9f77192e51de85d16fb791db

- 로그인 상태에서 새로고침을 눌러도 로그인 상태를 유지
- Local Storage에 회원가입 또는 로그인 시 생성되는 SessionId를 저장

```js
useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if(me) {
        axios.defaults.headers.common.sessionid = me.sessionId; 
        localStorage.setItem("sessionId", me.sessionId);
    } else if(sessionId) {
        axios
            .get("/users/me", { headers: { sessionid: sessionId } })
            .then((result) => 
                setMe({
                    name: result.data.name,
                    userId: result.data.userId,
                    sessionId: result.data.sessionId
                })
            )
            .catch((err) => {
                console.error(err);
                localStorage.removeItem("sessionId");
                delete axios.defaults.headers.common.sessionid;
            });
    } else delete axios.defaults.headers.common.sessionid;
}, [me]);
```
- me가 존재하는 경우(회원가입 또는 로그인 즉시) **LocalStorage**에 **sessionid** 저장
- me는 존재하지 않고 sessionid만 가지고 있는 경우 (새로고침 눌렸을때) **sessionid를 기반으로 user를 찾아와 상태 유지**
- me도 없고 존재하는 sessioId도 일치하지 않을 경우 잘못된 sessionId이므로 삭제

<br>