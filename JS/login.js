
// 账号
const respLoginId = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '账号不能为空'
    }
})
// 密码
const respLoginPwd = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '密码不能为空'
    }
})

const form = $('.user-form')
form.onsubmit = async (e) => {
    e.preventDefault()
    console.log('正在提交表单');
    const result = await FieldValidator.verifyAll(respLoginId, respLoginPwd)
    console.log(result);
    if (!result) return  //验证未通过

    const formData = new FormData(form) //传入表单dom，得到一个表单数据对象
    const obj = Object.fromEntries(formData.entries()) //得到一个对象{a:1,b:2}
    // API.reg({})
    // const obj = {
    //     loginId: respLoginId.input.value,
    //     loginPwd: respLoginPwd.input.value,
    //     nickname: respNickname.input.value
    // }
    console.log(obj);
    const resp = await API.logIn(obj)
    if (resp.code === 0) {
        // window.alert('登录成功，确定跳转首页')
        location.href = 'index.html'
    } else {
        respLoginId.p.innerText = '账号或密码错误'
        respLoginPwd.input.value = ''
    }
}