$(function () {

  if ($(".likeBtn")) {
    $(".likeBtn").on("click", function (e) {
      e.preventDefault();
      let id = $(this).attr("data-id")
      $.post(`/like/${id}`)
        .done((data) => {
          if (JSON.parse(data).checkMatch.indexOf(data.user_id) > -1) {
            console.log('this is a match!')

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



          }
          $(this).remove()
          $('#pass').remove()
        })
    })

  }

})