export const isAtElementBottom = (el: HTMLElement) => {
  return el.scrollHeight - el.scrollTop - el.clientHeight < 50
}