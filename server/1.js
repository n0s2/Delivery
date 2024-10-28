var b = new Buffer.from('SmF2YVNjcmlwdA==', 'base64')
var s = b.toString();
console.log(s)
// JavaScript

    var _str2 = "UxY=ThsD3tCqiuo5ne2pRyOMbf1F8NASK0PJGzdm7E6rL9HQkvXlaVwcIZgj4BW"
    var _str1 = "dfz12Ln657UOW3=AtpuS9FMZvqm4jkBQyioXRD0HYlKJcxPhV8gGbTeEwasNICr"
function ezdecrypt(input) {
    let _nstr=''
        for (let i = 0; i < input.length; i++) {
            _nstr += _str2[_str1.indexOf(input[i])]
        }
    console.log(_nstr)
        return atob(_nstr);
    }