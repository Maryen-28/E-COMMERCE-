// State Management
const state = {
  currentUser: null,
  currentPage: 'login',
  products: [],
  cart: [],
  favorites: [],
  orders: [],
  selectedCategory: 'all',
  selectedProduct: null
};

// Sample Data
const sampleProducts = [
  { id: 1, name: 'Classic Leather Sneakers', category: 'shoes', price: 89.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', stock: 15, sizes: ['7', '8', '9', '10', '11'], new: true },
  { id: 2, name: 'Running Shoes Pro', category: 'shoes', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 8, sizes: ['7', '8', '9', '10', '11'] },
  { id: 3, name: 'Canvas Backpack', category: 'bags', price: 59.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', stock: 20, new: true },
  { id: 4, name: 'Leather Messenger Bag', category: 'bags', price: 149.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', stock: 5 },
  { id: 5, name: 'Cotton T-Shirt', category: 'clothes', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', stock: 0, sizes: ['S', 'M', 'L', 'XL'] },
  { id: 6, name: 'Denim Jacket', category: 'clothes', price: 89.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', stock: 12, sizes: ['S', 'M', 'L', 'XL'], sale: true },
  { id: 7, name: 'Luxury Watch Gold', category: 'watches', price: 299.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', stock: 3 },
  { id: 8, name: 'Smart Watch Pro', category: 'watches', price: 199.99, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400', stock: 10, new: true }
];

const users = [
  { email: 'customer@shop.com', password: 'customer123', role: 'customer', name: 'John Doe', loyaltyPoints: 150 },
  { email: 'staff@shop.com', password: 'staff123', role: 'staff', name: 'Jane Smith' },
  { email: 'admin@shop.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'rider@shop.com', password: 'rider123', role: 'rider', name: 'Mike Rider' }
];

const promoCodes = {
  'FIRST20': { type: 'percentage', value: 20, description: '20% off your order' },
  'FIRST50': { type: 'fixed', value: 50, description: '₱50 off your order' }
};

// Initialize
function init() {
  state.products = sampleProducts;
  loadFromStorage();
  render();
  
  // Auto-progress orders
  setInterval(autoProgressOrders, 30000);
}

// Storage
function loadFromStorage() {
  const stored = localStorage.getItem('shopHubData');
  if (stored) {
    const data = JSON.parse(stored);
    state.cart = data.cart || [];
    state.favorites = data.favorites || [];
    state.orders = data.orders || [];
  }
}

function saveToStorage() {
  localStorage.setItem('shopHubData', JSON.stringify({
    cart: state.cart,
    favorites: state.favorites,
    orders: state.orders
  }));
}

// Render
function render() {
  const app = document.getElementById('app');
  
  switch(state.currentPage) {
    case 'login':
      app.innerHTML = renderLogin();
      break;
    case 'home':
      app.innerHTML = renderHome();
      break;
    case 'products':
      app.innerHTML = renderProducts();
      break;
    case 'favorites':
      app.innerHTML = renderFavorites();
      break;
    case 'cart':
      app.innerHTML = renderCart();
      break;
    case 'checkout':
      app.innerHTML = renderCheckout();
      break;
    case 'orders':
      app.innerHTML = renderOrders();
      break;
    case 'tracking':
      app.innerHTML = renderTracking();
      break;
    case 'dashboard':
      app.innerHTML = renderDashboard();
      break;
    case 'about':
      app.innerHTML = renderAbout();
      break;
  }
  
  attachEventListeners();
}

// Login Page
function renderLogin() {
  return `
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h1>ShopHub</h1>
          <p>Welcome back! Please login to continue</p>
        </div>
        
        <div class="role-selector">
          <button class="role-btn active" data-role="customer">Customer</button>
          <button class="role-btn" data-role="staff">Staff</button>
          <button class="role-btn" data-role="admin">Admin</button>
          <button class="role-btn" data-role="rider">Rider</button>
        </div>
        
        <form id="loginForm">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" required placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" required placeholder="Enter your password">
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
        </form>
        
        <div class="login-footer">
          <p>Demo Credentials:</p>
          <p><strong>Customer:</strong> customer@shop.com / customer123</p>
          <p><strong>Staff:</strong> staff@shop.com / staff123</p>
          <p><strong>Admin:</strong> admin@shop.com / admin123</p>
          <p><strong>Rider:</strong> rider@shop.com / rider123</p>
        </div>
      </div>
    </div>
  `;
}

// Header
function renderHeader() {
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoriteCount = state.favorites.length;
  
  return `
    <header class="header">
      <nav class="nav container">
        <a href="#" class="logo" onclick="navigateTo('home')">ShopHub</a>
        
        <ul class="nav-links">
          <li><a href="#" onclick="navigateTo('home')">Home</a></li>
          <li><a href="#" onclick="navigateTo('products')">Shop</a></li>
          <li><a href="#" onclick="navigateTo('favorites')">Favorites</a></li>
          <li><a href="#" onclick="navigateTo('orders')">Orders</a></li>
          <li><a href="#" onclick="navigateTo('about')">About</a></li>
          ${state.currentUser?.role === 'admin' ? '<li><a href="#" onclick="navigateTo(\'dashboard\')">Dashboard</a></li>' : ''}
        </ul>
        
        <div class="nav-icons">
          <button class="icon-btn" onclick="navigateTo('favorites')">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            ${favoriteCount > 0 ? `<span class="badge">${favoriteCount}</span>` : ''}
          </button>
          
          <button class="icon-btn" onclick="toggleCart()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            ${cartCount > 0 ? `<span class="badge">${cartCount}</span>` : ''}
          </button>
          
          <button class="icon-btn" onclick="logout()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  `;
}

// Home Page
function renderHome() {
  return `
    ${renderHeader()}
    
    <section class="hero">
      <div class="container">
        <h1>Discover Your Perfect Style</h1>
        <p>Shop premium shoes, bags, clothes, and watches with real-time tracking</p>
        <button class="btn btn-primary" onclick="navigateTo('products')">Shop Now</button>
      </div>
    </section>
    
    <section class="categories">
      <div class="container">
        <h2 class="section-title">Shop by Category</h2>
        <div class="category-grid">
          ${renderCategories()}
        </div>
      </div>
    </section>
    
    ${renderCartSidebar()}
  `;
}

function renderCategories() {
  const categories = [
    { id: 'shoes', name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
    { id: 'bags', name: 'Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
    { id: 'clothes', name: 'Clothes', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { id: 'watches', name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }
  ];
  
  return categories.map(cat => `
    <div class="category-card" onclick="filterByCategory('${cat.id}')">
      <img src="${cat.image}" alt="${cat.name}" class="category-image">
      <div class="category-info">
        <h3>${cat.name}</h3>
      </div>
    </div>
  `).join('');
}

// Products Page
function renderProducts() {
  const filteredProducts = state.selectedCategory === 'all' 
    ? state.products 
    : state.products.filter(p => p.category === state.selectedCategory);
  
  return `
    ${renderHeader()}
    
    <section class="products">
      <div class="container">
        <h2 class="section-title">Our Products</h2>
        
        <div class="filters">
          <input type="text" class="filter-input" placeholder="Search products..." id="searchInput">
          <select class="filter-select" id="categoryFilter" onchange="handleCategoryFilter(this.value)">
            <option value="all">All Categories</option>
            <option value="shoes">Shoes</option>
            <option value="bags">Bags</option>
            <option value="clothes">Clothes</option>
            <option value="watches">Watches</option>
          </select>
          <select class="filter-select" id="priceFilter">
            <option value="all">All Prices</option>
            <option value="0-50">Under ₱50</option>
            <option value="50-100">₱50 - ₱100</option>
            <option value="100-200">₱100 - ₱200</option>
            <option value="200+">Over ₱200</option>
          </select>
        </div>
        
        <div class="product-grid">
          ${filteredProducts.map(product => renderProductCard(product)).join('')}
        </div>
      </div>
    </section>
    
    ${renderCartSidebar()}
    ${state.selectedProduct ? renderProductModal() : ''}
  `;
}

function renderProductCard(product) {
  const isFavorite = state.favorites.some(f => f.id === product.id);
  const stockStatus = product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'in';
  
  return `
    <div class="product-card">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
          <svg width="20" height="20" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        ${product.sale ? '<div class="product-badge badge-sale">Sale</div>' : ''}
        ${product.new ? '<div class="product-badge badge-new">New</div>' : ''}
        ${product.stock === 0 ? '<div class="product-badge badge-out-of-stock">Out of Stock</div>' : ''}
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">₱${product.price.toFixed(2)}</div>
        <div class="product-stock ${stockStatus}">
          ${product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}
        </div>
        <div class="product-actions">
          <button class="btn btn-primary" onclick="openProductModal(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
            View Details
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProductModal() {
  const product = state.selectedProduct;
  if (!product) return '';
  
  return `
    <div class="modal active" id="productModal">
      <div class="modal-content">
        <button class="modal-close" onclick="closeProductModal()">×</button>
        <div class="product-detail">
          <div>
            <img src="${product.image}" alt="${product.name}" class="product-detail-image">
          </div>
          <div class="product-detail-info">
            <h2>${product.name}</h2>
            <div class="product-detail-price">₱${product.price.toFixed(2)}</div>
            
            ${product.sizes ? `
              <div class="size-selector">
                <h4>Select Size</h4>
                <div class="size-options" id="sizeOptions">
                  ${product.sizes.map(size => `
                    <button class="size-option" onclick="selectSize('${size}')">${size}</button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <div class="quantity-selector">
              <h4>Quantity</h4>
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                <span class="quantity-value" id="quantityValue">1</span>
                <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
              </div>
            </div>
            
            <div class="special-instructions">
              <h4>Special Instructions (Optional)</h4>
              <textarea id="specialInstructions" placeholder="Add any special requests..."></textarea>
            </div>
            
            <button class="btn btn-primary" onclick="addToCartFromModal()" style="width: 100%; margin-top: 20px;">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Cart Sidebar
function renderCartSidebar() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;
  const loyaltyPoints = Math.floor(total);
  
  return `
    <aside class="cart-sidebar" id="cartSidebar">
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="modal-close" onclick="toggleCart()">×</button>
      </div>
      
      <div class="cart-items">
        ${state.cart.length === 0 ? '<p style="text-align: center; color: var(--gray-600);">Your cart is empty</p>' : 
          state.cart.map(item => `
            <div class="cart-item">
              <img src="${item.image}" alt="${item.name}" class="cart-item-image">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">
                  ${item.size ? `Size: ${item.size}` : ''}
                  ${item.instructions ? `<br>${item.instructions}` : ''}
                </div>
                <div class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                  <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                  <span>${item.quantity}</span>
                  <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                  <button class="btn-sm btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
              </div>
            </div>
          `).join('')
        }
      </div>
      
      ${state.cart.length > 0 ? `
        <div class="cart-summary">
          <div class="loyalty-points">
            <span>Loyalty Points</span>
            <strong>+${loyaltyPoints} points</strong>
          </div>
          
          <div class="promo-code">
            <h4>Promo Code</h4>
            <div class="promo-input-group">
              <input type="text" id="promoInput" placeholder="Enter code">
              <button class="btn btn-secondary btn-sm" onclick="applyPromo()">Apply</button>
            </div>
          </div>
          
          <div class="summary-row">
            <span>Subtotal</span>
            <span>₱${subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Delivery Fee</span>
            <span>₱${deliveryFee.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Tax</span>
            <span>₱${tax.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>₱${total.toFixed(2)}</span>
          </div>
          
          <button class="btn btn-primary" onclick="navigateTo('checkout')" style="width: 100%; margin-top: 16px;">
            Proceed to Checkout
          </button>
        </div>
      ` : ''}
    </aside>
  `;
}

// Checkout Page
function renderCheckout() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;
  
  return `
    ${renderHeader()}
    
    <div class="checkout-container">
      <h1 class="section-title">Checkout</h1>
      
      <div class="checkout-grid">
        <div>
          <div class="checkout-section">
            <h3>Delivery Zone</h3>
            <div class="delivery-zones">
              <div class="zone-option active" data-zone="zone1">
                <div class="zone-name">Zone 1 - City Center</div>
                <div class="zone-details">₱5 delivery • 30-45 min</div>
              </div>
              <div class="zone-option" data-zone="zone2">
                <div class="zone-name">Zone 2 - Suburbs</div>
                <div class="zone-details">₱10 delivery • 45-60 min</div>
              </div>
              <div class="zone-option" data-zone="zone3">
                <div class="zone-name">Zone 3 - Outskirts</div>
                <div class="zone-details">₱15 delivery • 60-90 min</div>
              </div>
            </div>
          </div>
          
          <div class="checkout-section">
            <h3>Delivery Schedule</h3>
            <div class="delivery-schedule">
              <div class="schedule-option active">
                <input type="radio" name="schedule" value="asap" checked>
                <span>ASAP (30-45 min)</span>
              </div>
              <div class="schedule-option">
                <input type="radio" name="schedule" value="1-3">
                <span>1-3 hours</span>
              </div>
              <div class="schedule-option">
                <input type="radio" name="schedule" value="tomorrow">
                <span>Tomorrow morning</span>
              </div>
            </div>
          </div>
          
          <div class="checkout-section">
            <h3>Delivery Address</h3>
            <div class="form-group">
              <label>Full Address</label>
              <textarea class="filter-input" rows="3" placeholder="Enter your complete address"></textarea>
            </div>
            <div class="form-group">
              <label>Contact Number</label>
              <input type="tel" class="filter-input" placeholder="Enter your phone number">
            </div>
          </div>
        </div>
        
        <div>
          <div class="checkout-section">
            <h3>Order Summary</h3>
            ${state.cart.map(item => `
              <div class="order-item">
                <img src="${item.image}" alt="${item.name}" class="order-item-image">
                <div style="flex: 1;">
                  <div style="font-weight: 600;">${item.name}</div>
                  <div style="font-size: 14px; color: var(--gray-600);">Qty: ${item.quantity}</div>
                  <div style="font-weight: 700; color: var(--primary);">₱${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            `).join('')}
            
            <div style="margin-top: 24px; padding-top: 24px; border-top: 2px solid var(--gray-200);">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>₱${subtotal.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Delivery Fee</span>
                <span>₱${deliveryFee.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Tax</span>
                <span>₱${tax.toFixed(2)}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>₱${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button class="btn btn-primary" onclick="placeOrder()" style="width: 100%; margin-top: 24px;">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Orders Page
function renderOrders() {
  return `
    ${renderHeader()}
    
    <div class="orders-container">
      <h1 class="section-title">Your Orders</h1>
      
      ${state.orders.length === 0 ? 
        '<p style="text-align: center; color: var(--gray-600); padding: 40px;">No orders yet</p>' :
        state.orders.map(order => `
          <div class="order-card">
            <div class="order-header">
              <div>
                <h3>Order #${order.id}</h3>
                <p style="color: var(--gray-600); font-size: 14px;">Placed on ${new Date(order.date).toLocaleDateString()}</p>
              </div>
              <span class="order-status status-${order.status.toLowerCase().replace(' ', '-')}">
                ${order.status}
              </span>
            </div>
            
            <div class="order-items">
              ${order.items.map(item => `
                <div class="order-item">
                  <img src="${item.image}" alt="${item.name}" class="order-item-image">
                  <div style="flex: 1;">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 14px; color: var(--gray-600);">Qty: ${item.quantity}</div>
                    <div style="font-weight: 700; color: var(--primary); margin-top: 4px;">₱${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="order-actions">
              <button class="btn btn-primary btn-sm" onclick="reorder(${order.id})">Reorder</button>
              <button class="btn btn-secondary btn-sm" onclick="trackOrder(${order.id})">Track Order</button>
            </div>
          </div>
        `).join('')
      }
    </div>
  `;
}

// Order Tracking
function renderTracking() {
  const order = state.orders.find(o => o.id === state.trackingOrderId);
  if (!order) return renderOrders();
  
  const stages = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStageIndex = stages.indexOf(order.status);
  const progress = ((currentStageIndex + 1) / stages.length) * 100;
  
  return `
    ${renderHeader()}
    
    <div class="tracking-container">
      <h1 class="section-title">Track Your Order</h1>
      
      <div class="tracking-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h2>Order #${order.id}</h2>
            <p style="color: var(--gray-600);">Estimated delivery: ${order.estimatedDelivery}</p>
          </div>
          <span class="order-status status-${order.status.toLowerCase().replace(' ', '-')}">
            ${order.status}
          </span>
        </div>
        
        <div class="tracking-progress">
          <div class="progress-steps">
            <div class="progress-line">
              <div class="progress-line-fill" style="width: ${progress}%"></div>
            </div>
            
            ${stages.  map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isActive = index === currentStageIndex;
              
              return `
                <div class="progress-step">
                  <div class="step-icon ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                    ${isCompleted ? '✓' : index + 1}
                  </div>
                  <div class="step-label">${stage}</div>
                  <div class="step-time">${order.timeline[stage] || 'Pending'}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div style="margin-top: 40px;">
          <h3 style="margin-bottom: 16px;">Order Items</h3>
          ${order.items.map(item => `
            <div class="order-item">
              <img src="${item.image}" alt="${item.name}" class="order-item-image">
              <div style="flex: 1;">
                <div style="font-weight: 600;">${item.name}</div>
                <div style="font-size: 14px; color: var(--gray-600);">Qty: ${item.quantity}</div>
                <div style="font-weight: 700; color: var(--primary); margin-top: 4px;">₱${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <button class="btn btn-secondary" onclick="navigateTo('orders')" style="margin-top: 24px;">
          Back to Orders
        </button>
      </div>
    </div>
  `;
}

// Favorites Page
function renderFavorites() {
  return `
    ${renderHeader()}
    
    <section class="products">
      <div class="container">
        <h2 class="section-title">Your Favorites</h2>
        
        ${state.favorites.length === 0 ? 
          '<p style="text-align: center; color: var(--gray-600); padding: 40px;">No favorites yet</p>' :
          `<div class="product-grid">
            ${state.favorites.map(product => renderProductCard(product)).join('')}
          </div>`
        }
      </div>
    </section>
    
    ${renderCartSidebar()}
    ${state.selectedProduct ? renderProductModal() : ''}
  `;
}

// Admin Dashboard
function renderDashboard() {
  const totalSales = state.orders.reduce((sum, order) => sum + order.total, 0);
  const todaySales = state.orders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.date).toDateString() === today;
  }).reduce((sum, order) => sum + order.total, 0);
  
  const activeCustomers = new Set(state.orders.map(o => o.customerId)).size;
  const avgOrderValue = state.orders.length > 0 ? totalSales / state.orders.length : 0;
  
  return `
    ${renderHeader()}
    
    <div class="dashboard">
      <div class="container">
        <div class="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, ${state.currentUser.name}</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Today's Sales</div>
            <div class="stat-value">₱${todaySales.toFixed(2)}</div>
            <div class="stat-change positive">+12.5% from yesterday</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">${state.orders.length}</div>
            <div class="stat-change positive">+8 new orders</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Active Customers</div>
            <div class="stat-value">${activeCustomers}</div>
            <div class="stat-change positive">+3 this week</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Average Order Value</div>
            <div class="stat-value">₱${avgOrderValue.toFixed(2)}</div>
            <div class="stat-change negative">-2.3% from last month</div>
          </div>
        </div>
        
        <div class="dashboard-section">
          <h2>Sales Analytics</h2>
          <div class="chart-container">
            <canvas id="salesChart"></canvas>
          </div>
        </div>
        
        <div class="dashboard-section">
          <h2>Recent Orders</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.orders.slice(0, 10).map(order => `
                <tr>
                  <td>#${order.id}</td>
                  <td>Customer ${order.customerId}</td>
                  <td>${new Date(order.date).toLocaleDateString()}</td>
                  <td>₱${order.total.toFixed(2)}</td>
                  <td><span class="order-status status-${order.status.toLowerCase().replace(' ', '-')}">${order.status}</span></td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-secondary" onclick="updateOrderStatus(${order.id})">Update Status</button>
                      <button class="btn btn-sm btn-outline" onclick="viewOrderDetails(${order.id})">View</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="dashboard-section">
          <h2>Inventory Management</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.products.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.category}</td>
                  <td>₱${product.price.toFixed(2)}</td>
                  <td>
                    <span class="product-stock ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : ''}">
                      ${product.stock} units
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-secondary" onclick="restockProduct(${product.id})">Restock</button>
                      <button class="btn btn-sm btn-outline" onclick="editProduct(${product.id})">Edit</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// About Page
function renderAbout() {
  return `
    ${renderHeader()}
    
    <section class="about-section">
      <div class="about-content">
        <h2>About ShopHub</h2>
        <p>
          Welcome to ShopHub, your premier destination for quality shoes, bags, clothes, and watches. 
          We believe in delivering not just products, but exceptional experiences that make online shopping 
          seamless, transparent, and rewarding.
        </p>
        <p>
          Founded with a passion for quality and customer satisfaction, we've built a platform that combines 
          the best of modern e-commerce with personalized service. Every item in our collection is carefully 
          selected to meet our high standards of quality and craftsmanship.
        </p>
      </div>
      
      <div class="container">
        <div class="mission-vision">
          <div class="mission-card">
            <h3>Our Mission</h3>
            <p>
              To provide our customers with premium quality products and an exceptional shopping experience 
              through innovative technology, real-time order tracking, and personalized service. We strive 
              to make every purchase memorable and every delivery seamless.
            </p>
          </div>
          
          <div class="vision-card">
            <h3>Our Vision</h3>
            <p>
              To become the most trusted and customer-centric e-commerce platform, setting new standards 
              in online retail through transparency, quality, and innovation. We envision a future where 
              shopping is not just convenient, but truly delightful.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Event Handlers
function attachEventListeners() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    
    // Role selector
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  
  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  // Zone options
  document.querySelectorAll('.zone-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.zone-option').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Schedule options
  document.querySelectorAll('.schedule-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.schedule-option').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      this.querySelector('input').checked = true;
    });
  });
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const selectedRole = document.querySelector('.role-btn.active').dataset.role;
  
  const user = users.find(u => u.email === email && u.password === password && u.role === selectedRole);
  
  if (user) {
    state.currentUser = user;
    
    if (user.role === 'admin') {
      state.currentPage = 'dashboard';
    } else if (user.role === 'rider') {
      state.currentPage = 'orders';
    } else {
      state.currentPage = 'home';
    }
    
    showNotification('Login successful!', 'success');
    render();
  } else {
    showNotification('Invalid credentials. Please try again.', 'error');
  }
}

function logout() {
  state.currentUser = null;
  state.currentPage = 'login';
  render();
  showNotification('Logged out successfully', 'success');
}

function navigateTo(page) {
  state.currentPage = page;
  render();
  window.scrollTo(0, 0);
}

function filterByCategory(category) {
  state.selectedCategory = category;
  navigateTo('products');
}

function handleCategoryFilter(value) {
  state.selectedCategory = value;
  render();
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const products = document.querySelectorAll('.product-card');
  
  products.forEach(card => {
    const name = card.querySelector('.product-name').textContent.toLowerCase();
    if (name.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function toggleFavorite(productId) {
  const product = state.products.find(p => p.id === productId);
  const index = state.favorites.findIndex(f => f.id === productId);
  
  if (index > -1) {
    state.favorites.splice(index, 1);
    showNotification('Removed from favorites', 'success');
  } else {
    state.favorites.push(product);
    showNotification('Added to favorites', 'success');
  }
  
  saveToStorage();
  render();
}

function openProductModal(productId) {
  state.selectedProduct = state.products.find(p => p.id === productId);
  render();
}

function closeProductModal() {
  state.selectedProduct = null;
  render();
}

let selectedSize = null;
let modalQuantity = 1;

function selectSize(size) {
  selectedSize = size;
  document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
  event.target.classList.add('active');
}

function changeQuantity(delta) {
  modalQuantity = Math.max(1, modalQuantity + delta);
  document.getElementById('quantityValue').textContent = modalQuantity;
}

function addToCartFromModal() {
  const product = state.selectedProduct;
  const instructions = document.getElementById('specialInstructions').value;
  
  if (product.sizes && !selectedSize) {
    showNotification('Please select a size', 'warning');
    return;
  }
  
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: modalQuantity,
    size: selectedSize,
    instructions: instructions
  };
  
  const existingIndex = state.cart.findIndex(item => 
    item.id === product.id && item.size === selectedSize
  );
  
  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += modalQuantity;
  } else {
    state.cart.push(cartItem);
  }
  
  saveToStorage();
  showNotification('Added to cart!', 'success');
  closeProductModal();
  
  // Reset
  selectedSize = null;
  modalQuantity = 1;
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  sidebar.classList.toggle('active');
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    saveToStorage();
    render();
  }
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveToStorage();
  showNotification('Item removed from cart', 'success');
  render();
}

function applyPromo() {
  const code = document.getElementById('promoInput').value.toUpperCase();
  const promo = promoCodes[code];
  
  if (promo) {
    showNotification(`Promo applied: ${promo.description}`, 'success');
  } else {
    showNotification('Invalid promo code', 'error');
  }
}

function placeOrder() {
  if (state.cart.length === 0) {
    showNotification('Your cart is empty', 'warning');
    return;
  }
  
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;
  
  const order = {
    id: Date.now(),
    customerId: state.currentUser.email,
    items: [...state.cart],
    total: total,
    status: 'Confirmed',
    date: new Date().toISOString(),
    estimatedDelivery: 'Today, 3:00 PM - 5:00 PM',
    timeline: {
      'Confirmed': new Date().toLocaleTimeString()
    }
  };
  
  state.orders.unshift(order);
  state.cart = [];
  
  // Update loyalty points
  if (state.currentUser.loyaltyPoints !== undefined) {
    state.currentUser.loyaltyPoints += Math.floor(total);
  }
  
  saveToStorage();
  showNotification('Order placed successfully!', 'success');
  navigateTo('orders');
}

function reorder(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (order) {
    state.cart = order.items.map(item => ({...item}));
    saveToStorage();
    showNotification('Items added to cart', 'success');
    toggleCart();
  }
}

function trackOrder(orderId) {
  state.trackingOrderId = orderId;
  navigateTo('tracking');
}

function updateOrderStatus(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  
  const stages = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentIndex = stages.indexOf(order.status);
  
  if (currentIndex < stages.length - 1) {
    order.status = stages[currentIndex + 1];
    order.timeline[order.status] = new Date().toLocaleTimeString();
    saveToStorage();
    showNotification(`Order status updated to ${order.status}`, 'success');
    render();
  }
}

function viewOrderDetails(orderId) {
  state.trackingOrderId = orderId;
  navigateTo('tracking');
}

function restockProduct(productId) {
  const product = state.products.find(p => p.id === productId);
  if (product) {
    product.stock = 50;
    showNotification(`${product.name} restocked to 50 units`, 'success');
    render();
  }
}

function editProduct(productId) {
  showNotification('Edit product feature coming soon', 'warning');
}

function autoProgressOrders() {
  const stages = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  
  state.orders.forEach(order => {
    const currentIndex = stages.indexOf(order.status);
    if (currentIndex < stages.length - 1 && Math.random() > 0.7) {
      order.status = stages[currentIndex + 1];
      order.timeline[order.status] = new Date().toLocaleTimeString();
    }
  });
  
  saveToStorage();
  if (state.currentPage === 'tracking' || state.currentPage === 'orders' || state.currentPage === 'dashboard') {
    render();
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' : 
        type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' :
        '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'}
    </svg>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize app
init();
