// 用户登录和注册的表单项验证的通用代码
class FieldValidator {
    /**
     * 构造器
     * @param {string} textID 文本框id[找到文本框=找到err]
     * @param {function} validatorFunc 验证规则，当需要文本框验证时会调用该函数；函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
     */
    constructor(textID, validatorFunc) {
        this.input = $('#' + textID)
        this.validatorFunc = validatorFunc
        this.p = this.input.nextElementSibling
        // console.log(this.input, this.p);
        // 失去焦点
        this.input.onblur = () => {
            this.validateYanZ() //validateYanZ 核实，因为箭头函数没有this，所以这个this指向 constructor
        }
    }
    // 写一个方法去判断input
    /**
     * 验证，成功返回true，失败返回false
     */
    async validateYanZ() {
        // 调用验证规则函数
        const err = await this.validatorFunc(this.input.value)
        if (err) {
            this.p.innerText = err
            return false
        } else {
            this.p.innerText = ''
            return true
        }
    }

    // 验证方法，所有成功则成功，一个失败则失败;返回布尔值 【static：静态方法】
    static async verifyAll(...allVerify) {
        const proms = allVerify.map(resp => resp.validateYanZ())
        const result = await Promise.all(proms)
        // console.log(result);
        return result.every(item => item)
    }
}

// 验证方法，所有成功则成功，一个失败则失败
function isFin() {
    FieldValidator.verifyAll(respLoginId, Nickname).then(resp => {
        console.log(resp);
    })
}