let products = [];

const displayProducts =(items)=>{    
    const productList =document.getElementById("cart_list");
    productList.innerHTML="";
    if(items.length ===0){
        productList.innerHTML =" <p>No Products Found</p>";
        return;
    }
    items.forEach(product=>{
        const productCard = document.createElement("div");
        productCard.className="product_card";
        productCard.innerHTML =`
            <div class="product">
                <img src="${product.image}" alt="${product.title}">
                <h4>${product.title}</h4>
                <p>Price: ${product.price}</p>
            </div>
            <button onclick="removeFromCart(\`${product.id}\`)">Remove</button>
        `
        productList.appendChild(productCard)
    })
}

const emptyCart = () => {
    localStorage.removeItem("cart");
    products = [];
    displayProducts(products);
}

const removeFromCart = (productId) => {
    const productIndex = products.findIndex(p => p.id == productId);
    products.splice(productIndex, 1);
    localStorage.setItem("cart", JSON.stringify(products));
    displayProducts(products);
}

const cartData = localStorage.getItem("cart");
products = JSON.parse(cartData) || [];
displayProducts(products);