

/*
fetch(url)
.then(response=> response.json())
.then(data => {
    let element = document.getElementById('element')
    element.innerHTML= '/index.j2'
    console.log(data)
})
.catch(err=>console)
*/
let url = "http://192.168.33.200"
$.get(url, function(answer){
    //let list = answer
    answer.forEach(function(item){
        console.log(answer)

    })
    
},"json")