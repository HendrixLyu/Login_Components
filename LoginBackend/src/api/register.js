import axios from 'axios';
import "dotenv/config"
import bcrypt from "bcrypt" //加密算法

async function register(req, res) {
    console.log(req.body); //打印接收到的前端post的数据
    // res.status(200).json({'myMsg':'Success!!!'}) //返回给前端的响应 
    const Users = await axios.get(process.env.JSON_SERVER_PATH + '/user') //去数据库拿取user存的数据
    .then(res => res.data) //将数据库user存的data返回给后端
    .catch(err => console.error(err))
    console.log(Users); //数据库的取到的数据,在后端打印
    if (Users && Users.length) { //如果有数据
        let status = false //开始找前,状态设为false
        Users.some(Users => {
            if (Users.name && Users.name === req.body.username){ //如果数据库存的username=前端传来的username
                res.status(200).send({'msg':'Already have the username', "code":"1", "Existing_username is:":req.body.username}) //返回给前端的状态码+信息(res)
                status = true //找到了，状态设为true
                return true
            } //some+true固定组合
        });
        if (status) { //状态为true
            return
        }
    }

    if(!req.body.password){ //if前端没传来密码
        res.status(200).send({ //返回给前端的信息
            "msg":"missing password ?????",
            "code":'2', //没输入密码
            "password":req.body.password,
        })
    } else { //数据没问题,处理后存入数据库
        const getBcrypt = await axios.get(process.env.JSON_SERVER_PATH + '/bcrypt/1') //去数据库取bcrypt
        const saltRound = getBcrypt.data.saltRounds //加几轮盐=数据库bcrypt的data的.saltRounds参数
        const Password = await bcrypt.hash(req.body.password, saltRound) //将前端发来的密码进行bcrypt.hash加盐(saltRound几轮)操作
        console.log(Password + ' | vs | ' + req.body.password); //后端打印加盐hash后的密码|vs|前端传来(用户输入)的密码
        await axios.post(process.env.JSON_SERVER_PATH + '/user',{ //将前端传入的username和加盐后的密码传入数据库(json-web_server)
            name:req.body.username,
            Password
        })
        res.status(200).json({
            "msg":"hello world, Operate Success 666!!!",
            "code": "0" //成功
        })
    }
    // res.status(200).send({'myMsg':'hi world,12345~!!!',"code":'0'}) //前面都没成功: 返回给前端的状态码+信息
}

export {register}