export default class Token {
  text: string
  type: symbol | null

  constructor(text = '', type = null as symbol | null) {
    this.text = text
    this.type = type
  }
}
