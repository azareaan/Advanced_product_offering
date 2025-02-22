const API_URL="https://fakestoreapi.com/products";
let products = [];
let selectedCategory=null;
let categoriesSet = new Set();

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
        `
        productList.appendChild(productCard)
    })
}

const showsimilarProducts = (category)=>{
    selectedCategory =category;
    const similarProducts = products.filter(product => product.category === category);
    displaySimilarProducts(similarProducts);
}

const displaySimilarProducts =(items)=>{
    const similarProducts= document.getElementById("similar-products");
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
    const category = document.getElementById("category-filter").value;
    const filteredProducts = category ? products.filter(product => product.category === category) : products;
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
}

const filterByPrice = () => {
    const maxPrice = document.getElementById("price-filter").value;
    const filteredProducts = products.filter(product => product.price <= maxPrice);
    displayProducts(filteredProducts);
}

document.addEventListener("DOMContentLoaded",fetchProducts);

document.addEventListener("onchange",filterByCategory);