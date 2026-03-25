let pages = document.querySelectorAll(".page")
let current = 0

function start(){
document.getElementById("music").play()
next()
startAuto()
}

function next(){
pages[current].classList.remove("active")
current++

if(current >= pages.length){
current = pages.length-1
}

pages[current].classList.add("active")
}

function restart(){
location.reload()
}

function startAuto(){
setInterval(()=>{
if(current>1 && current < pages.length-1){
next()
}
},4500)
}
