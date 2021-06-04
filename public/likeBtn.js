let likeBtn = document.querySelector("#likeBtn")

likeBtn.addEventListener('click',(e)=>{
  let id = deletebtn.getAttribute("data-id")
      axios.post(`/like/${id}`).then((res) => {
        if (res.data.checkMatch[0].like.indexOf(res.data.user_id) > -1) {
          // trigger match modal
        } 
      })
  })
