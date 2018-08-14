function NumberAdd(...rest) {

  const numList = []
  const numFMax = {
    length: 0,
    index: 0,
  }
  const numResult = []
  const lastMoreTen = []

  rest.forEach((argument, argumentI) => {
    const strNum = String(argument).split('')
    numList.push(strNum)
    const strNumLength = strNum.length
    if (strNumLength > numFMax.length) {
      numFMax.length = strNumLength
      numFMax.index = argumentI
    }
  })

  numResult.length = numFMax.length
  numResult.fill(0, 0, numFMax.length)

  numList.forEach((strNum, strNumI) => {
    if (strNumI != numFMax.index) {
      const gap = numFMax.length - strNum.length
      const addZeroList = []
      addZeroList.length = gap
      addZeroList.fill(0, 0, gap)
      numList[strNumI] = addZeroList.concat(strNum)
    }
  })

  for (let i = numFMax.length - 1; i >= 0; i--) {
    numList.forEach(strNum => {
      numResult[i] += Number(strNum[i])

      if (i !== 0 && numResult[i] >= 10) {
        numResult[i] -= 10
        numResult[i - 1] += 1
      } else if (i === 0 && numResult[i] >= 10) {
        numResult[i] -= 10
        if (!lastMoreTen[0]) {
          lastMoreTen[0] = 1
        } else {
          lastMoreTen[0] += 1
        }
      }
    })
  }

  return lastMoreTen.concat(numResult).join('')
}

console.log(NumberAdd('99', '99', '99', '0'))
console.log(NumberAdd('123123123123123', '12312123123123'))
