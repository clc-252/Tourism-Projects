// 引入message提示
import { Message } from "element-ui"

// 一开始就会执行plugins文件夹中的文件，所以可以将拦截的方法加到这个文件夹中
export default (data)=>{
    // console.log(data);  //data是本来就有的
    // 拦截请求的错误
    data.$axios.onError(err=>{
        // console.log(err.response);  // 请求的error对象中均有response
        // 将response中我们所需的数据结构出来
        const {statusCode,message}=err.response.data;
        // 判断如果状态码为400，就进行错误提示
        if(statusCode===400){
            // 使用element-ui中的提示信息组件（message）
            Message.error(message)
        }
    })
}