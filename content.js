console.clear();

let contentTitle;

// Function to generate random ratings between 3.5 and 5
function getRandomRating() {
  return (Math.random() * 1.5 + 3.5).toFixed(1);
}

// Function to generate random number of reviews
function getRandomReviews() {
  return Math.floor(Math.random() * 5000) + 100;
}

// Function to check if item should have Prime badge (70% chance)
function hasPrimeBadge() {
  return Math.random() > 0.3;
}

// Function to create JoyMart product card
function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";
  boxDiv.dataset.productId = ob.id;

  // Product image with link
  let boxLink = document.createElement("a");
  boxLink.href = "contentDetails.html?" + ob.id;

  let imgTag = document.createElement("img");
  imgTag.src = ob.image;
  imgTag.alt = ob.title;

  // Product details section
  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  // Product title
  let h3 = document.createElement("h3");
  h3.textContent = ob.title;

  // Brand title
  let h4 = document.createElement("h4");
  h4.textContent = ob.brand;

  // Ratings section
  let ratingsDiv = document.createElement("div");
  ratingsDiv.className = "ratings";

  // Generate random rating
  const rating = ob.rating.rate;//getRandomRating();
  const reviews = ob.rating.count;//getRandomReviews();

  // Create star rating
  let starsSpan = document.createElement("span");
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsSpan.innerHTML += "★";
  }

  // Add half star if needed
  if (hasHalfStar) {
    starsSpan.innerHTML += "★";
  }

  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsSpan.innerHTML += "☆";
  }

  // Add rating number and review count
  let reviewsSpan = document.createElement("span");
  reviewsSpan.textContent = ` ${rating} (${reviews.toLocaleString()})`;
  reviewsSpan.style.fontSize = "12px";
  reviewsSpan.style.color = "#007185";

  ratingsDiv.appendChild(starsSpan);
  ratingsDiv.appendChild(reviewsSpan);

  // Price section with Amazon-style formatting
  let h2 = document.createElement("h2");
  h2.innerHTML = `$<span style="font-size:22px">${Number(ob.price).toFixed(2)}</span>`;

  // Express shipping badge placeholder (always create for consistent layout)
  let expressDiv = document.createElement("div");
  expressDiv.className = "prime-badge";

  // Only show badge for some products
  if (hasPrimeBadge()) {
    expressDiv.textContent = "Joy+";
    expressDiv.style.backgroundColor = "#FF6B6B";
    expressDiv.style.visibility = "visible";
  } else {
    // Hidden placeholder to maintain consistent layout
    expressDiv.style.visibility = "hidden";
    expressDiv.style.height = "22px"; // Approximate height of the badge
  }

  detailsDiv.appendChild(expressDiv);

  // Add to Cart button
  let addToCartBtn = document.createElement("button");
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.style.backgroundColor = "#FFD814";
  addToCartBtn.style.border = "none";
  addToCartBtn.style.borderRadius = "20px";
  addToCartBtn.style.padding = "8px 15px";
  addToCartBtn.style.marginTop = "10px";
  addToCartBtn.style.cursor = "pointer";
  addToCartBtn.style.width = "100%";
  addToCartBtn.style.fontSize = "13px";
  addToCartBtn.style.fontWeight = "500";

  // Add to Cart functionality
  addToCartBtn.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();

    // Get cart items from cookie
    let cartItems = [];
    if(document.cookie.indexOf('cart=') >= 0) {
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
    const existingItemIndex = cartItems.findIndex(item => item.id === ob.id);

    if (existingItemIndex >= 0) {
      // Increment quantity if item already exists
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cartItems.push({
        id: ob.id,
        name: ob.title, // Changed from ob.name to ob.title to match the new API
        brand: ob.category, // Changed from ob.brand to ob.category to match the new API
        price: ob.price,
        preview: ob.image, // Changed from ob.preview to ob.image to match the new API
        quantity: 1
      });
    }

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
  };

  // Assemble the product card
  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(ratingsDiv);
  detailsDiv.appendChild(h2);
  detailsDiv.appendChild(addToCartBtn);

  return boxDiv;
}

// Update badge counter from cookie
function updateBadgeCounter() {
  if(document.cookie.indexOf('counter=') >= 0) {
    const counterCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('counter='));
    if (counterCookie && document.getElementById("badge")) {
      const counter = counterCookie.split('=')[1];
      document.getElementById("badge").innerHTML = counter;
    }
  }
}

// Call the function to update the badge counter
updateBadgeCounter();

// Get container elements
let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");
let recommendationScroll = document.querySelector(".recommendation-scroll");

// BACKEND CALLING
let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status == 200) {
      contentTitle = JSON.parse(this.responseText);

      // Process products
      for (let i = 0; i < contentTitle.length; i++) {
        if (contentTitle[i].isAccessory) {
          containerAccessories.appendChild(
            dynamicClothingSection(contentTitle[i])
          );
        } else {
          containerClothing.appendChild(
            dynamicClothingSection(contentTitle[i])
          );
        }

        // Add some products to recommendations section
        if (i % 3 === 0 && recommendationScroll) {
          const recommendedProduct = dynamicClothingSection(contentTitle[i]);
          recommendedProduct.style.minWidth = "200px";
          recommendedProduct.style.margin = "0 10px";
          recommendationScroll.appendChild(recommendedProduct);
        }
      }
    } else {
      console.log("API call failed!");

      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.style.textAlign = 'center';
      errorMsg.style.padding = '20px';
      errorMsg.style.color = '#B12704';
      errorMsg.innerHTML = '<h3>Sorry, we encountered an error loading products.</h3><p>Please try refreshing the page.</p>';

      if (containerClothing) containerClothing.appendChild(errorMsg.cloneNode(true));
      if (containerAccessories) containerAccessories.appendChild(errorMsg.cloneNode(true));
    }
  }
};

httpRequest.open(
  "GET",
  "https://fakestoreapi.com/products",
  true
);

httpRequest.send();
