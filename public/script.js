const inputs = document.querySelectorAll(".input");

function focusFunction(){
    let grandparentNode = this.parentNode.parentNode;
    grandparentNode.classList.add('focus');
}
function blurFunction(){
    let grandparentNode = this.parentNode.parentNode;
    if(this.value == ''){
        grandparentNode.classList.remove('focus');
    }
}

inputs.forEach(input=>{
    input.addEventListener('focus',focusFunction);
    input.addEventListener('blur',blurFunction);
});


let box = document.querySelectorAll('.box');
box.forEach(popup => popup.addEventListener('click',() => {
    popup.classList.toggle("active")
}))