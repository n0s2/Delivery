import Cookies from 'js-cookie'

const LoginKey1 = 'C11Y__LGTkn1'// logintoken
const LoginKey2 = 'C11Y__LGTkn2'// 双token机制，确保用户登录的时效性。

export function getToken() {
  return Cookies.get(LoginKey1)
}

export function setToken1(param1) {
    return Cookies.set(LoginKey1, param1)
}

export function setToken2(param1) {
    return Cookies.set(LoginKey2, param1)
}

export function removeToken () {
    return Cookies.remove(LoginKey1)
    return Cookies.remove(LoginKey2)
}