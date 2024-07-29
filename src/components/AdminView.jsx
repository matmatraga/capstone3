import React, { useEffect, useState, useContext } from 'react';
import { Form, Table, Button, Modal, Accordion, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import UserContext from '../context/UserContext';

import { Notyf } from 'notyf';
export default function AdminView(){

	const notyf = new Notyf();
	const { user } = useContext(UserContext);

	const [products, setProducts] = useState([]);
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [showAdd, setShowAdd] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [toggle, setToggle] = useState(false);
	const [ordersList, setOrdersList] = useState([]);

	const openAdd = () => setShowAdd(true);
	const closeAdd = () => setShowAdd(false);

	const openEdit = (productId) => {

		setId(productId);

		fetch(`${ import.meta.env.VITE_API_URL }/products/${ productId }`)
		.then(res => res.json())
		.then(data => {
			setName(data.name);
			setDescription(data.description);
			setPrice(data.price);
		});

		setShowEdit(true);

	};

	const closeEdit = () => {

		setName("");
		setDescription("");
		setPrice(0);
		setShowEdit(false);

	};

	const addProduct = (e) => {

		e.preventDefault();

		fetch(`${import.meta.env.VITE_API_URL}/products`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price
			})
		})
		.then(res => res.json())
		.then(data => {

			if (data) {
				
				setName("");
				setDescription("");
				setPrice(0);

				notyf.success("Added Product Successfully")
				closeAdd();

			} else {
				notyf.error("Error. Add Product Unsuccessful")
				closeAdd();

			}

		});

	};

	const editProduct = (e, productId) => {

		e.preventDefault();

		fetch(`${import.meta.env.VITE_API_URL}/products/${ productId }`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${ localStorage.getItem('token') }`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price
			})

		})
		.then(res => res.json())
		.then(data => {

			if (data.message === 'Product updated successfully') {
				
				setName("");
				setDescription("");
				setPrice(0);

				notyf.success("Prouct Updated")
				closeEdit();

			} else {
				notyf.error("Prouct Update Unsuccessful")
				closeEdit();

			}

		});

	};


	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/orders/all-orders`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		.then((res) => res.json())
		.then((data) => {
		// console.log(data);

			let ordersArray = [];

			if (data && data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
				ordersArray = data.orders;
			} else if (data && data.order) {
        // If there is a single order, create an array with that order
				ordersArray = [data.order];
			} else {
				console.error('Invalid or empty JSON data in response:', data);
			}

			const allOrders = ordersArray.map((order, index) => {
				return (

					<Card key={order._id}>
						<Card.Header className='bg-secondary text-light'>
							Orders for user <span className="text-warning">{order.userId}</span>
						</Card.Header>
						<Card.Body>
							<h6>Items:</h6>
							<ul>

							{
								order.productsOrdered.length > 0 ? 
								(
									order.productsOrdered.map((product) => (
									<div key={product._id}>
										<h6>Purchased on {moment(order.orderedOn).format("MM-DD-YYYY")}:</h6>
										<ul>
											<li>
												{product.productName} - Quantity: {product.quantity}
											</li>
										</ul>
										<hr/>
									</div>
									))
								) : (

									<span>No orders for this user yet.</span>

								)
							}

							</ul>
							<h6>
								Total: <span className="text-warning">₱{order.totalPrice}</span>
							</h6>
						</Card.Body>
					</Card>

						);
			});

			setOrdersList(allOrders);
		})
		.catch((error) => {
			console.error('Error fetching orders:', error);
		});
	}, []);





	const toggler = () => {

		if(toggle === true){
			setToggle(false);
		}else{
			setToggle(true);
		}

	};

	useEffect(() => {

		const activateProduct = (productId) => {

			fetch(`${import.meta.env.VITE_API_URL}/products/${ productId }/activate`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${ localStorage.getItem('token') }`,
				}
			})
			.then(res => res.json())
			.then(data => {
				if (data.message === 'Product activated successfully') {
					notyf.success("Activated Successfully.")
				} else {
					notyf.error("Error. Activate Unsuccessful")
				}

			});

		};

		const archiveProduct = (productId) => {

			fetch(`${import.meta.env.VITE_API_URL}/products/${ productId }/archive`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${ localStorage.getItem('token') }`,
				}
			})
			.then(res => res.json())
			.then(data => {

				if (data.message === 'Product archived successfully') {
					notyf.success("Archived Successfully")
				} else {
					notyf.error("Error. Archive Unsuccessful")
				}

			});

		};


		
		fetch(`${ import.meta.env.VITE_API_URL}/products/all`, {
            headers: { Authorization: `Bearer ${ localStorage.getItem('token') }`}
        })
		.then(res => res.json())
		.then(data => {

			const productsArr = data.map(productData => {
				return (

					<tr key={productData._id}>
					<td>
						{productData.name}
					</td>
					<td>{productData.description}</td>
					<td>{productData.price}</td>
					<td>
						{ productData.isActive ?
								<span className="text-success">Available</span>
							:
								<span className="text-danger">Unavailable</span>
						}
					</td>
					<td>
						<Button 
							variant="primary" 
							size="sm" 
							onClick={() => openEdit(productData._id)}
						>
							Update
						</Button>
						{ productData.isActive ?
								<Button 
									variant="danger"
									size="sm"
									onClick={() => archiveProduct(productData._id)}
								>
									Disable
								</Button>
							:
								<Button
									variant="success"
									size="sm"
									onClick={() => activateProduct(productData._id)}
								>
								 	Enable
								</Button>
						}
					</td>
					</tr>
					)

			})
			setProducts(productsArr);
		})

		

	}, [products])


	return(
		<React.Fragment>
			<div className="text-center my-4">
				<h2>Admin Dashboard</h2>
				<div className="d-flex justify-content-center">
					<Button 
						className="mr-1"
						variant="primary"
						onClick={openAdd}
					>
						Add New Product
					</Button>
					{ toggle === false ? 
						<Button variant="success" onClick={()=> toggler()}>
							Show User Orders
						</Button>
					: 
						<Button variant="danger" onClick={()=> toggler()}>
							Show Product Details
						</Button>
					}
					
				</div>
			</div>
			{ toggle === false ?
				<Table striped bordered hover responsive>
					<thead className="bg-secondary text-white">
						<tr>
							<th>Name</th>
							<th>Description</th>
							<th>Price</th>
							<th>Availability</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products}
					</tbody>						
				</Table>
			:
				<Row>
					<Col>
						{ordersList}
					</Col>
				</Row>
			}

			<Modal show={showAdd} onHide={closeAdd}>
				<Form onSubmit={e => addProduct(e)}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Product</Modal.Title>
					</Modal.Header>
					<Modal.Body>

							<Form.Group controlId="productName">
								<Form.Label>Name:</Form.Label>
								<Form.Control 
									type="text"
									placeholder="Enter product name"
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId="productDescription">
								<Form.Label>Description:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter product description"
									value={description}
									onChange={e => setDescription(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId="productPrice">
								<Form.Label>Price:</Form.Label>
								<Form.Control
									type="number"
									value={price}
									onChange={e => setPrice(e.target.value)}
									required
								/>
							</Form.Group>

					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={closeAdd}>
							Close
						</Button>
						<Button variant="success" type="submit">
							Submit
						</Button>
					</Modal.Footer>

				</Form>	
			</Modal>

			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editProduct(e, id)}>
					<Modal.Header closeButton>
						<Modal.Title>Edit Product</Modal.Title>
					</Modal.Header>
					<Modal.Body>

							<Form.Group controlId="productName">
								<Form.Label>Name:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter product name"
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId="productDescription">
								<Form.Label>Description:</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter product description"
									value={description}
									onChange={e => setDescription(e.target.value)}
									required
								/>
							</Form.Group>

							<Form.Group controlId="productPrice">
								<Form.Label>Price:</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter product price"
									value={price}
									onChange={e => setPrice(e.target.value)}
									required
								/>
							</Form.Group>

					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={closeEdit}>
							Close
						</Button>
						<Button variant="success" type="submit">
							Submit
						</Button>
					</Modal.Footer>
				</Form>	
			</Modal>
		</React.Fragment>
	);
	
}
