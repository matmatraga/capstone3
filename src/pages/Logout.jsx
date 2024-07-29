import React, {useContext, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout(){

	const { setUser } = useContext(UserContext);

	useEffect(()=> {

		localStorage.clear();

		setUser({
			id: null,
			isAdmin: null
		});

	});

	return(
		<Navigate to={{pathname: '/login', state: { from: 'logout'}}}/>
	);
}
