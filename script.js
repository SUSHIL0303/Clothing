const products = [
  {id:1,name:"Everyday Oversized Tee",category:"Men",price:899,tag:"Bestseller",color:"Washed black",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"},
  {id:2,name:"Relaxed Fit Hoodie",category:"Men",price:1799,tag:"New",color:"Stone grey",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85"},
  {id:3,name:"Ribbed Everyday Top",category:"Women",price:999,tag:"New",color:"Soft cream",image:"https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=85"},
  {id:4,name:"Relaxed Cargo Pants",category:"Women",price:1599,tag:"Popular",color:"Olive",image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85"},
  {id:5,name:"Classic Street Shirt",category:"Men",price:1299,tag:"",color:"Off white",image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=85"},
  {id:6,name:"Minimal Co-ord Set",category:"Women",price:2199,tag:"New",color:"Sand",image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85"},
  {id:7,name:"Graphic Back Tee",category:"Men",price:1099,tag:"Limited",color:"Charcoal",image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=85"},
  {id:8,name:"Soft Knit Cardigan",category:"Women",price:1899,tag:"",color:"Mocha",image:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=85"}
];

let activeFilter = "All";
let cart = JSON.parse(localStorage.getItem("forme-cart") || "[]");
const grid = document.getElementById("productGrid");
const money = value => "₹" + value.toLocaleString("en-IN");

function renderProducts(){
  let visible = products.filter(p => activeFilter === "All" || p.category === activeFilter);
  const sort = document.getElementById("sortSelect").value;
  if(sort === "low") visible.sort((a,b)=>a.price-b.price);
  if(sort === "high") visible.sort((a,b)=>b.price-a.price);
  grid.innerHTML = visible.length ? visible.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <button class="quick-add" data-add="${p.id}">Add to bag +</button>
      </div>
      <div class="product-info"><h3>${p.name}</h3><p>${money(p.price)}</p></div>
      <p class="product-meta">${p.category} · ${p.color}</p>
    </article>`).join("") : '<p class="no-results">No products in this category yet.</p>';
}
function saveCart(){localStorage.setItem("forme-cart",JSON.stringify(cart));renderCart()}
function addToCart(id){
  const found=cart.find(item=>item.id===id);
  if(found) found.qty++; else cart.push({id,qty:1});
  saveCart(); showToast("Added to your bag");
}
function changeQty(id,delta){
  const item=cart.find(i=>i.id===id); if(!item)return;
  item.qty+=delta; if(item.qty<=0)cart=cart.filter(i=>i.id!==id);
  saveCart();
}
function renderCart(){
  const count=cart.reduce((sum,i)=>sum+i.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("cartTitleCount").textContent=`(${count})`;
  const items=cart.map(i=>({...i,product:products.find(p=>p.id===i.id)})).filter(i=>i.product);
  document.getElementById("cartItems").innerHTML=items.length?items.map(i=>`
    <div class="cart-item"><img src="${i.product.image}" alt="${i.product.name}">
      <div><h3>${i.product.name}</h3><p>${money(i.product.price)}</p>
        <div class="quantity-controls"><button data-qty="${i.id}" data-delta="-1">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-delta="1">+</button></div>
      </div><button class="remove-item" data-remove="${i.id}">REMOVE</button>
    </div>`).join(""):'<p class="empty-cart">Your bag is looking a little empty.</p>';
  document.getElementById("cartSubtotal").textContent=money(items.reduce((s,i)=>s+i.product.price*i.qty,0));
}
function showToast(message){
  const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),1900);
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartOverlay").classList.add("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartOverlay").classList.remove("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true")}

document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add)addToCart(Number(add.dataset.add));
  const qty=e.target.closest("[data-qty]"); if(qty)changeQty(Number(qty.dataset.qty),Number(qty.dataset.delta));
  const remove=e.target.closest("[data-remove]"); if(remove){cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));saveCart()}
  const filter=e.target.closest("[data-filter]"); if(filter){activeFilter=filter.dataset.filter;document.querySelectorAll(".filter-btn").forEach(b=>b.classList.toggle("active",b===filter));renderProducts()}
  const category=e.target.closest("[data-category-link],[data-nav-filter]"); if(category){activeFilter=category.dataset.categoryLink||category.dataset.navFilter;document.querySelectorAll(".filter-btn").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));renderProducts()}
});
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.getElementById("cartOpen").addEventListener("click",openCart);
document.getElementById("cartClose").addEventListener("click",closeCart);
document.getElementById("cartOverlay").addEventListener("click",closeCart);
document.getElementById("showAll").addEventListener("click",()=>{activeFilter="All";document.querySelectorAll(".filter-btn").forEach(b=>b.classList.toggle("active",b.dataset.filter==="All"));renderProducts()});
document.getElementById("checkoutBtn").addEventListener("click",()=>showToast(cart.length?"Connect a checkout/payment service to accept orders.":"Your bag is empty."));
document.getElementById("menuToggle").addEventListener("click",()=>document.querySelector(".desktop-nav").classList.toggle("open"));
document.querySelectorAll(".desktop-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".desktop-nav").classList.remove("open")));
renderProducts();renderCart();
