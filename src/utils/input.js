
export function trimInputValue (event) {
  if (event.keyCode === 32) {
    event.returnValue = false
    event.preventDefault()
  }
}
