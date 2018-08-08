export const format = time => {
  return time ? new Date(time.replace(/\-/g, '/')).getTime() : new Date().getTime()
}