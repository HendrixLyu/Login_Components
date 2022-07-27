import axios from "axios";
import "dotenv/config";
import bcrypt from "bcrypt";

async function user(req, res) {
  const username = req.body.username;
  const password = req.body.password; //前端发来的数据

  const Users = await axios
    .get(process.env.JSON_SERVER_PATH + "/user")
    .then(res => res.data)
    .catch(err => console.error(err)); //去数据库拿取所有/user存的数据, 赋值给变量Users
  if (Users && Users.length) {
    //如果在数据库取到值
    let getUserName, getPassword;
    Users.some(DB_User => {
      //遍历Users, 用some+true组合
      if (DB_User.name === username) {
        //遍历到数据库的某一条DB_User.name=前端传来的username
        getUserName = DB_User.name;
        getPassword = DB_User.Password; //数据库存的Password(加盐后的)
        return true; //跳出循环
      }
    });
    console.log(getUserName, "cannot show password!");

    if (!getUserName) {
      //遍历Users结束,如果没找到这个用户
      res.status(200).send({ info: "cannot find user", code: "1" }); //返回给前端的状态码+信息
    } else if (getPassword) {
      //拿着数据库存这条username的密码
      const match = await bcrypt.compare(password, getPassword); //拿着前端传入的password加盐，与数据库存的Password比较，只返回T/F
      if (match) {
        //返回True
        res
          .status(200)
          .send({ info: " user and password match successful", code: "0" });
      } else {
        //返回false
        res.status(200).send({ info: " wrong password !!!", code: "2" });
      }
    }
  }
}

export { user };
