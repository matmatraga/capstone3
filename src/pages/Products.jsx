import React, { useState, useEffect, useContext } from 'react';
import AdminView from '../components/AdminView';
import CustomerView from '../components/CustomerView';
import { Container } from 'react-bootstrap';

import UserContext from '../context/UserContext';

export default function Products(){

	const { user } = useContext(UserContext)

	const [ products, setProducts ] = useState([]);

	const fetchData = () => {
		fetch(`${ import.meta.env.VITE_API_URL}/products/all`)
		.then(res => res.json())
		.then(data => {
			setProducts(data);
		})
	};

	useEffect(() => {
		fetchData();
	}, []);

	return(
		<Container>
			{
				user.isAdmin === true ?
					<AdminView fetchData={fetchData}/>
				:
					<CustomerView/>
			}
		</Container>
	)
}
