import React from 'react';
import { render } from "react-dom";
import './index.css';
import { EntityList } from "@contentful/f36-components";
import { setup } from '@contentful/ecommerce-app-base';
import { useState, useEffect } from "react";


const DialogLocation = ({ sdk }) => {
  const [productsData, setProductsData] = useState([]);

  console.log('DialogLocation')
  useEffect(() => {
    console.log('useEffect')
    fetch(`./pim_api_response.json`,{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then((data)=>{
        console.log(data)
        setProductsData(data)
      });
  }, []);

  const cardClicked = item => {
    //return the sku id
    sdk.close([item.id]);
  };

  if (productsData) {
    return (
      <>
        <EntityList>
          {productsData.map(item => (
            <EntityList.Item
              key={item.id}
              title={item.name}
              description="Product information"
              thumbnailUrl={item.image}
              onClick={() => cardClicked(item)}
            />
          ))}
        </EntityList>
      </>
    );
  } else {
    return <div>Please wait</div>;
  }
};

const fetchProductPreviews = async(skus) => {

  //based on SKU make an API call to get the product
  const result = await fetch(`./pim_api_response.json`,{
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  const jsonResult = await result.json()
  const selectedProducts = jsonResult.filter((product)=> product.sku === skus[0])
  return selectedProducts
}

const renderDialog = (sdk) => {
  const container = document.createElement("div");
  container.id = "my-dialog";
  document.body.appendChild(container);

  render(<DialogLocation sdk={sdk} />, document.getElementById("my-dialog"));
  sdk.window.startAutoResizer();
}

const openDialog = async (sdk, currentValue, config) => {
  const skus = await sdk.dialogs.openCurrentApp({
    position: "center",
    title: 'Select products',
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    parameters: { ...config },
    width: 400,
    height:500,
    allowHeightOverflow: true
  });
  return Array.isArray(skus) ? skus : [];
}

setup({
  makeCTA: () => 'Select My products',
  name: 'My SKU App-Produc League',
  logo: '',
  color: '#d7f0fa',
  description: 'My example SKU App',
  parameterDefinitions: [
    {
      id: 'category',
      type: 'Symbol',
      name: 'Category',
      description: 'Product category of our shop',
      required: true,
    },
    {
      id: 'project_id',
      type: 'Number',
      name: 'Project Id',
      description: 'Product Id of our shop',
      required: true,
    },
  ],
  validateParameters: () => null,
  fetchProductPreviews,
  renderDialog,
  openDialog,
  isDisabled: () => false,
});