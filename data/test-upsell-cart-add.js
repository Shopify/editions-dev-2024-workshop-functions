fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    items: [...Array(1).keys()].map(n => ({
        id: '45509876351200', // update to your variant id
        quantity: 1,
        properties: {
            '_is-upsell': 'true'
        }
    }))
})
})
.then(res => res.json())
.then(console.log)
.catch((error) => {
  console.error('Error:', error);
});