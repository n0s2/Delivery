export function randomBytes(size) {
    const _str = '0123456789abcdef'
    let fstr = ''
    for (let i = 0; i < size; i++) {
        fstr += _str[Math.floor((Math.random() * 16))]
    }
    return fstr;
}

var _str1 = "dfz12Ln657UOW3=AtpuS9FMZvqm4jkBQyioXRD0HYlKJcxPhV8gGbTeEwasNICr"
var _str2 = "UxY=ThsD3tCqiuo5ne2pRyOMbf1F8NASK0PJGzdm7E6rL9HQkvXlaVwcIZgj4BW"

function e_bb(input) {
    var V = new Array("a", "e", "i", "o", "u", "y")
    var C = new Array("b", "c", "d", "f", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "z", "x")

    let out = 'x'
    let c = 1

    for (var i = 0; i < input.length + 1; i += 2) {

        if (i >= input.length) {
            out += V[c % 6] + C[16] + V[C / 6]
            break
        }

        let byte1 = input.charCodeAt(i)
        out += V[(((byte1 >> 6) & 3) + c) % 6]
        out += C[(byte1 >> 2) & 15]
        out += V[Math.floor(((byte1 & 3) + (c / 6)) % 6)]

        if ((i + 1) >= input.length) {
            break
        }

        let byte2 = input.charCodeAt(i + 1)
        out += C[(byte2 >> 4) & 15]
        out += "-"
        out += C[byte2 & 15]

        c = (c * 5 + byte1 * 7 + byte2) % 36

    }

    out += 'x'

    return out
}
export function c1yd(input) {
    input = btoa(input) % 2 ? btoa(input) : btoa(input) + ' '
    let _nstr = ''
    for (let i = 0; i < input.length; i++) {
        _nstr += _str2[_str1.indexOf(input[i])]
    }
    return e_bb(_nstr)
}