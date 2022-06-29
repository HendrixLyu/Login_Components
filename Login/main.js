import "./style.css";
import { ToSomewhere } from "./src/servers/toSomewhereBtn";
import axios from "axios";
import { showWelcome } from "./src/components/inOutAnimation";
import { gsap } from "gsap"; //动效包
ToSomewhere.init();

const fetchMethod = {
  //定义两个方法名
  FETCH: "fetch",
  AXIOS: "axios",
};
const ACTIVE = "active";
const ERROR = "error"; //宏

const loginBtn = document.querySelector(".login-btn");
const registerBtn = document.querySelector(".register-btn"); //在DOM找到按钮

loginBtn.addEventListener("click", login);
registerBtn.addEventListener("click", register);
//↓↓三个输入框(三个DOM节点)↓↓
const new_username = document.querySelector("#new-username"); //也可以用getElementById(...)
const password_one = document.querySelector("#reg-password-one");
const password_two = document.querySelector("#reg-password-two");

function addClick(doms, type) {
  //只要点击，就执行removeErrorTag()
  doms.forEach(onedom => {
    onedom.addEventListener(type || "click", () => {
      removeErrorTag(onedom); //css效果:移除红框
    });
  });
}

function addErrorTag(dom) {
  //给传入的DOM节点增加css类
  dom.classList.remove(ERROR); //习惯,不管有没有都先移除一下
  dom.classList.add(ERROR); //给DOM节点添加ERROR的class //css效果:显示红框
}
function removeErrorTag(dom) {
  //给DOM节点删除css类
  dom.classList.remove(ERROR); //css效果:移除红框
}
//定义4种动画效果
function correctShow() {
  const tween = gsap.timeline();
  tween.to("body", { duration: 0, background: "fff" });
  tween.to("body", { duration: 1, ease: "power2", background: "#d3f261" });
  tween.to("body", { duration: 1, ease: "power2", background: "#fff" });
}
function userNameErrorShow() {
  const tween = gsap.timeline();
  tween.to("#new-username, #username", { duration: 0, background: "fff" });
  tween.to("#new-username, #username", {
    duration: 1,
    ease: "power2",
    background: "#ffec3d",
  });
  tween.to("#new-username, #username", {
    duration: 1,
    ease: "power2",
    background: "#fff",
  });
}
function PasswordErrorShow() {
  const tween = gsap.timeline();
  tween.to("#reg-password-one,  #password", {
    duration: 0,
    background: "fff",
  });
  tween.to("#reg-password-one, #reg-password-two, #password", {
    duration: 1,
    ease: "power2",
    background: "#ffec3d",
  });
  tween.to("#reg-password-one, #reg-password-two, #password", {
    duration: 1,
    ease: "power2",
    background: "#fff",
  });
}
function BtnErrorShow() {
  const tween = gsap.timeline();
  tween.to(".register-btn, .login-btn", { duration: 0, background: "fff" });
  tween.to(".register-btn, .login-btn", {
    duration: 1,
    ease: "power2",
    background: "#ff7875",
  });
  tween.to(".register-btn, .login-btn", {
    duration: 1,
    ease: "power2",
    background: "#fff",
  });
}

addClick([new_username, password_one, password_two]); //点击 移除css红框

async function register(event) {
  event.preventDefault();
  if (inputEmpty([new_username, password_one, password_two])) {
    // userNameErrorShow();
    BtnErrorShow();
    return;
  } //看这三个DOM节点是否为空, 有空值就return,不继续执行AXIOS
  if (password_one.value === password_two.value) {
    //密码输入符合条件
    //在前端直接比较<input>标签的value
    const address = "http://localhost:7890/api/register"; //后端的路由
    // const method = fetchMethod.FETCH //切换方法1.Fetch
    const method = fetchMethod.AXIOS; //切换方法2.AXIOS
    const response = await postPassword(
      //使用自定义的postPassword方法,并将这个方法的返回赋值给response
      method,
      address,
      new_username.value,
      password_one.value
    ); //postPassword函数(用什么方法，后端路由，两个input.value)
    console.log(response); //打印postPassword方法的返回值
    switch (
      Number(response.code) //切换后端返回的code代号(转换数据类型Number或者toString)
    ) {
      case 0: //成功
        correctShow();
        // showRegister();
        break;
      case 1: //错误1:用户名已存在
        userNameErrorShow();
        addErrorTag(new_username); //对new_username这个Dom节点执行addErrorTag()
        break;
      case 2: //错误2:密码为空
        PasswordErrorShow();
        addErrorTag(password_one); //在前端校验是否输入,为空就不往后端发送。后端只负责验证密码是否正确
        addErrorTag(password_two);
        break;

      default:
        BtnErrorShow();
        break;
    }
    //   } else {
    //     addErrorTag(password_one)
    //     addErrorTag(password_two)
  } else {
    //前端输入的两个password不一致(在前端判断)
    PasswordErrorShow();
    BtnErrorShow();
    return;
  }
}

async function postPassword(method, address, username, password) {
  switch (
    method //切换方法1&2
  ) {
    //方法1:
    case fetchMethod.FETCH:
      return await fetch("http://localhost:7890/api/register", {
        //后端路由
        method: "POST", //发数据
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //将json转为字符串
          username,
          password,
        }),
      }).then(res => res.json()); //等后端的回应并转化为json
    //方法2:
    case fetchMethod.AXIOS:
      return axios
        .post("http://localhost:7890/api/register", {
          //将数据发给后端路由
          username,
          password,
        })
        .then(res => res.data) //异步等来自后端的回应,然后return
        .catch(err => {
          console.error(err);
        });
    default:
      return null;
  }
}

function inputEmpty(doms) {
  //传入一个DOM节点的List
  let status = false;
  doms.forEach(dom => {
    if (dom.value === "") {
      //只要有空值，就执行addErrorTag()
      addErrorTag(dom);
      status = true;
    }
  });
  return status; //返回true，说明有空值
}

const username = document.querySelector("#username");
const password = document.querySelector("#password");

addClick([username, password]); //点击取消红框

async function login(e) {
  e.preventDefault();
  if (inputEmpty([username, password])) {
    //缺少输入
    BtnErrorShow();
    return;
  }
  const response = await axios
    .post("http://localhost:7890/api/user", {
      username: username.value,
      password: password.value, //将前端的<input>的value传给后端
    })
    .then(res => res.data) //异步等后端返回的res.data,再赋值给response
    .catch(err => console.errors(err));
  console.log(response);
  switch (
    Number(response.code) //切换后端返回的code码
  ) {
    case 0:
      correctShow();
      showWelcome(); //跳转welcome
      break;
    case 1: //无此用户
      userNameErrorShow();
      BtnErrorShow();
      addErrorTag(username);
      break;
    case 2: //密码错误
      BtnErrorShow();
      PasswordErrorShow();
      addErrorTag(password);
      break;

    default:
      BtnErrorShow();
      break;
  }
}
