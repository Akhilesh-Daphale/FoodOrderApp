import { useReducer } from "react";
import CartContext from "./cart-context";


const defaultCartState = {
    items: [],
    totalAmount: 0
}

const cartReducer = (prevState, action) => {
    if(action.type === "ADD_ITEM") {
        const updatedTotalAmount = prevState.totalAmount + action.item.price * action.item.amount;
        const existingCartItemIndex = prevState.items.findIndex(item => item.id === action.item.id);
        const existingCartItem = prevState.items[existingCartItemIndex];
        let updatedItems;

        // If the item exists the update the amount else add the whole item
        if(existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                amount: existingCartItem.amount + action.item.amount
            }
            updatedItems = [...prevState.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            // same as push but returns a new array
            updatedItems = prevState.items.concat(action.item)  
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }
    }

    if(action.type === "REMOVE_ITEM") {
        const existingCartItemIndex = prevState.items.findIndex(item => item.id === action.id);
        const existingCartItem = prevState.items[existingCartItemIndex];
        const updatedTotalAmount = prevState.totalAmount - existingCartItem.price;
        let updatedItems;

        // If the item amount is 1 then remove the item from list else descrement the amount
        if(existingCartItem.amount === 1){
            updatedItems = prevState.items.filter(item => item.id !== action.id);
        } else {
            const updatedItem = {...existingCartItem, amount: existingCartItem.amount - 1};
            updatedItems = [...prevState.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }
    }

    return defaultCartState;
}

export default function CartProvider(props) {

    const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);
    
    const addItemToCartHandler = (item) => {
        dispatchCartAction({type: "ADD_ITEM", item: item})
    }

    const removeItemToCartHandler = (id) => {
        dispatchCartAction({type: "REMOVE_ITEM", id: id})
    }
    
    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemToCartHandler
    }
    
    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    );
}