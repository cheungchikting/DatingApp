var stripe = Stripe("pk_test_51Ixo4WLAGauiF21CFv1wyqYIllERHVedQKapkCJhkAoqdq9m8F5u0s3Rf7xynWXvo3IbWteTHJpj5pyHcIJBT6vE00mHJpIeAT")
let stripeBtn = document.querySelector("#checkout-button")

if(stripeBtn){
  stripeBtn.addEventListener('click', (e) => {
    axios.post('/create-checkout-session').then((session) => {
      return stripe.redirectToCheckout({
        sessionId: session.data.id.id
      })
    }).then((result) => {
      if (result.error) {
        alert(result.error.message);
      }
    }).then(()=>{
      axios.post('/addpoints')
    }).catch((error) => {
      console.error('Error:', error);
    });
  })
}
