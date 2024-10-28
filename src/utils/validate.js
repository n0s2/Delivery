/**
* Created by jiachenpan on 16/11/18.
**/
 
 
 
export function isvalidUsername (str) {
  const valid_map = ['admin', 'editor']
 return valid_map.indexOf(str.trim()) >= 0
 
}
 
// �Ǹ���
export function noFuNumber (str) {
  const reg = /^d+(.{0,1}d+){0,0}$/ 
 return reg.test(str)
 
}
 
// �ֻ���
export function isvalidMobile (str) { 
  const reg = /^1(3|4|5|7|8)d{9}$/ 
 return reg.test(str)
 
}
 
// ���ġ�Ӣ�ġ����� 
export function regexn (str) {
  const reg = /^[u4e00-u9fa5_a-zA-Z0-9]+$/ 
 return reg.test(str)
 
}
 
/* �Ϸ�url */ 
export function validateURL (textval) { 
    const urlregex = /^(https?|ftp)://([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+.)*[a-zA-Z0-9-]+.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(/($|[a-zA-Z0-9.,?'\+&%$#=~_-]+))*$/ 
  return urlregex.test(textval)
}
  
 
/* Сд��ĸ */ 
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
 return reg.test(str)
 
}
 
  
/* ��д��ĸ */ 
export function validateUpperCase (str) { 
   const reg = /^[A-Z]+$/ 
 return reg.test(str)
 
}
 
 
/* ��Сд��ĸ */ 
export function validateAlphabets (str) {
  const reg = /^[A-Za-z]+$/
 return reg.test(str)
 
}
 
 
/**
* validate email
* @param email
* @returns {boolean}
*/