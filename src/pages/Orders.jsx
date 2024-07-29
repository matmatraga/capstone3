import React, { useState, useEffect } from 'react';
import { Container, Card, Accordion, Row,Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function Orders(){

	const [ordersList, setOrdersList] = useState([]);

	useEffect(()=> {

		fetch(`${ import.meta.env.VITE_API_URL}/orders/my-orders`, {
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			const { orders } = data;

			console.log(orders)

			
			const myOrders = orders.map((item, index) => {
				return(
					<Card key={item._id}>
						<Card.Header className='bg-secondary text-light'>
							Order #{index + 1} - Purchased on: {moment(item.purchasedOn).format("MM-DD-YYYY")}
						</Card.Header>
						<Card.Body>
							<h6>Items:</h6>
							<ul>

							{
								item.productsOrdered.map((subitem) => {

								fetch(`${ import.meta.env.VITE_API_URL}/products/${subitem.productId}`)
								.then(res => res.json())
								.then(data => {});

								return (
									<li key={subitem._id}>
										{subitem.productName} - Quantity: {subitem.quantity}
									</li>
								);

								})

							}

							</ul>
							<h6>
								Total: <span className="text-warning">₱{item.totalPrice}</span>
							</h6>
						</Card.Body>
					</Card>

					)
			})

			setOrdersList(myOrders)
			
		})

	}, []);



	return(
		ordersList.length === 0 ?
			<Row className='mt-5 pt-5'>
				<Col>
					<h3 className="mt-5 pt-5 text-center">
					No orders placed yet! <Link to="/products">Start shopping.</Link>
					</h3>
				</Col>
			</Row>
		:
		<Container>
			<h2 className="text-center my-4">Order History</h2>
			<Accordion>
				{ordersList}
			</Accordion>
		</Container>
	)
}
