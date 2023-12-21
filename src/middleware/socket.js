import io from 'socket.io-client'
let socket
export default (url)=>{
    if (!socket)
        socket = io(url)
    return socket
}