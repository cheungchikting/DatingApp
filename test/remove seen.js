let array = [1,2,3,4,5,6,7,8,9,10]
let matches = [2,4,6,8,10]


for (let each of array){

  for(let x of matches){

    if(each = x){
        let i = array.indexOf(each)
        array.splice(i,1)     
    }

  }
  console.log(array)
  return array
}