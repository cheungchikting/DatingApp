$(function () {

  if ($(".likeBtn")) {
    $(".likeBtn").on("click", function (e) {
      e.preventDefault();
      let id = $(this).attr("data-id")
      $.post(`/like/${id}`)
        .done(() => {
          $.get(`/check/${id}`)
            .done((data) => {
              console.log(data)
              if (data) {
                $('.navbar_container').parent().append(
                  `<div class="wrapper active">
                  <div class="container-btn match-finish active">
                  <a href="/findmatches">  <i class="fas fa-times close"></i></a>
                  <p class="text">You guys like each other!</p>
                  <a href="/chatroom" class="btn-match">Chat Now!</a>
                </div>
               </div>`)
               setTimeout(() => {
                window.location.href = "/findmatches"
              }, 2000);
              } else {
                window.location.href = "/findmatches"
              }
            })
        })
    })
  }

  if ($("#profilelike")) {
    $("#profilelike").on("click", function (e) {
      e.preventDefault();
      let id = $(this).attr("data-id")
      $.post(`/like/${id}`)
        .done(() => {
          $.get(`/check/${id}`)
            .done((data) => {
              console.log(data)
              if (data) {
                console.log("hit me")
                $('.navbar_container').parent().append(
                  `<div class="wrapper-two active">
                  <a href="/findmatches">  <i class="fas fa-times close"></i></a>
                <div class="container-btn match-finish active">
                <p class="text">You guys like each other!</p>
                <a href="/chatroom" class="btn-match">Chat Now!</a>
              </div>
             </div>`)
                setTimeout(() => {
                  window.location.href = `/profiles/${id}`
                }, 2000);
              } else {
                  window.location.href = `/profiles/${id}`
              }
              // $(this).remove()
              // $('#pass').remove()


            })
        })
    })

  }

  if ($(".dislikeBtn")) {
    $(".dislikeBtn").on("click", function (e) {
      e.preventDefault();
      let id = $(this).attr("data-id")
      $.post(`/dislike/${id}`)
        .done(() => {
          window.location.href = "/findmatches"
        })
    })
  }

  if ($(".passbtn")) {
    $(".passbtn").on("click", function (e) {
      e.preventDefault();
      let id = $(this).attr("data-id")
      $.post(`/dislike/${id}`)
        .done(() => {
          window.location.href = "/findmatches"
        })
    })
  }

})