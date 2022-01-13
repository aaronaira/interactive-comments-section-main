const card = `
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

const reply_card = `
<div class="reply">
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
  </div>
</div>`

const storage = window.localStorage




const fetchData = async () => {
  const response = await fetch("data.json")
  const data = await response.json();
  return [data][0];
}



const getData = async (type_data) => {
  let data;

  if(storage.getItem(type_data)) {
    data =  JSON.parse(storage.getItem(type_data))
    
  } else {
      console.log("no data in localstorage, fetching new data")
      data = await fetchData()
      data = data[type_data]
      storage.setItem(type_data,JSON.stringify(data))
    }

  return data;
  
}

const renderComments = async  () => {
    
    let data_ = await getData("comments")  

    await data_.map((data, i)=> {
    
    let card_content =  card.replace("$uid", "u"+i).replace("$uname",data.user["username"])
    .replace("$uimg",data.user["image"]["webp"]).replace("$udate", data.createdAt)
    .replace("$ucontent",data.content).replace("$uscore",data.score)

    document.querySelector("div.container-fluid").innerHTML += card_content;
    
    // if comment has replies, then map the replies tho
    console.log(data.replies)
  
    if(data.replies.length > 0) {
      
      data.replies.map((reply, ir)=> {

        let reply_card_content = reply_card.replace("$uid", "r"+reply.id).replace("$uname",reply.user["username"])
        .replace("$uimg",reply.user["image"]["webp"]).replace("$udate", reply.createdAt)
        .replace("$ucontent",reply.content).replace("$uscore",reply.score)
        document.querySelector("#u"+i).innerHTML += reply_card_content

      })
    }
  })
}

const updateStorage = (data) => {
  storage.setItem('comments', JSON.stringify(data))

}

const loadScore = async (id) => {

  let getScore = await getData("comments")
  getScore = getScore[id]["score"]
  return getScore;
}

const updateScore = async (id, vote, type)=> { 
  
  let comments = await getData("comments")
  let updateScoreComment = comments

  let updateScoreReply = comments
  
  if (type) {

    vote == "plus" ? updateScoreComment[id]["score"]++ :
    updateScoreComment[id]["score"]--
    updateStorage(updateScoreComment)

  } else {
    
    vote == "plus" ? updateScoreReply[id]["replies"][id]["score"]++ :
    updateScoreReply[id]["score"]--
    updateStorage(updateScoreReply)

  }
 
}

const getLikes =   () => {
  let cardSelection =  document.querySelectorAll("div.card")
    cardSelection.forEach(el => {
      el.addEventListener("click", async (e)=>{
        
        await updateScore(e.currentTarget.id[1], e.target.className)
        console.log(e.target)
        e.currentTarget.querySelector(".card-score span").innerHTML = await loadScore(e.currentTarget.id[1]);
    });
  })
}
const getReplyLikes = () => {
  let cardReplySelection = document.querySelectorAll("div.reply")
  cardReplySelection.forEach(el => {
    el.addEventListener("click", (e) => {
      console.log(e.currentTarget)
    })
  })
}
/*
* Render items
*/
const render = async () => {
  await renderComments();
  getLikes();
  getReplyLikes();
}


render();


// fetchData().then(data => {
//   storage.setItem('data', JSON.stringify(data))
// })
// console.log(storage.getItem("data"))

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