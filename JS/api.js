let API = (() => {
    const BASE_URL = 'https://study.duyiedu.com'
    const TOKEN_KEY = 'token'

    function get(path) {
        const headers = {}
        const token = localStorage.getItem(TOKEN_KEY)//拿到token的信息
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, {
            // 判断localStorage有没有token，有就在headers 加authorization
            headers
        })
    }

    function post(path, bodyObj) {
        const headers = {
            'Content-Type': 'application/json'
        }
        const token = localStorage.getItem(TOKEN_KEY)//拿到token的信息
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, {
            // 判断localStorage有没有token，有就在headers 加authorization
            headers,
            method: 'POST',
            body: JSON.stringify(bodyObj)
        })
    }

    // 注册
    async function reg(userInfo) {
        const resp = await post('/api/user/reg', userInfo)
        return await resp.json()
    }

    // 登录
    async function logIn(loginInfo) {
        const resp = await post('/api/user/login', loginInfo)
        const result = await resp.json()
        // 将拿到的响应头token信息保存起来，放到本地存储桶
        // console.log(resp, '000000000000');
        // console.log(result, '11111111');
        if (result.code === 0) {//登录成功
            // Authorization:token
            const token = resp.headers.get('authorization')
            localStorage.setItem(TOKEN_KEY, token)
            // console.log(token, '<--【唯一】');  
        }
        // 登录失败就直接返回
        return result
    }

    // 验证账号
    async function verify(verify) {
        const resp = await get('/api/user/exists?loginId=' + verify)
        return await resp.json()
    }

    // 当前用户信息
    async function curUserInfo() {
        const resp = await get('/api/user/profile')
        return resp.json()
    }

    // 发送聊天消息
    async function sendMessage(content) {
        const resp = await post('/api/chat', {
            content
        })
        return await resp.json()
    }

    // 获取聊天消息
    async function getInfo() {
        const resp = await get('/api/chat/history')
        return await resp.json()
    }

    // 退出登录
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY)
    }

    return {
        reg,// 注册
        logIn,// 登录
        verify,// 验证账号
        curUserInfo,// 当前用户信息
        sendMessage,// 发送聊天消息
        getInfo,// 获取聊天消息
        loginOut,// 退出登录
    }
})()
// API.getInfo().then(resp => console.log(resp, '5555'))