import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({data}){

	const { title, content, destination, label } = data;
	
	return(
		<Row>
			<Col className="text-center mx-auto p-5 mt-5" md={6}>
				<h1>{title}</h1>
				<p id="motto">{content}</p>
				<Link className="btn btn-primary" to={destination}>
					{label}
				</Link>
			</Col>
		</Row>
	);
	
}
