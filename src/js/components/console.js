'use strict'

export default class Console {
  constructor(log) {
    this.log = log
    this.bind()
  }
  bind() {
    console.log(this.log)
  }
}
