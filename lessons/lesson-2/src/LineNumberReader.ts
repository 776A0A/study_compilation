export default class LineNumberReader {
  private line = 0
  codesQueue: string[]

  constructor(codes: string) {
    this.codesQueue = codes.split('\n')
  }

  readLine() {
    return this.codesQueue[this.line++] ?? null
  }

  getLineNumber() {
    return Math.max(1, this.line - 1)
  }
}
