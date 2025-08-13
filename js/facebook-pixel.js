// Facebook Pixel Configuration
// Replace 'YOUR_PIXEL_ID' with your actual Facebook Pixel ID

class FacebookPixel {
    constructor(pixelId) {
        this.pixelId = pixelId;
        this.initializePixel();
    }

    initializePixel() {
        // Facebook Pixel Base Code
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');

        // Initialize the pixel
        fbq('init', this.pixelId);

        // Track PageView by default
        fbq('track', 'PageView');

        console.log('Facebook Pixel initialized with ID:', this.pixelId);
    }

    // Track AddToCart event
    trackAddToCart(productData) {
        const eventData = {
            content_name: productData.name,
            content_category: productData.category,
            content_ids: [productData.id],
            content_type: 'product',
            value: parseFloat(productData.price),
            currency: 'USD'
        };

        fbq('track', 'AddToCart', eventData);

        console.log('Facebook Pixel: AddToCart tracked', eventData);
    }

    // Track InitiateCheckout event
    trackInitiateCheckout(cartData) {
        const contentIds = cartData.items.map(item => item.id);
        const totalValue = cartData.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const numItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);

        const eventData = {
            content_ids: contentIds,
            content_type: 'product',
            value: totalValue,
            currency: 'USD',
            num_items: numItems
        };

        fbq('track', 'InitiateCheckout', eventData);

        console.log('Facebook Pixel: InitiateCheckout tracked', eventData);
    }

    // Track Purchase event
    trackPurchase(orderData) {
        const contentIds = orderData.items.map(item => item.id);

        const eventData = {
            content_ids: contentIds,
            content_type: 'product',
            value: parseFloat(orderData.totalAmount),
            currency: 'USD',
            num_items: orderData.totalItems
        };

        fbq('track', 'Purchase', eventData);

        console.log('Facebook Pixel: Purchase tracked', eventData);
    }

    // Track ViewContent event (for product page views)
    trackViewContent(productData) {
        const eventData = {
            content_name: productData.name,
            content_category: productData.category,
            content_ids: [productData.id],
            content_type: 'product',
            value: parseFloat(productData.price),
            currency: 'USD'
        };

        fbq('track', 'ViewContent', eventData);

        console.log('Facebook Pixel: ViewContent tracked', eventData);
    }
}

// Initialize Facebook Pixel with your Pixel ID
// Replace 'YOUR_PIXEL_ID' with your actual Facebook Pixel ID
const facebookPixel = new FacebookPixel('16602420983759');

// Export for use in other files
window.facebookPixel = facebookPixel;
