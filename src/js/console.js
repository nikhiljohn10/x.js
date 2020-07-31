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

console.clear = () => {
  output.textContent = ""
}

console.log = (message) => {
  output.textContent += message + '\n'
}

console.error = (error) => {
  console.clear()
  output.textContent += error + '\n'
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
      console.clear()
      eval(input.value)
    } catch (err) {
      addClass('#output', 'error')
      console.error(err.message)
    }
  }

  input.onkeyup = execute
  console.log('/*\nWelcome to Execute JS\nYou can test your js script in the above text editor.\nThe code is executed live as it does in browser console.\nAll the console logs and errors are printed here.\n*/')
})()