import Cookies from 'js-cookie'

const LoginKey1 = 'C11Y__LGTkn1'// logintoken
const LoginKey2 = 'C11Y__LGTkn2'// ˫token���ƣ�ȷ���û���¼��ʱЧ�ԡ�

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