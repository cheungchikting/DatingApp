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
                  <i class="fas fa-times close"></i>
                  <p class="text">You guys like each other!</p>
                  <a href="/chatroom" class="btn-match">Chat Now!</a>
                </div>
               </div>`)
               setTimeout(() => {
                window.location.href = "/likeme"
              }, 2000);
              } else {
                window.location.href = "/likeme"
              }
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
          window.location.href = "/likeme"
        })
    })
  }

})