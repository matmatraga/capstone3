import React, { useEffect, useState } from 'react';
import Product from './Product';
import { Row } from 'react-bootstrap';
import ProductSearch from './ProductSearch';

export default function CustomerView() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch(`${import.meta.env.VITE_API_URL}/products/active`, {
      mode: 'no-cors'
    })
      .then((res) => res.json())
      .then((productsData) => {
        if (isMounted) {
          const productsArr = productsData.map((productData) =>
            productData.isActive === true ? (
              <Product data={productData} key={productData._id} breakPoint={4} />
            ) : null
          );

          setProducts(productsArr);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []); // No need to have products in the dependency array

  return (
    <React.Fragment>

      <ProductSearch />
      <hr />
      <h2 className="text-center my-5 py-3">Our Products</h2>
      <Row>{products}</Row>
    </React.Fragment>
  );
}
