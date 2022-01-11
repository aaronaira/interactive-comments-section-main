// const fetchData = async () => {
//     const response = await fetch("data.json")
//     const data = await response.json()
//     return data;
// }

fetch("data.json").then(res => res.json())
.then(data => window.localStorage.setItem('data', JSON.stringify(data)))

const data = JSON.parse(window.localStorage.getItem('data'))

let card = `
<div id="$uid" class="card">
<div class="card-header d-flex align-items-center justify-content-between">
  <img src="$uimg" width="50px">
  <div class="card-user fw-bold fs-6">$uname</div>
  <div class="card-date">$udate</div>
</div>
<div class="card-body p-2">
  <p>$ucontent</p>
</div>
<div class="card-footer d-flex justify-content-between">
  <div class="card-score">
    <img src="/images/icon-plus.svg" class="plus"> <span>$uscore</span> <img src="/images/icon-minus.svg" class="minus">
  </div>
  <div class="card-reply">
    <img src="/images/icon-reply.svg"> <span>Reply</span>

  </div>
</div>
</div>`

const getLike = ()=> {
  let cardSelection = document.querySelectorAll("div.card")
  console.log(cardSelection)
    cardSelection.forEach(el => {
      el.addEventListener("click", (e)=>{
        if(e.target.classList.contains("plus")){
          let userID = e.currentTarget.id[1]
          let score = data["comments"][userID]['score']++
          window.localStorage.setItem('data', JSON.stringify(data))
          e.target.nextElementSibling.innerHTML = score;
        }
      })
    });
}

data["comments"].map((data, i)=> {
  let card_content = card.replace("$uid", "u"+i).replace("$uname",data.user["username"])
  .replace("$uimg",data.user["image"]["webp"]).replace("$udate", data.createdAt)
  .replace("$ucontent",data.content).replace("$uscore",data.score)
  document.querySelector("div.container-fluid").innerHTML += card_content;
})

getLike();

// fetchData().then(data => {
//   window.localStorage.setItem('data', JSON.stringify(data))
// })
// console.log(Window.localStorage.getItem("data"))

// fetchData().then(data => {
//     const {comments, currentUser} = data
//     comments.map((data, i)=> {

//         let card_content = card.replace("$uid", "u"+i).replace("$uname",data.user["username"])
//         .replace("$uimg",data.user["image"]["webp"]).replace("$udate", data.createdAt)
//         .replace("$ucontent",data.content).replace("$uscore",data.score)
//         document.querySelector("div.container-fluid").innerHTML += card_content;
//     })
//     var cardSelection = document.querySelectorAll("div.card")
//     cardSelection.forEach(element => {
//       element.addEventListener("click", (e)=> {
//         if(e.target.classList.contains("plus")) {
//           console.log(e.currentTarget.id[1])
//         }
//       })
//     });
// })



        // document.querySelector(`#u${i} .card-user`).innerHTML = data.user["username"];
        // document.querySelector(`#u${i} figure img`).src = data.user["image"]["webp"];
        // document.querySelector(`#u${i} .card-date`).innerHTML = data.createdAt;
        // document.querySelector(`#u${i} .card-body p`).innerHTML = data.content;
        // document.querySelector(`#u${i} .card-score span`).innerHTML = data.score;