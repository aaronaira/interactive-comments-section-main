const fetchData = async () => {
    const response = await fetch("data.json")
    const data = await response.json()
    return data;
}


window.onload = () =>(
    fetchData().then(data => {
        const {comments, currentUser} = data
        comments.map((data, i)=> {
            document.querySelector(`#u${i} .card-user`).innerHTML = data.user["username"];
            document.querySelector(`#u${i} figure img`).src = data.user["image"]["webp"];
            document.querySelector(`#u${i} .card-date`).innerHTML = data.createdAt;
            document.querySelector(`#u${i} .card-body p`).innerHTML = data.content;
            document.querySelector(`#u${i} .card-score span`).innerHTML = data.score;
        })
    })
)