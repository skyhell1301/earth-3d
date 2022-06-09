export default class TLE {

  /**
   * Two Line Element Set (TLE)
   * @constructor
   * @returns {TLE}
   */
  constructor() {

    // Line 0
    this.name = ''
    // Line 1
    this.number = 0
    this.class = 'U'
    this.id = '00 000 A'
    this.date = new Date()
    this.fdmm = 0.0
    this.sdmm = 0.0
    this.drag = 0.0
    this.ephemeris = 0
    this.esn = 0
    // Line 2
    this.inclination = 0.0
    this.ascension = 0.0
    this.eccentricity = 0
    this.perigee = 0.0
    this.anomaly = 0.0
    this.motion = 0.0
    this.revolution = 0

  }

  /**
   * Parse a TLE's string representation
   * @see TLE.parse()
   * @param {String} value
   * @returns {TLE}
   */
  static parse(value) {
    return new TLE().parse(value)
  }

  /**
   * Create a TLE instance from JSON data
   * @param {String|Object} value
   * @returns {TLE}
   */
  static fromJSON(value) {

    const tle = new TLE()
    const data = typeof value === 'string' ?
      JSON.parse(value) : value

    const keys = Object.keys(data)

    for (let i = 0; i < keys.length; i++) {
      if (tle.hasOwnProperty(keys[i])) {
        tle[keys[i]] = keys[i] === 'date' ?
          new Date(Date.parse(data[keys[i]])) :
          data[keys[i]]
      }
    }

    return tle
  }

  /**
   * Parse a floating point number from TLE format
   * @param {String} value
   * @returns {Number}
   */
  static parseFloat(value) {

    // eslint-disable-next-line
    const pattern = /([-])?([\.\d]+)([+-]\d+)?/
    let match = null

    // eslint-disable-next-line
    if (match = pattern.exec(value)) {
      const sign = match[1] === '-' ? -1 : 1
      const power = match[3] ? 'e' + match[3] : 'e0'
      const value = match[2]
      return sign * parseFloat(value + power)
    }

    return NaN

  }

  /**
   * Parse the floating point number for the radiation pressure drag coefficient
   * @param {String} value
   * @returns {Number}
   */
  static parseDrag(value) {

    // eslint-disable-next-line
    const pattern = /([-])?([\.\d]+)([+-]\d+)?/
    let match = null

    // eslint-disable-next-line
    if (match = pattern.exec(value)) {
      const sign = match[1] === '-' ? -1 : 1
      const power = match[3] ? 'e' + match[3] : 'e0'
      const value = match[2].indexOf('.') === -1 ?
        '0.' + match[2] : match[2]
      return sign * parseFloat(value + power)
    }

    return NaN
  }

  /**
   * Parse a date from TLE format
   * @param {String} value
   * @returns {Date} utc
   */
  static parseDate(value) {

    value = (value + '')
      .replace(/^\s+|\s+$/, '')

    const epoch = parseInt(value.substr(0, 2), 10)
    const days = parseFloat(value.substr(2))

    let year = new Date().getFullYear()
    const currentEpoch = year % 100
    const century = year - currentEpoch

    year = (epoch > currentEpoch + 1) ?
      century - 100 + epoch :
      century + epoch

    const day = Math.floor(days)
    const hours = 24 * (days - day)
    const hour = Math.floor(hours)
    const minutes = 60 * (hours - hour)
    const minute = Math.floor(minutes)
    const seconds = 60 * (minutes - minute)
    const second = Math.floor(seconds)
    const millisecond = 1000 * (seconds - second)

    const utc = Date.UTC(
      year, 0, day,
      hour, minute, second,
      millisecond
    )

    return new Date(utc)

  }

  /**
   * Calculate the checksum of a TLE's line
   * @param {String} line
   * @returns {Number} checksum
   */
  static check(line) {

    let sum = 0

    line.substring(0, 68).replace(/[\d-]/g, function (digit) {
      sum += digit === '-' ? 1 : +digit
    })

    return sum % 10

  }

  /**
   * Trim excessive whitespace from beginning and end of a string
   * @param {String} str
   * @returns {String}
   */
  static trim(str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }

  /**
   * Parse a TLE's string representation
   * @param {String} value
   * @returns {TLE}
   */
  parse(value) {

    const lines = TLE.trim(value + '').split(/\r?\n/g)
    let line, checksum

    // Line 0
    if (lines.length === 3) {
      this.name = TLE.trim(lines.shift())
    }

    // Line 1
    line = lines.shift()
    checksum = TLE.check(line)

    // eslint-disable-next-line
    if (checksum != line.substring(68, 69)) {
      throw new Error(
        'Line 1 checksum mismatch: ' + checksum + ' != ' +
        line.substring(68, 69) + ': ' + line
      )
    }

    this.number = TLE.parseFloat(line.substring(2, 7))
    this.class = TLE.trim(line.substring(7, 9))
    this.id = TLE.trim(line.substring(9, 18))
    this.date = TLE.parseDate(line.substring(18, 33))
    this.fdmm = TLE.parseFloat(line.substring(33, 44))
    this.sdmm = TLE.parseFloat(line.substring(44, 53))
    this.drag = TLE.parseDrag(line.substring(53, 62))
    this.ephemeris = TLE.parseFloat(line.substring(62, 64))
    this.esn = TLE.parseFloat(line.substring(64, 68))

    // Line 2
    line = lines.shift()
    checksum = TLE.check(line)

    // eslint-disable-next-line
    if (checksum != line.substring(68, 69)) {
      throw new Error(
        'Line 2 checksum mismatch: ' + checksum + ' != ' +
        line.substring(68, 69) + ': ' + line
      )
    }

    this.inclination = TLE.parseFloat(line.substring(8, 17))
    this.ascension = TLE.parseFloat(line.substring(17, 26))
    this.eccentricity = TLE.parseFloat('0.' + line.substring(26, 34))
    this.perigee = TLE.parseFloat(line.substring(34, 43))
    this.anomaly = TLE.parseFloat(line.substring(43, 52))
    this.motion = TLE.parseFloat(line.substring(52, 63))
    this.revolution = TLE.parseFloat(line.substring(63, 68))

    return this

  }

}

