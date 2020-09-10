/*!
 * Console.JS v0.0.1 (https://x.js.org/)
 * Author Nikhil John
 * Licensed under MIT (https://github.com/nikhiljohn10/x.js.org/blob/master/LICENSE)
 */

const input = document.querySelector('#input')
const output = document.querySelector('#output')

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
  output.textContent = ""
}

console.log = function() {
  const message = processArgs(arguments, false)
  output.textContent += message + '\n'
}

console.assert = function() {
  if (!arguments[0]) {
    addClass('#output', 'assert')
    const message = processArgs(arguments, true)
    output.textContent += 'Assertion failed: ' + message + '\n'
  }
}

console.test = function(fn) {
  let e
  try {
    fn()
  } catch (x) {
    e = x
  } finally {
    console.error('Error inside function: ' + fn.toString())
  }
}

console.error = (error) => {
  console.clear()
  output.textContent +=  error + '\n'
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
      eval(input.value)
    } catch (err) {
      addClass('#output', 'error')
      console.error('Error on line ' + err.lineNumber + ': ' + err.message)
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