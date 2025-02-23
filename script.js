const API_URL="https://fakestoreapi.com/products";
let products = [];
let selectedCategory = JSON.parse(localStorage.getItem("selectedCategory")) || [];
let categoriesSet = new Set();
let maxPrice = JSON.parse(localStorage.getItem("maxPrice")) || [];
let minPrice = JSON.parse(localStorage.getItem("minPrice")) || [];
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const fetchProducts = async () =>{
    try{
        const cachedData =localStorage.getItem("products");
        if(cachedData){
            products=JSON.parse(cachedData);
            displayProducts(products)
        }
        const response = await fetch(API_URL);
        const newProducts = await response.json();
        localStorage.setItem("products",JSON.stringify(newProducts));
        products =newProducts;
        products.forEach(product => categoriesSet.add(product.category));

        if (maxPrice.length > 0 || minPrice.length > 0) {
            if (maxPrice.length > 0 && minPrice.length > 0) {
                document.getElementById("max_price").innerHTML = maxPrice;
                document.getElementById("max_price").value = maxPrice;
                document.getElementById("min_price").innerHTML = minPrice;
                document.getElementById("min_price").value = minPrice;

                products = products.filter(product => product.price <= maxPrice && product.price >= minPrice);
            } else if (maxPrice.length > 0) {
                document.getElementById("max_price").innerHTML = maxPrice;
                document.getElementById("max_price").value = maxPrice;

                products = products.filter(product => product.price <= maxPrice);
            } else if (minPrice.length > 0) {
                document.getElementById("min_price").innerHTML = minPrice;
                document.getElementById("min_price").value = minPrice;

                products = products.filter(product => product.price >= minPrice);
                
            }
        }

        displayProducts(products);
        populateCategoryFilter();

    }
    catch (error){
        console.log(error)
    }
}

const displayProducts =(items)=>{
    const productList =document.getElementById("products-list");
    productList.innerHTML="";
    if(items.length ===0){
        productList.innerHTML =" <p>No Products Found</p>";
        return;
    }
    items.forEach(product=>{
        const productCard = document.createElement("div");
        productCard.className="product-card";
        productCard.innerHTML =`
            <img src="${product.image}" alt="${product.title}">
            <h4>${product.title}</h4>
            <p>Price: ${product.price}</p>
            <button onclick="showsimilarProducts(\`${product.category}\`)">Similar Products</button>
            <button onclick="addtoCart(\`${product.id}\`)">add to cart</button>
        `
        productList.appendChild(productCard)
    })
}

const showsimilarProducts = (category)=>{
    selectedCategory =category;
    localStorage.setItem("selectedCategory",JSON.stringify(selectedCategory));
    const similarProducts = products.filter(product => product.category === category);
    displaySimilarProducts(similarProducts);
}

const displaySimilarProducts =(items)=>{
    const similarProducts= document.getElementById("similar-products");
    const similarProducts_title= document.getElementById("similar_products_title");
    similarProducts_title.style.display = "block";
    similarProducts.innerHTML="";
    if(items.length ===0){
        similarProducts.innerHTML="<p>No Similar Products Found</p>";
        return;
    }
    items.forEach(product =>{
        const productCard = document.createElement("div");
        productCard.className="product-card";
        productCard.innerHTML =`
            <img src="${product.image}" alt="${product.title}">
            <h4>${product.title}</h4>
            <p>Price: ${product.price}</p>
        `
        similarProducts.appendChild(productCard)
    })
}

const addtoCart = (productId) => {
    const product = products.find(p => p.id == productId);
    if (product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`Added ${product.title} to cart.`);
    }
}

let debounceTimeout;

const debounceSearch =()=>{
    if(debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(searchProduct,300);
}

const searchProduct = ()=>{
    const query = document.getElementById("search").value.toLowerCase();
    const filteredproducts =products.filter(product =>
    product.title.toLowerCase().includes(query)
    );
    displayProducts(filteredproducts);
}

const filterByCategory = () => {
    selectedCategory = document.getElementById("category-filter").value;
    localStorage.setItem("selectedCategory",JSON.stringify(selectedCategory));
    const filteredProducts = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;
    displayProducts(filteredProducts);
}

const populateCategoryFilter = () => {
    const categoryFilter = document.getElementById("category-filter");
    categoryFilter.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All Categories";
    categoryFilter.appendChild(allOption);
    categoriesSet.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    if (selectedCategory) {
        categoryFilter.value = selectedCategory;
        filterByCategory();
    }
}

const filterByPrice = () => {
    maxPrice = document.getElementById("max_price").value;
    localStorage.setItem("maxPrice",JSON.stringify(maxPrice));
    minPrice = document.getElementById("min_price").value;
    localStorage.setItem("minPrice",JSON.stringify(minPrice));
    products = JSON.parse(localStorage.getItem("products"));
    products.forEach(product => categoriesSet.add(product.category));
    if (maxPrice.length > 0 || minPrice.length > 0) {
        if (maxPrice.length > 0 && minPrice.length > 0) {
            products = products.filter(product => product.price <= maxPrice && product.price >= minPrice);
            products = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;
        } else if (maxPrice.length > 0) {
            products = products.filter(product => product.price <= maxPrice);
            products = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;
        } else if (minPrice.length > 0) {            
            products = products.filter(product => product.price >= minPrice);
            products = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;   
        }
    }
    displayProducts(products);
}

document.addEventListener("DOMContentLoaded",fetchProducts);

document.addEventListener("onchange",filterByCategory);