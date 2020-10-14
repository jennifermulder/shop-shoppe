import React, { useEffect } from 'react';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';

import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { idbPromise } from "../../utils/helpers";

const Cart = () => {

  //use useStoreContext cutom Hook to establish a state variable and the dispatch function to update the state.
  //dispatch will call the toggle cart action
  const [state, dispatch] = useStoreContext();

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      //return array of itmes from indexedDB
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    };
    //check if there is anything in the cart
    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, dispatch]);

  console.log(state)
  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span
          role="img"
          aria-label="trash">🛒</span>
      </div>
    );
  }

  //toggle on cartOpen value when [close] text is clicked
  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>[close]</div>
      <h2>Shopping Cart</h2>
      {state.cart.length ? (
        <div>
          {state.cart.map(item => (
            <CartItem key={item._id} item={item} />
          ))}
          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>
            {
              Auth.loggedIn() ?
                <button>
                  Checkout
            </button>
                :
                <span>(log in to check out)</span>
            }
          </div>
        </div>
      ) : (
          <h3>
            <span role="img" aria-label="shocked">
              😱
      </span>
      You haven't added anything to your cart yet!
          </h3>
        )}
    </div>
  );
};

export default Cart;