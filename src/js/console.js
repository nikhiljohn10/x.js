/*!
 * Console.JS v0.0.1 (https://x.js.org/)
 * Author Nikhil John
 * Licensed under MIT (https://github.com/nikhiljohn10/x.js.org/blob/master/LICENSE)
 */

const input = document.querySelector('#input')
const output = document.querySelector('#output')
let consoleErrorLock = false

const print = (text) => {
  output.textContent = text + '\n'
}

const log = (text) => {
  if (!consoleErrorLock) output.textContent += text + '\n'
}

const clearAll = () => {
  consoleErrorLock = false
  output.textContent = ''
}

const addClass = (selector, classList) => {
  const element = document.querySelector(selector);
  const classes = classList.split(' ')
  classes.forEach((item, id) => {
    element.classList.add(item)
  })
}

const removeClass = (selector, classList) => {
  const element = document.querySelector(selector);
  const classes = classList.split(' ')
  classes.forEach((item, id) => {
    element.classList.remove(item)
  })
}

const needSaved = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.which == 83) return true
  event.preventDefault()
  return false
}

const percentageFormat = function(msg, args) {
  let message = msg
  const tokens = args
  for (let i = 0; i < tokens.length; i++) {
    let type, padding = 0
    if (typeof tokens[i] == "object") {
      message = message.replace(/%[oO]/, JSON.stringify(tokens[i]))
    } else if (typeof tokens[i] == "number") {
      let matchedFormat = message.match(/%\.([0-9]+)([dif])/)
      if (matchedFormat == null) {
        matchedFormat = message.match(/%([dif])/)
        type = matchedFormat[1]
      } else {
        padding = matchedFormat[1]
        type = matchedFormat[2]
      }
      if (type == 'f') {
        const [lhs, rhs] = String(tokens[i]).split('.')
        const number = lhs.concat('.', rhs.padEnd(padding, '0'))
        message = message.replace(/%(\.[0-9]+)?f/, number)
      } else {
        const number = String(Math.round(tokens[i])).padStart(padding, '0')
        message = message.replace(/%(\.[0-9]+)?[di]/, number)
      }
    } else {
      message = message.replace(/%[s]/, tokens[i])
    }
  }
  return message
}

const processArgs = (args, asserted) => {
  let list = []
  const genericFormat = /\%(\.[0-9]+)?[difs]/g
  for (let i = asserted ? 1 : 0; i < args.length; i++) list.push(args[i])
  if (typeof list[0] == 'string' && genericFormat.test(list[0])) {
    const message = list.shift()
    return percentageFormat(message, list)
  } else {
    list = list.map(item => {
      if (typeof item != 'string') {
        return JSON.stringify(item)
      } else {
        return item
      }
    })
    return list.join(' ')
  }
}

console.clear = () => {
  clearAll()
}

console.log = function() {
  const message = processArgs(arguments, false)
  log(message)
}

console.assert = function() {
  if (!arguments[0]) {
    addClass('#output', 'assert')
    const message = processArgs(arguments, true)
    log('Assertion failed: ' + message)
  }
}

console.test = function() {
  const name = arguments[0]
  if (typeof name != 'string') {
    console.error("Error: Invalid argument. Syntax => console.test(name, test_1 [, ... , test_n])")
    return false
  }
  for (let i = 1; i < arguments.length; i++) {
    if (!arguments[i]) {
      addClass('#output', 'assert')
      log('Test \''+ name +'\' failed at sub test: ' + i)
      return false
    }
  }
  log('Test \''+name+'\' is passed')
  return true
}

console.error = (error) => {
  addClass('#output', 'error')
  log(error)
  consoleErrorLock = true
}

window.onkeyup = (event) => {
  if (needSaved(event)) {
    alert("worked")
    const uriContent = "data:text/javascript," + encodeURIComponent(input.value)
    const newWindow = window.open(uriContent, 'script.js')
  }
}

window.onload = (event) => {
  input.focus()
}

(() => {
  const execute = () => {
    try {
      removeClass('#output', 'error')
      removeClass('#output', 'assert')
      console.clear()
      Function(input.value)()
    } catch (err) {
      const lineCorrectionExpr = /^missing [\)\]\}]|^expected expression, got \'[\)\]\}]\'/
      let errorStack = err.stack.trim()
      let lineNumber = (lineCorrectionExpr.test(err.message)) ? err.lineNumber - 3 : (err.lineNumber - 2)
      if (/^Error/.test(errorStack)) {
        errorStack = errorStack.replace(/^[Ee]rror/, '')
      } else {
        errorStack = '\tat ' + errorStack.replace(/\n/g, '\n\tat ')
      }
      console.error(err.name + ' at line ' + lineNumber + ' : ' + err.message + '\n' + errorStack)
    }
  }

  const debounce = (func, delay) => {
    let debounceTimer
    return function() {
      const context = this
      const args = arguments
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
  }

  input.onkeyup = debounce(execute, 500)
  console.log('/*\nWelcome to Execute JS\nYou can test your js script in the above text editor.\nThe code is executed live as it does in browser console.\nAll the console logs and errors are printed here.\n*/')
})()