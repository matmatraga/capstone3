import React, { useState, useEffect } from 'react';
import { Container, InputGroup, Button, FormControl, Table, Row,Col } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
export default function MyCart() {

	const notyf = new Notyf();

	const navigate = useNavigate();

	const [total, setTotal] = useState(0);
	const [cart, setCart] = useState([]);
	const [tableRows, setTableRows] = useState([]);
	const [willRedirect, setWillRedirect] = useState(false);

// ============================================================
	// to render the Updated Cart

	useEffect(() => {
		fetchCart();
	}, []);


	const fetchCart = () => {
	  fetch(`${import.meta.env.VITE_API_URL}/cart/get-cart`, {
	    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
	  })
	    .then(res => {
	      if (!res.ok) {
	        throw new Error(`Failed to fetch cart: ${res.status}`);
	      }
	      return res.text();
	    })
	    .then((data) => {
	      try {
	        const jsonData = data ? JSON.parse(data) : { cartItems: [] };
	        const cartItems = jsonData.cartItems || [];
	        setCart(cartItems);
	      } catch (error) {
	        notyf.error('Error parsing JSON:', error);
	      }
	    })
	    .catch((error) => {
			notyf.error('Error fetching cart:', error);
	    });
	};




// ============================================================

// ============================================================
	// Getting the Cart and set it to table rows
	useEffect(() => {
		setTableRows(
			cart.map((item) => (
				<tr key={item.productId}>
					<td>
						<Link to={`/products/${item.productId}`}>{item.productName}</Link>
					</td>

					<td>₱{item.price}</td>

					<td className='d-flex'>
						<Button variant="secondary" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
							-
						</Button>
						<FormControl
							type="number"
							min="1"
							value={item.quantity}
							onChange={(e) => updateQuantity(item.productId, e.target.value)}
						/>
						<Button variant="secondary" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
							+
						</Button>
					</td>

					<td>₱{item.subtotal}</td>
					
					<td className="text-center">
						<Button variant="danger" onClick={() => removeFromCart(item.productId)}>
						Remove
						</Button>
					</td>
				</tr>
				))
			);

			let tempTotal = 0;
				cart.forEach((item) => {
					tempTotal += item.subtotal;
			});

		setTotal(tempTotal);

	}, [cart]);
// ============================================================


// ============================================================

	//Update the quantity of items in cart
	const updateQuantity = (productId, newQuantity) => {
	  // Make a PUT request to the API endpoint to update the quantity
		fetch(`${import.meta.env.VITE_API_URL}/cart/update-cart-quantity`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				productId,
				newQuantity,
			})
		})
		.then((res) => res.json())
		.then((data) => {
	      // Assuming the API response contains an 'updatedCart' field
			const { updatedCart, message } = data;

	      // Handle the response or perform any necessary actions
			console.log(message);
			notyf.success("Quantity Updated")
	      // After updating the quantity, you may want to fetch the updated cart
			fetchCart();
		})
		.catch((error) => {
	      // Handle the error if necessary
		  notyf.error("Error updating quantity")
		});
	};
// ============================================================



// ============================================================
	const removeFromCart = (productId) => {
		console.log(productId)
		fetch(`${import.meta.env.VITE_API_URL}/cart/${productId}/remove-from-cart`, {
			method: 'PATCH',
			headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Failed to remove item from cart: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			notyf.success("Item removed from cart.")
			fetchCart();
		})
		.catch((error) => {
			notyf.error('Error removing item from cart');
		});
};


// ============================================================




// ============================================================

const checkout = () => {
  // Make a POST request to the API to initiate the checkout process
  fetch(`${import.meta.env.VITE_API_URL}/orders/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then((res) => res.json())
    .then((data) => {
    	console.log(data)
      // Handle the response or perform any necessary actions
      if (data) {
        // Fetch the updated cart after successful checkout
		notyf.success("Order Successful!");
		navigate("/orders")
      } 
    })
    .catch((error) => {
		
		notyf.error('Error during checkout');
    });
};

// ============================================================


const clearCart = () => {
    fetch(`${import.meta.env.VITE_API_URL}/cart/clearCart`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // Handle the response or perform any necessary actions
        if (data.cart) {

          setCart(data.cart.cartItems);
          setTotal(data.cart.totalPrice);
		  notyf.success("Cart Cleared.")

		  fetchCart()

        }
      })
      .catch((error) => {
        // Handle the error if necessary
		notyf.success("Error in clearing cart")
      });
  };


return (
<Container>
	{
		willRedirect === true ? (
			<Navigate to="/orders" />
			) : (
				cart.length <= 0 ? (
					<Row className='mt-5 pt-5'>
						<Col>
							<h3 className="mt-5 pt-5 text-center">
								Your cart is empty! <Link to="/products">Start shopping.</Link>
							</h3>
						</Col>
					</Row>
					) 
				: (
					<Row>
						<Col>
							<h2 className="text-center my-4">Your Shopping Cart</h2>
							
							<Table striped bordered hover responsive>
								<thead className="bg-secondary text-white">
									<tr>
										<th>Name</th>
										<th>Price</th>
										<th>Quantity</th>
										<th>Subtotal</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{tableRows}
									<tr>
										<td colSpan="3">
											<Button variant="success" block onClick={() => checkout()}>
												Checkout
											</Button>
										</td>
			
										<td colSpan="2">
											<h3>Total: ₱{total}</h3>
										</td>
									</tr>
								</tbody>
							</Table>
							<Button variant="danger" block onClick={clearCart}>
								Clear Cart
							</Button>
						</Col>

					</Row>

					
					)
				)

	}
	</Container>
	);
}
