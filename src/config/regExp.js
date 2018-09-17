const setBankRegExp = (val) => {
  let _valArr = val.split('')
  let _sum = 0
  if (_valArr.length === 19 || _valArr.length === 16) {
    for (let k in _valArr) {
      let _k = _valArr.length - 1 - k
      let _i = _valArr[k] - 0
      if (_k !== 0) {
        if (_k % 2 === 1) {
          if (_i * 2 > 9) {
            _sum += _i * 2 - 9
          } else {
            _sum += _i * 2
          }
        } else {
          _sum += _i
        }
      } else {
        _sum += _i
        if (_sum % 10 === 0) {
          return true
        } else {
          return false
        }
      }
    }
  } else {
    return false
  }
}

const setSFZRegExp = (val) => {
  let _valArr = val.split('')
  let _multipliedArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  let _test = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2]
  let _sum = 0
  if (_valArr.length === 18) {
    for (let k in _valArr) {
      if (k !== '17') {
        _valArr[k] = _valArr[k] - 0
        _sum += _valArr[k] * _multipliedArr[k]
      }
    }
    if (_valArr[17] === 'X') {
      _valArr[17] = _valArr[17].toLowerCase()
    }
    if (_valArr[17] === _test[_sum % 11] + '') {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export default function (val, type) {
  if (type === 'phone') {
    let reg = new RegExp('^(13|14|15|17|18)[0-9]{9}$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  } else if (type === 'regCode') {
    let reg = new RegExp('^[0-9]{6}$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  } else if (type === 'password') {
    let reg = new RegExp('^[a-zA-Z_0-9]{6,20}$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  } else if (type === 'email') {
    let reg = new RegExp('^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*((\\.[A-Za-z]{2,}){1}$)')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  } else if (type === 'backCard') {
    let reg = new RegExp('^[0-9]{16}$|^[0-9]{19}$')
    if (reg.test(val)) {
      return setBankRegExp(val)
    } else {
      return false
    }
  } else if (type === 'idcard') {
    // 身份证 户口簿
    let reg = new RegExp('^[1-9]{1}[0-9]{16}[0-9xX]$|^[1-9]{1}[0-9]{14}$')
    if (reg.test(val)) {
      return setSFZRegExp(val)
    } else {
      return false
    }
  } else if (type === 'idcard4xx') {
    // 4律师执业证 废弃
    let reg = new RegExp('^[0-9]{17}$|^[0-9]{12}$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  } else if (type === 'idcard5xx') {
    // 5护照 废弃
    let reg = new RegExp('^[A-Z]{1}[0-9]{8,9}$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  } else if (type === 'entityNo1') {
    // 营业执照
    let reg = new RegExp('^[0-9A-Z]{15}$|^[0-9A-Z]{18}$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  } else if (type === 'name') {
    let reg = new RegExp('^[\u4e00-\u9fa5]{1,10}[∙•・●]{0,1}[\u4e00-\u9fa5]{1,10}$')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  } else if (type === 'address') {
    let reg = new RegExp('^[\u4e00-\u9fa5]{2,7}')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  } else if (type === 'company') {
    let reg = new RegExp('[\u4e00-\u9fa5]{2,7}')
    if (reg.test(val)) {
      return true
    } else {
      return false
    }
  }
}
