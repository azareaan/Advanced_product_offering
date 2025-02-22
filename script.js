const API_URL="https://fakestoreapi.com/products";
let products = [];
let selectedCategory=null;
const fetchProducts = async () =>
{
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
 displayProducts(products)
 }
 catch (error){
 console.log(error)
 }
}
const displayProducts =(items)=>
{
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
const showsimilarProducts = (category)=>
{
 selectedCategory =category;
 const similarProducts = products.filter(product => product.category === category);
 displaySimilarProducts(similarProducts);
}
const displaySimilarProducts =(items)=>
{
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
const debounceSearch =()=>
{
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
document.addEventListener("DOMContentLoaded",fetchProducts);


const filterByCategory = () => {}
document.addEventListener("onchange",filterByCategory);