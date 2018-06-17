/*class Evidence{
  constructor(quantity,bookname,courses,covertype,condition,lowestprice,seller){
    this.quantity = quantity
    this.bookname = bookname
    this.courses = courses
    this.covertype = covertype
    this.condition = condition
    this.lowestprice = lowestprice
    this.seller = seller
  }

  toString(){
    return `Evidence(${this.quantity},${this.bookname},${this.courses},${this.covertype},${this.condition},${this.lowestprice},${this.seller})`
  }
}

module.exports = Evidence*/


class Evidence{
  constructor(person,skill,url){
    this.person = person
    this.skill = skill
    this.url = url
  }

  toString(){
    return `Evidence(${this.person},${this.skill},${this.url})`
  }
}

module.exports = Evidence
