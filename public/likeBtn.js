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
                  <p class="text">You have like the person!</p>
                  <a href="/chatroom" class="btn-match">Chat Now!</a>
                </div>
               </div>`)
               setTimeout(() => {
                window.location.href = "/findmatches"
              }, 3000);
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
                <div class="container-btn match-finish active">
                <i class="fas fa-times close"></i>
                <p class="text">You have like the person!</p>
                <a href="/chatroom" class="btn-match">Chat Now!</a>
              </div>
             </div>`)
                setTimeout(() => {
                  window.location.href = `/profiles/${id}`
                }, 3000);
              } else {
                  window.location.href = `/profiles/${id}`
              }
              // $(this).remove()
              // $('#pass').remove()


            })
        })
    })

  }

})