import { BtnResponse } from '../components/btnResponse'
import { showLogin, showRegister } from '../components/inOutAnimation'

class ToSomewhere {
  static toRegisterBtn = new BtnResponse('.to-register-btn')
  static toLoginBtn = new BtnResponse('.to-login-btn')

  static init() {
    ToSomewhere._addClick(ToSomewhere.toRegisterBtn, 'click', 0.5, 0.5, showRegister) //点击之后1s触发
    ToSomewhere._addClick(ToSomewhere.toLoginBtn, 'click', 0.5, 0.5, showLogin)
  }

  static _addClick(btnResponse, type, delay, afterDelay, callback) {
    btnResponse.button.addEventListener(type || 'click', () => {
      btnResponse.delay({ delay, afterDelay, callback })
    })
  }
}

export { ToSomewhere }