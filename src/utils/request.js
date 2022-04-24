import axios from 'axios'
import ElementUI from 'element-ui'

const request = axios.create({
    baseURL: 'http://localhost:9090',
    timeout: 5000
})

//拦截器
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null //获取浏览器DOM中user
    if (user) {
        config.headers['token'] = user.token;  // 在请求头中添加token
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        //token验证不通过时给提示
        if (res.code === '401') {
            ElementUI.Message({
                message:res.msg,
                type: 'error'
            });
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request

