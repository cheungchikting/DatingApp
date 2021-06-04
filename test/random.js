let array = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
let newArr = []


for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * array.length)
    let randomItem = array[randomIndex]
    array.splice(randomIndex, 1)
    newArr.push(randomItem)
}





console.log(newArr)