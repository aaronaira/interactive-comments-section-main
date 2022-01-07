const fetchData = async () => {
    const response = await fetch("data.json")
    const data = await response.json()
    return data;
}

const user = 

window.onload = () =>(
    fetchData().then(data => {
        const {comments, currentUser} = data
        comments.map((data, i)=> {
            document.querySelector(`#u${i} .card-user`).innerHTML = data.user["username"];
            document.querySelector(`#u${i} .card-date`).innerHTML = data.createdAt;

        })
    })
)