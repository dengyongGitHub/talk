
// 账号
const respLoginId = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '账号不能为空'
    }
    const resp = await API.verify(val)
    if (resp.data) {
        return '该账号已被注册，重新填写新账号'
    }
})
// 昵称
const respNickname = new FieldValidator('txtNickname', async function (val) {
    if (!val) {
        return '昵称不能为空'
    }
})
// 密码
const respLoginPwd = new FieldValidator('txtLoginPwd', async function (val) {
    if (!val) {
        return '密码不能为空'
    }
})
// 二次密码
const respIfFinLoginPwd = new FieldValidator('txtLoginPwdConfirm', async function (val) {
    if (!val) {
        return '再次确认密码'
    }
    // 判断二次密码
    if (val !== respLoginPwd.input.value) {
        return '俩次密码不一致'
    }
})

const form = $('.user-form')
form.onsubmit = async (e) => {
    e.preventDefault()
    console.log('正在提交表单');
    const result = await FieldValidator.verifyAll(respLoginId, respNickname, respLoginPwd, respIfFinLoginPwd)
    console.log(result);
    if (!result) return //验证未通过

    const formData = new FormData(form) //传入表单dom，得到一个表单数据对象
    // window.formData = formData;
    // console.log(formData, '11111111111111111111');
    const obj = Object.fromEntries(formData.entries()) //得到一个对象{a:1,b:2}
    // API.reg({})
    // const obj = {
    //     loginId: respLoginId.input.value,
    //     loginPwd: respLoginPwd.input.value,
    //     nickname: respNickname.input.value
    // }
    console.log(obj);
    const resp = await API.reg(obj)
    if (resp.code === 0) {
        // window.alert('注册成功，确定跳转登录页面')
        location.href = 'login.html'
    }
}