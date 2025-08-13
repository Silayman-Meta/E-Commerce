// Load Facebook Pixel script
const pixelScript = document.createElement('script');
pixelScript.src = 'js/facebook-pixel.js';
pixelScript.async = true;
document.head.appendChild(pixelScript);

// Function to get cart items from cookie
function getCartItems() {
    let cartItems = [];

    // Check if cart cookie exists
    if(document.cookie.indexOf('cart=') >= 0) {
        // Parse existing cart data
        try {
            const cartCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('cart='));
            if (cartCookie) {
                cartItems = JSON.parse(decodeURIComponent(cartCookie.split('=')[1]));
            }
        } catch (e) {
            console.error('Error parsing cart cookie:', e);
            cartItems = [];
        }
    }

    return cartItems;
}

// Get cart items before clearing cookies
const cartItems = getCartItems();

// Calculate order amount from cart items
const orderAmount = cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0) || 200; // Default to 200 if calculation fails


// Clear cookies after tracking the purchase
const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() - 1); // Set to expire in the past to delete
document.cookie = "cart=;expires=" + expiryDate.toUTCString() + ";path=/";
document.cookie = "counter=0;expires=" + expiryDate.toUTCString() + ";path=/";

// Update order details in the backend
let httpRequest = new XMLHttpRequest(),
jsonArray,
method = "GET",
jsonRequestURL = "https://5d76bf96515d1a0014085cf9.mockapi.io/order";

httpRequest.open(method, jsonRequestURL, true);
httpRequest.onreadystatechange = function()
{
    if(httpRequest.readyState == 4 && httpRequest.status == 200)
    {
        try {
            // convert JSON into JavaScript object
            jsonArray = JSON.parse(httpRequest.responseText);
            console.log(jsonArray);

            // Create order details with product information
            const orderProducts = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                brand: item.brand,
                price: item.price,
                quantity: item.quantity
            }));

            // Add new order to the array
            jsonArray.push({
                "id": (jsonArray.length)+1,
                "amount": orderAmount,
                "products": orderProducts.length > 0 ? orderProducts : ["userOrder"]
            });

            // send with new request the updated JSON file to the server:
            httpRequest.open("POST", jsonRequestURL, true);
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            httpRequest.send(jsonArray);
        } catch (error) {
            console.error("Error processing order:", error);
        }
    }
}
httpRequest.send(null);

// Display order summary if we have items
if (cartItems.length > 0) {
    // Create order summary element
    setTimeout(() => {
        const orderContainer = document.getElementById('orderContainer');
        if (orderContainer) {
            const orderSummary = document.createElement('div');
            orderSummary.className = 'order-summary';
            orderSummary.innerHTML = `
                <h3>Order Summary</h3>
                <p>Total Amount: $${Number(orderAmount).toFixed(2)}</p>
                <p>Items: ${cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
            `;
            orderContainer.appendChild(orderSummary);
        }
    }, 500);

    // Track Facebook Pixel Purchase event
    setTimeout(() => {
        if (window.facebookPixel) {
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            window.facebookPixel.trackPurchase({
                totalAmount: orderAmount,
                totalItems: totalItems,
                items: cartItems
            });
        }
    }, 1000);
}
