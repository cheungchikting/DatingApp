$(function () {

  if ($(".likeBtn")) {
    $(".likeBtn").on("click", function (e) {
      e.preventDefault();
      let id = $(this).attr("data-id")
      $.post(`/like/${id}`)
        .done((data) => {
          if (JSON.parse(data).checkMatch.indexOf(data.user_id) > -1) {
            console.log('this is a match!')
            $('.navbar_container').parent().append(
              `<div class="wrapper active">

              <div class="container-btn match-finish active">
                <i class="fas fa-times close"></i>
                <p class="text">You have like the person!</p>
                <a href="" class="btn-match">Chat Now!</a>
              </div>
          
             </div>`)

          }
          window.location.href = "/findmatches"
        })
    })
  }

  if ($("#profilelike")) {
    $("#profilelike").on("click", function (e) {
      e.preventDefault();
      let id = $(this).attr("data-id")
      $.post(`/like/${id}`)
        .done((data) => {
          console.log(JSON.parse(data).checkMatch[0])
          if (JSON.parse(data).checkMatch.indexOf(data.user_id) > -1) {
            console.log('this is a match!')
            $('.navbar_container').parent().append(
              `<div class="wrapper active">

              <div class="container-btn match-finish active">
                <i class="fas fa-times close"></i>
                <p class="text">You have like the person!</p>
                <a href="" class="btn-match">Chat Now!</a>
              </div>
          
             </div>`)


          }
          $(this).remove()
          $('#pass').remove()
        })
    })

  }

})