import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import { removeFromCart, addToCart, getQuantityOfItemInCart, getTotalItemsInCart } from "../../utils/cart";
import "./App.css";
import { calculateTaxesAndFees, calculateTotal } from "../../utils/calculations";

function App() {

  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", dorm_number: "",email: ""});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);


  // Toggles sidebar
  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  // Functions to change state (used for lifting state)
  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  const handleOnCheckout = async () => {
    console.log(cart)
    setIsCheckingOut(true);
    //make a create an orderdata list and then post it first find that data 
    // {6: 2, 7: 1, 8: 1} - cart
    const cartOrderArray = [];
    let subTotal = 0;

    //needed to create an order with the cart items
    for (const productId in cart) {
      // for every product in the cart get the quanity of it
      const quantity = cart[productId];
      // need to get the product from the product list to get the price
      const product = products.find((p) => p.id === parseInt(productId));
      // add it to the thing
      cartOrderArray.push({
        productId: parseInt(productId), 
        quantity: quantity,
        price: product.price
      });

      subTotal += product.price * quantity;
    }
    // call the function from calculations.js
    const total = calculateTotal(subTotal);

    // make a POST request to orders
    const orderData = {
      customer: userInfo.name,
      total: total,
      status: "Confirmed?",
      orderItems: cartOrderArray
    };

    try {
    // send the order to the backend using POST
    const response = await axios.post(`${import.meta.env.VITE_DB_BASE_URL}/orders`, orderData);

    console.log(userInfo);
    // if it worked the save the data and reset the cart
    setOrder(response.data);
    setCart({});
    setUserInfo({ name: "", dorm_number: "", email: ""});
  } catch (err) {
    // handle error response
    setError("Could not complete checkout. Please try again.");
  } finally {
    setIsCheckingOut(false); // Hide loading state
  }
    
    // handle success and error responses
    // reset the cart
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_DB_BASE_URL}/products/`);
        setProducts(res.data);
      } catch (err) {
        setError("Could not fetch products");
      } finally {
        setIsFetching(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
          <SubNavbar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchInputValue={searchInputValue}
            handleOnSearchInputChange={handleOnSearchInputChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  error={error}
                  products={products}
                  isFetching={isFetching}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  addToCart={handleOnAddToCart}
                  searchInputValue={searchInputValue}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
 