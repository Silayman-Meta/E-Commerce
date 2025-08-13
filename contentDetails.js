console.clear()

let id = location.search.split('?')[1]
console.log(id)

if(document.cookie.indexOf(',counter=')>=0)
{
    let counter = document.cookie.split(',')[1].split('=')[1]
    document.getElementById("badge").innerHTML = counter
}

function dynamicContentDetails(ob)
{
    let mainContainer = document.createElement('div')
    mainContainer.id = 'containerD'
    document.getElementById('containerProduct').appendChild(mainContainer);

    let imageSectionDiv = document.createElement('div')
    imageSectionDiv.id = 'imageSection'

    let imgTag = document.createElement('img')
    imgTag.id = 'imgDetails'
    // Use image property from fakestoreapi instead of preview
    imgTag.src = ob.image

    imageSectionDiv.appendChild(imgTag)

    let productDetailsDiv = document.createElement('div')
    productDetailsDiv.id = 'productDetails'

    let h1 = document.createElement('h1')
    // Use title property from fakestoreapi instead of name
    let h1Text = document.createTextNode(ob.title)
    h1.appendChild(h1Text)

    let h4 = document.createElement('h4')
    // Use category property from fakestoreapi instead of brand
    let h4Text = document.createTextNode(ob.category)
    h4.appendChild(h4Text)

    // Add ratings section (from fakestoreapi)
    let ratingsDiv = document.createElement('div')
    ratingsDiv.className = 'ratings'

    if (ob.rating && ob.rating.rate) {
        // Create star rating
        let starsSpan = document.createElement('span')
        const rating = ob.rating.rate
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            starsSpan.innerHTML += "★"
        }

        // Add half star if needed
        if (hasHalfStar) {
            starsSpan.innerHTML += "★"
        }

        // Add empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
        for (let i = 0; i < emptyStars; i++) {
            starsSpan.innerHTML += "☆"
        }

        // Add rating number and review count
        let reviewsSpan = document.createElement('span')
        reviewsSpan.textContent = ` ${rating} (${ob.rating.count} reviews)`
        reviewsSpan.style.fontSize = "14px"
        reviewsSpan.style.color = "#007185"

        ratingsDiv.appendChild(starsSpan)
        ratingsDiv.appendChild(reviewsSpan)
    }

    let detailsDiv = document.createElement('div')
    detailsDiv.id = 'details'

    let h3DetailsDiv = document.createElement('h3')
    // Format price with 2 decimal places
    let h3DetailsText = document.createTextNode('$' + Number(ob.price).toFixed(2))
    h3DetailsDiv.appendChild(h3DetailsText)

    let h3 = document.createElement('h3')
    let h3Text = document.createTextNode('Description')
    h3.appendChild(h3Text)

    let para = document.createElement('p')
    let paraText = document.createTextNode(ob.description)
    para.appendChild(paraText)

    // Since fakestoreapi doesn't have multiple product photos, we'll create a simplified preview section
    let productPreviewDiv = document.createElement('div')
    productPreviewDiv.id = 'productPreview'

    let h3ProductPreviewDiv = document.createElement('h3')
    let h3ProductPreviewText = document.createTextNode('Product Preview')
    h3ProductPreviewDiv.appendChild(h3ProductPreviewText)
    productPreviewDiv.appendChild(h3ProductPreviewDiv)

    // Just add the main image as the preview
    let imgTagProductPreviewDiv = document.createElement('img')
    imgTagProductPreviewDiv.id = 'previewImg'
    imgTagProductPreviewDiv.src = ob.image
    imgTagProductPreviewDiv.className = 'active-preview'
    productPreviewDiv.appendChild(imgTagProductPreviewDiv)

    // Add JoyMart "Add to Cart" button
    let buttonDiv = document.createElement('div')
    buttonDiv.id = 'button'

    let buttonTag = document.createElement('button')
    buttonTag.textContent = 'Add to Cart'
    buttonTag.style.backgroundColor = "#FF6B6B"
    buttonTag.style.border = "none"
    buttonTag.style.borderRadius = "20px"
    buttonTag.style.padding = "10px 20px"
    buttonTag.style.fontSize = "16px"
    buttonTag.style.fontWeight = "500"
    buttonTag.style.cursor = "pointer"
    buttonTag.style.width = "100%"
    buttonDiv.appendChild(buttonTag)

    buttonTag.onclick = function()
    {
        // Improved cart handling with better cookie structure
        let cartItems = [];
        let counter = 0;

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

        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => item.id === id);

        if (existingItemIndex >= 0) {
            // Increment quantity if item already exists
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart with properties matching fakestoreapi structure
            cartItems.push({
                id: id,
                name: ob.title,
                brand: ob.category,
                price: ob.price,
                preview: ob.image,
                quantity: 1
            });
        }

        // Calculate total items
        counter = cartItems.reduce((total, item) => total + item.quantity, 0);

        // Save updated cart to cookie (expires in 7 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cartItems)) +
                          ";expires=" + expiryDate.toUTCString() + ";path=/";

        // Update counter cookie for backward compatibility
        document.cookie = "counter=" + counter + ";expires=" + expiryDate.toUTCString() + ";path=/";

        // Update badge
        document.getElementById("badge").innerHTML = counter;

        // Show confirmation message
        const confirmationMsg = document.createElement('div');
        confirmationMsg.style.position = 'fixed';
        confirmationMsg.style.top = '100px';
        confirmationMsg.style.left = '50%';
        confirmationMsg.style.transform = 'translateX(-50%)';
        confirmationMsg.style.backgroundColor = '#4CAF50';
        confirmationMsg.style.color = 'white';
        confirmationMsg.style.padding = '15px';
        confirmationMsg.style.borderRadius = '5px';
        confirmationMsg.style.zIndex = '1000';
        confirmationMsg.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        confirmationMsg.innerHTML = `<strong>${ob.title}</strong> added to cart!`;
        document.body.appendChild(confirmationMsg);

        // Remove confirmation after 2 seconds
        setTimeout(() => {
            confirmationMsg.style.opacity = '0';
            confirmationMsg.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(confirmationMsg);
            }, 500);
        }, 2000);
    }

    // Add "Buy Now" button (JoyMart style)
    let buyNowDiv = document.createElement('div')
    buyNowDiv.id = 'buyNow'

    let buyNowButton = document.createElement('button')
    buyNowButton.textContent = 'Buy Now'
    buyNowButton.style.backgroundColor = "#4A56E2"
    buyNowButton.style.border = "none"
    buyNowButton.style.borderRadius = "20px"
    buyNowButton.style.padding = "10px 20px"
    buyNowButton.style.fontSize = "16px"
    buyNowButton.style.fontWeight = "500"
    buyNowButton.style.cursor = "pointer"
    buyNowButton.style.width = "100%"
    buyNowButton.style.marginTop = "10px"
    buyNowButton.onclick = function() {
        window.location.href = 'orderPlaced.html';
    }

    buyNowDiv.appendChild(buyNowButton)

    // Assemble the product details page
    mainContainer.appendChild(imageSectionDiv)
    mainContainer.appendChild(productDetailsDiv)
    productDetailsDiv.appendChild(h1)
    productDetailsDiv.appendChild(h4)
    productDetailsDiv.appendChild(ratingsDiv)
    productDetailsDiv.appendChild(detailsDiv)
    detailsDiv.appendChild(h3DetailsDiv)
    detailsDiv.appendChild(h3)
    detailsDiv.appendChild(para)
    productDetailsDiv.appendChild(productPreviewDiv)
    productDetailsDiv.appendChild(buttonDiv)
    productDetailsDiv.appendChild(buyNowDiv)

    return mainContainer
}



// BACKEND CALLING

let httpRequest = new XMLHttpRequest()

httpRequest.onreadystatechange = function()
{
    if(this.readyState === 4 && this.status == 200)
    {
        console.log('connected!!');
        let contentDetails = JSON.parse(this.responseText)
        console.log(contentDetails);
        dynamicContentDetails(contentDetails);
    }
    else
    {
        console.log('not connected!');
    }
}

// Fix the API endpoint URL
httpRequest.open('GET', 'https://fakestoreapi.com/products/'+id, true)
httpRequest.send()
