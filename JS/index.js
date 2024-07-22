
(async function () {
    // 验证是否登录，如果没有登录，跳转到登录页面，如果有登录，获取用户信息
    const resp = await API.curUserInfo()
    console.log(resp.data);
    const user = resp.data
    console.log(user, 'useruseruser');

    if (!user) {
        alert('登录过期')
        location.href = 'login.html'
        // 那么就结束这个函数 return
        return
    }

    const doms = {
        rightInfo: {
            thisName: $('#nickname'),
            thisID: $('#loginId'),
        },
        close: $('.close'),
        chatContent: $('.chat-container'),
        msgContainer: $('.msg-container'),//表单
        txtMsg: $('#txtMsg')
    }

    // 下面代码就是登录状态执行
    setUserInfo()    // 设置用户信息
    onX()   // 退出到登录页面
    setInfo()   // 拿到历史记录

    // 加载历史记录
    async function setInfo() {
        const result = await API.getInfo()
        console.log(result, '333333333')
        for (const item of result.data) {
            // console.log(item, 'item');
            addChatInfo(item)
        }
        scrollBottom()
    }

    // 发送消息事件
    doms.msgContainer.onsubmit = (e) => {
        e.preventDefault()
        sendChat()//调用发送消息函数
    }

    // 设置用户信息
    function setUserInfo() {
        doms.rightInfo.thisName.innerText += user.nickname
        doms.rightInfo.thisID.innerText += user.loginId
    }

    // 注销
    function onX() {
        const close = doms.close
        close.onclick = () => {
            API.loginOut()
            location.href = 'login.html'
        }
    }

    // 添加信息
    function addChatInfo(infoObj) {//传入一个对象信息
        // content: "123",
        // createdAt: 1720792611421,
        // from: "yong",
        // to: null

        const div = $$$('chat-item')
        div.classList.add('chat-item')
        if (infoObj.from) {
            div.classList.add('me')
        }
        const img = $$$('img')
        img.className = 'chat-avatar'
        img.src = infoObj.from ? '/asset/tx.png' : '/asset/cxk1.jpg'

        const chatContent = $$$('div')
        chatContent.className = 'chat-content'
        chatContent.innerText = infoObj.content

        const chatDate = $$$('div')
        chatDate.className = 'chat-date'
        chatDate.innerText = getLocalTime(infoObj.createdAt)

        div.appendChild(img)
        div.appendChild(chatContent)
        div.appendChild(chatDate)

        doms.chatContent.appendChild(div)
    }

    // 转换时间
    // 时间戳：1637244864707
    /* 时间戳转换为时间 */
    function getLocalTime(timestamp) {
        timestamp = timestamp ? timestamp : null;
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
    }

    const getTime = new Date().getTime()
    // console.log(getTime, '当前北京时间');

    // addChatInfo({
    //     content: "俄日u网友热议我iu有",
    //     createdAt: getTime,
    //     from: "yong",
    //     to: null
    // })

    // 自动滚动到最后一条信息
    function scrollBottom() {
        doms.chatContent.scrollTop = doms.chatContent.scrollHeight
        console.log(doms.chatContent.scrollHeight, '元素盒子总高度');
    }

    // 发送消息
    async function sendChat() {
        const context = doms.txtMsg.value.trim()
        console.log(context, '66666666666666');
        if (!context) return
        addChatInfo({
            content: context,
            createdAt: getTime,
            from: user.loginId,
            to: null
        })
        doms.txtMsg.value = ''
        scrollBottom()
        const resp = await API.sendMessage(context)
        addChatInfo({
            from: null,
            to: user.loginId,

            content: resp.data.content,
            createdAt: getTime,

            //或者---> ...resp.data
        })
        scrollBottom()
        console.log(resp, '发送消息后响应结果');
    }
    // window.sendChat = sendChat;
    // doms.btn.onclick = () => {
    //     sendChat()
    // }
})()