let stripe = Stripe("pk_test_51Ixo4WLAGauiF21CFv1wyqYIllERHVedQKapkCJhkAoqdq9m8F5u0s3Rf7xynWXvo3IbWteTHJpj5pyHcIJBT6vE00mHJpIeAT")

$(function () {
  $(".checkout").on('click', (e) => {
    e.preventDefault();
    let amount = $(e.target).attr("data-amount")
    fetch(`/create-checkout-session/${amount}`, {
      method: "POST",
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      console.log(result)
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
  })
})