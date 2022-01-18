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
<div id="$nid" class="reply">
  <div id="$uid" class="card">
  <div class="card-header d-flex align-items-center justify-content-between">
    <img src="$uimg" width="50px">
    <div class="card-user fw-bold fs-6">$uname</div>
    <div class="card-date">$udate</div>
  </div>
  <div class="card-body p-2">
     <p><span class="reply_to">@$replyto</span> $ucontent</p>
  </div>
  <div class="card-footer d-flex justify-content-between">
    <div class="card-score">
      <img src="/images/icon-plus.svg" class="plus"> <span>$uscore</span> <img src="/images/icon-minus.svg" class="minus">
    </div>
    <div class="card-reply">
      $editcomment
  
    </div>
  </div>
  </div>
</div>`

const reply_input = `
<div class="reply_card card">
<div class="reply-inputarea">
  <img src="http://127.0.0.1:5500/images/avatars/image-juliusomo.webp" alt="">
  <textarea name="reply_c" class="textarea_replycomment" id="reply_comment"></textarea>
  <span class="reply-btn">REPLY</span>
</div>
</div>
`

const storage = window.localStorage

const fetchData = async () => {
  const response = await fetch("./data.json")
  const data = await response.json();
  return [data][0];
}

const getCurrentUser = async () => {
  let getUser = await getData("currentUser")

  return getUser;
}

const getReplyComment = () => {
  let cards = document.querySelectorAll(".card")

  cards.forEach(el => {
    el.querySelector(".card-reply").addEventListener("click", e => {

      if(document.querySelector(`div#${el.id} + .reply_card`)) {
        document.querySelector(`div#${el.id} + .reply_card`).remove();
        // document.querySelector(`div#${el.id}`).insertAdjacentHTML('afterend', reply_input)
      } else {
        document.querySelector(`div#${el.id}`).insertAdjacentHTML('afterend', reply_input);
        document.querySelector(".reply-btn").addEventListener("click", e=> {
          let comment = document.querySelector("#reply_comment").value
          console.log(saveComment(el.id[1], comment))
        })

      }
      
    })
  })
}

const getData = async (type_data) => {
  let data;

  if (storage.getItem(type_data)) {
    data = JSON.parse(storage.getItem(type_data))

  } else {
    console.log("no data in localstorage, fetching new data")
    data = await fetchData()
    data = data[type_data]
    storage.setItem(type_data, JSON.stringify(data))
  }

  return data;

}

const renderComments = async () => {

  let data_ = await getData("comments")

  await data_.map((data, i) => {

    let card_content = card.replace("$uid", "u" + i).replace("$uname", data.user["username"])
      .replace("$uimg", data.user["image"]["webp"]).replace("$udate", data.createdAt)
      .replace("$ucontent", data.content).replace("$uscore", data.score)

    document.querySelector("div.container-fluid").innerHTML += card_content;

    // if comment has replies, then map the replies tho
  
    if (data.replies.length > 0) {

      data.replies.map(async (reply, ir) => {
        let currentUser = await getCurrentUser();

        let check_user_reply = reply.user["username"] == currentUser ? `${currentUser}<span class="self_user">you</span>` :
          reply.user["username"]
        
        let edit_user_comment = reply.user["username"] == currentUser ? `<div class="delete-reply"><img src="/images/icon-delete.svg"><span class="delete">Delete</span></div> <div class="edit-reply"><img src="/images/icon-edit.svg"><span>Edit</span></div>` : `<img src="/images/icon-reply.svg"> <span>Reply</span>`

        let reply_card_content = reply_card.replace("$nid", "n" + i).replace("$uid", "r" + ir).replace("$uname", check_user_reply)
          .replace("$uimg", reply.user["image"]["webp"]).replace("$udate", reply.createdAt)
          .replace("$replyto", reply.replyingTo).replace("$ucontent", reply.content).replace("$uscore", reply.score).replace("$editcomment", edit_user_comment)
        document.querySelector("#u" + i).innerHTML += reply_card_content

      })
    }
  })
}

const saveComment = async (id, comment) => {
  let data = await getData("comments")
  let currentUser = await getCurrentUser()

  console.log(id, comment)
  console.log(data[id]["replies"].push({'id': 0, 'comment': 'asdasdasd'}))
  console.log(data[id].replies)
  console.log(currentUser)
}


const updateStorage = (data) => {
  storage.setItem('comments', JSON.stringify(data))

}

const updateScore = async (id, vote, type, user) => {

  let comments = await getData("comments")
  let updateScoreComment = comments

  let updateScoreReply = comments

  if (type == "comment") {

    vote == "plus" ? updateScoreComment[id]["score"]++ :
      updateScoreComment[id]["score"]--

    updateStorage(updateScoreComment)
    return updateScoreComment[id]["score"]

  } else if (type == "reply") {

    vote == "plus" ? updateScoreReply[user]["replies"][id]["score"]++ :
      updateScoreReply[user]["replies"][id]["score"]--

    updateStorage(updateScoreReply)
    return updateScoreReply[user]["replies"][id]["score"]

  }

}

const getLikes = () => {
  let cardSelection = document.querySelectorAll("div.card")
  cardSelection.forEach(el => {

    if (el.id.includes("u")) {
      el.querySelector(`#${el.id} .plus`).addEventListener("click", async (e) => {
        el.querySelector(`#${el.id} .card-score > span`).innerHTML = await updateScore(el.id[1], e.target.className, "comment", null);

      })
      el.querySelector(`#${el.id} .minus`).addEventListener("click", async (e) => {
        el.querySelector(`#${el.id} .card-score > span`).innerHTML = await updateScore(el.id[1], e.target.className, "comment", null);

      })
    }
  })
}
const getReplyLikes = () => {
  let cardReplySelection = document.querySelectorAll("div.reply")
  cardReplySelection.forEach(el => {
    el.addEventListener("click", async (e) => {
      let user_reply = e.currentTarget.id[1]
      let user_id = e.currentTarget.querySelector(".card").id[1]
      let signal = e.target.className
      if (signal == "plus" || signal == "minus") {
        e.currentTarget.querySelector(".reply .card-score span").innerHTML = await updateScore(user_id, signal, "reply", user_reply)

      }
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
  getReplyComment();
  
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