export function error(...err: any[]) {
  console.error(...err)
}

export function log(...str: any[]) {
  for (let i = 0; i < str.length; i++) {
    console.log(str[i])
    console.log()
  }
}

export function symbolify<T extends string[]>(...array: Readonly<T>) {
  return array.reduce((obj, item) => {
    obj[item as T[number]] = symbol(item)
    return obj
  }, {} as Record<T[number], symbol>)
}

export function symbol(des: any) {
  return Symbol(des)
}

export function stringify(obj: any) {
  return JSON.stringify(
    obj,
    (k, v) => (typeof v === 'symbol' ? `Symbol(${k})` : v),
    2,
  )
}

export function renderText(text: any) {
  document.body.innerHTML = `
    <pre>
    ${text}
    </pre>
  `
}
