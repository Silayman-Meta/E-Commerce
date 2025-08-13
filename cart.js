console.clear();

// Update badge counter from cookie
function updateBadgeCounter() {
    // Check for the counter cookie (for backward compatibility)
    if(document.cookie.indexOf('counter=') >= 0) {
        const counterCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('counter='));
        if (counterCookie) {
            const counter = counterCookie.split('=')[1];
            if (document.getElementById("badge")) {
                document.getElementById("badge").innerHTML = counter;
            }
        }
    }
}

// Call the function to update the badge counter
updateBadgeCounter();

// Get cart container element
const cartContainer = document.getElementById('cartContainer');

// Create box container for cart items
const boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';

// Function to create a cart item element
function createCartItemElement(item) {
    const boxDiv = document.createElement('div');
    boxDiv.id = 'box';
    boxDiv.dataset.itemId = item.id;

    const boxImg = document.createElement('img');
    boxImg.src = item.preview;
    boxDiv.appendChild(boxImg);

    const boxContent = document.createElement('div');
    boxContent.className = 'box-content';
    boxDiv.appendChild(boxContent);

    const boxh3 = document.createElement('h3');
    boxh3.textContent = item.name;
    boxContent.appendChild(boxh3);

    const boxBrand = document.createElement('p');
    boxBrand.className = 'brand';
    boxBrand.textContent = item.brand;
    boxContent.appendChild(boxBrand);

    const boxh4 = document.createElement('h4');
    boxh4.textContent = 'Price: $' + Number(item.price).toFixed(2);
    boxContent.appendChild(boxh4);

    const quantityControl = document.createElement('div');
    quantityControl.className = 'quantity-control';
    boxContent.appendChild(quantityControl);

    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = 'Quantity: ';
    quantityControl.appendChild(quantityLabel);

    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '-';
    decreaseBtn.className = 'quantity-btn';
    decreaseBtn.onclick = function() {
        updateItemQuantity(item.id, -1);
    };
    quantityControl.appendChild(decreaseBtn);

    const quantitySpan = document.createElement('span');
    quantitySpan.className = 'quantity';
    quantitySpan.textContent = item.quantity;
    quantityControl.appendChild(quantitySpan);

    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.className = 'quantity-btn';
    increaseBtn.onclick = function() {
        updateItemQuantity(item.id, 1);
    };
    quantityControl.appendChild(increaseBtn);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = function() {
        removeItemFromCart(item.id);
    };
    boxContent.appendChild(removeBtn);

    return boxDiv;
}

// Function to update item quantity
function updateItemQuantity(itemId, change) {
    // Get cart data from cookie
    let cartItems = getCartItems();

    // Find the item in the cart
    const itemIndex = cartItems.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
        // Update quantity
        cartItems[itemIndex].quantity += change;

        // Remove item if quantity is 0 or less
        if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }

        // Save updated cart
        saveCartItems(cartItems);

        // Refresh cart display
        renderCart();
    }
}

// Function to remove item from cart
function removeItemFromCart(itemId) {
    // Get cart data from cookie
    let cartItems = getCartItems();

    // Remove the item from the cart
    const itemIndex = cartItems.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
        cartItems.splice(itemIndex, 1);

        // Save updated cart
        saveCartItems(cartItems);

        // Refresh cart display
        renderCart();
    }
}

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

// Function to save cart items to cookie
function saveCartItems(cartItems) {
    // Calculate total items
    const counter = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Save updated cart to cookie (expires in 7 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cartItems)) +
                      ";expires=" + expiryDate.toUTCString() + ";path=/";

    // Update counter cookie for backward compatibility
    document.cookie = "counter=" + counter + ";expires=" + expiryDate.toUTCString() + ";path=/";

    // Update badge
    if (document.getElementById("badge")) {
        document.getElementById("badge").innerHTML = counter;
    }

    // Update total items display
    if (document.getElementById("totalItem")) {
        document.getElementById("totalItem").innerHTML = 'Total Items: ' + counter;
    }
}

// Create total container
const totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

const totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

const totalh2 = document.createElement('h2');
totalh2.textContent = 'Total Amount';
totalDiv.appendChild(totalh2);

// Function to update total amount
function updateTotalAmount(cartItems) {
    // Remove existing total amount if any
    const existingTotal = totalDiv.querySelector('h4');
    if (existingTotal) {
        totalDiv.removeChild(existingTotal);
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

    // Create and append total amount element
    const totalh4 = document.createElement('h4');
    totalh4.textContent = 'Amount: $' + Number(totalAmount).toFixed(2);
    totalh4.id = 'toth4';
    totalDiv.appendChild(totalh4);

    return totalAmount;
}

// Create checkout button
const buttonDiv = document.createElement('div');
buttonDiv.id = 'button';

const buttonTag = document.createElement('button');
buttonTag.textContent = 'Place Order';
buttonTag.disabled = true; // Disable by default, will enable if cart has items
buttonTag.onclick = function() {
    window.location.href = 'orderPlaced.html';
};

buttonDiv.appendChild(buttonTag);
totalDiv.appendChild(buttonDiv);

// Function to render the cart
function renderCart() {
    // Clear existing cart items
    cartContainer.innerHTML = '';

    // Get cart items
    const cartItems = getCartItems();

    // Update total items display
    if (document.getElementById("totalItem")) {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        document.getElementById("totalItem").innerHTML = 'Total Items: ' + totalItems;
    }

    if (cartItems.length > 0) {
        // Create box container
        boxContainerDiv.innerHTML = '';

        // Add each item to the cart
        cartItems.forEach(item => {
            const itemElement = createCartItemElement(item);
            boxContainerDiv.appendChild(itemElement);
        });

        // Add items container to cart
        cartContainer.appendChild(boxContainerDiv);

        // Update total amount
        updateTotalAmount(cartItems);

        // Add total container to cart
        cartContainer.appendChild(totalContainerDiv);

        // Enable checkout button
        buttonTag.disabled = false;
    } else {
        // Display empty cart message
        const emptyCartMessage = document.createElement('h3');
        emptyCartMessage.textContent = 'Your cart is empty';
        emptyCartMessage.style.textAlign = 'center';
        cartContainer.appendChild(emptyCartMessage);

        // Disable checkout button
        buttonTag.disabled = true;
    }
}

// Add some CSS styles for the new elements
const styleElement = document.createElement('style');
styleElement.textContent = `
    .box-content {
        padding: 10px;
        width: 100%;
    }
    .quantity-control {
        margin: 10px 0;
    }
    .quantity-btn {
        background-color: #f1f1f1;
        border: none;
        padding: 5px 10px;
        margin: 0 5px;
        cursor: pointer;
        border-radius: 3px;
    }
    .quantity {
        font-weight: bold;
        margin: 0 10px;
    }
    .remove-btn {
        background-color: #ff6b6b;
        color: white;
        border: none;
        padding: 5px 10px;
        margin-top: 10px;
        cursor: pointer;
        border-radius: 3px;
    }
    .brand {
        color: #888;
        margin: 5px 0;
    }
    #box {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 20px;
    }
    #box img {
        max-width: 100px;
        max-height: 100px;
        object-fit: cover;
        margin-right: 20px;
    }
`;
document.head.appendChild(styleElement);

// Initialize the cart
renderCart();
