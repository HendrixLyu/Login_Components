import './style.css'
import { ToSomewhere } from './src/servers/toSomewhereBtn'
import axios from 'axios'
import { showWelcome } from './src/components/inOutAnimation'
import { gsap } from 'gsap' //动效包
ToSomewhere.init()

const fetchMethod = { //定义两个方法名
  "FETCH": 'fetch',
  "AXIOS": "axios",
}
const ACTIVE = 'active'
const ERROR = 'error' //宏 

const loginBtn = document.querySelector('.login-btn')
const registerBtn = document.querySelector('.register-btn') //按钮

// loginBtn.addEventListener('click', login)
registerBtn.addEventListener('click', register)
//↓↓三个输入框(三个DOM节点)↓↓
const new_username = document.querySelector('#new-username') //也可以用getElementById(...)
const password_one = document.querySelector('#reg-password-one')
const password_two = document.querySelector('#reg-password-two')

function addClick(doms, type) { //只要点击，就执行removeErrorTag()
  doms.forEach(dom => {
    dom.addEventListener((type || 'click'), () => {
      removeErrorTag(dom) //css效果:移除红框
    })
  })
}

function addErrorTag(dom) { //给传入的DOM节点增加css类
  dom.classList.remove(ERROR) //习惯，不管有没有都先移除一下
  dom.classList.add(ERROR) //给节点添加ERROR的class//css效果:显示红框
}
function removeErrorTag(dom) { //给DOM节点删除css类
  dom.classList.remove(ERROR) //css效果:移除红框
}

function correctShow(){
  const tween = gsap.timeline()
  tween.to('body', { duration: 0, background:'fff'})
  tween.to('body', { duration: 1, ease:'power2', background:'#d3f261'})
  tween.to('body', { duration: 1, ease:'power2', background:'#fff'})
}
function errorShow(){
  const tween = gsap.timeline()
  tween.to('.register-btn', { duration: 0, background:'fff'})
  tween.to('.register-btn', { duration: 1, ease:'power2', background:'#ff7875'})
  tween.to('.register-btn', { duration: 1, ease:'power2', background:'#fff'})
}
function unknownShow(){
  const tween = gsap.timeline()
  tween.to('#reg-password-one', { duration: 0, background:'fff'})
  tween.to('#reg-password-one, #reg-password-two', { duration: 1, ease:'power2', background:'#ffec3d'})
  tween.to('#reg-password-one, #reg-password-two', { duration: 1, ease:'power2', background:'#fff'})
}
addClick([new_username, password_one, password_two]) 

async function register(event) {
  event.preventDefault()
  if (inputEmpty([new_username])) {
    errorShow()
    return }//看这三个DOM节点是否为空, 有空值就return,不继续执行AXIOS
  if (password_one.value === password_two.value) { //拿<input>标签的value
    const address = "http://localhost:7890/api/register" //去找后端的路由
    // const method = fetchMethod.FETCH //切换方法1.Fetch
    const method = fetchMethod.AXIOS //切换方法2.AXIOS
    const response = await postPassword(method, address, new_username.value, password_one.value) //函数(用什么方法，后端路由，两个input.value)
    console.log(response)//打印后端返回的的响应->res
    switch (Number(response.code)) { //切换后端res返回的code代号(转换数据类型Number或者toString)
      case 0: //成功
        correctShow()
        break;
      case 1: //错误1:存在用户名
        errorShow()
        addErrorTag(new_username) //对new_username这个Dom节点执行addErrorTag()
        break;
      case 2: //错误2:密码为空
        errorShow()
        unknownShow()
        addErrorTag(password_one) //在前端校验是否输入,为空就不往后端发送。后端只负责验证密码是否正确
        addErrorTag(password_two)
        break;

      default:
        unknownShow()
        break;
    }
//   } else {
//     addErrorTag(password_one)
//     addErrorTag(password_two)
  }else{
    unknownShow()
    return
  }
}

async function postPassword(method, address, username, password) {
  switch (method) { //切换方法
//方法1:
    case fetchMethod.FETCH:  
      return await fetch('http://localhost:7890/api/register', { //后端路由
        method: 'POST', //发数据
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ //将json转为字符串
          username, password
        })
      }).then(res => res.json()) //等后端的回应并转化为json
//方法2:
    case fetchMethod.AXIOS:
      return axios.post('http://localhost:7890/api/register', {
        username, password
      }).then(res => res.data) //异步等来自后端的回应
        .catch(err => {
          console.error(err);
        })
    default:
      return null
  }
}

function inputEmpty(doms) { //传入一个DOM节点的List
  let status = false
  doms.forEach(dom => {
    if (dom.value === '') { //只要有空值，就执行addErrorTag()
      addErrorTag(dom)
      status = true
    }
  })
  return status //返回true，说明有空值
}

// const username = document.querySelector('#username')
// const password = document.querySelector('#password')

// addClick([username, password])

// async function login(event) {
//   event.preventDefault()
//   // console.log("username.value:", username.value);
//   // console.log("password.value:", password.value);
//   if (inputEmpty([username, password])) return
//   const response = await axios.post('http://localhost:7890/api/user', {
//     username: username.value,
//     password: password.value
//   }).then(res => res.data).catch(err => console.errors(err))
//   switch (response.code) {
//     case 0:
//       showWelcome()
//       break;
//     case 1:
//       addErrorTag(username)
//       break; 
//     case 2:
//       addErrorTag(password)
//       break;

//     default:
//       break;
//   }

// }