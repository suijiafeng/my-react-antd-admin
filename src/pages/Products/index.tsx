// src/pages/Products/index.tsx

import React from 'react';
import { List, Card } from 'antd';

const data = [
  {
    title: 'Product 1',
    description: 'This is product 1',
    price: '$100',
  },
  {
    title: 'Product 2',
    description: 'This is product 2',
    price: '$200',
  },
  {
    title: 'Product 3',
    description: 'This is product 3',
    price: '$300',
  },
];

const Products: React.FC = () => {
  return (
    <div>
      <h1>Products</h1>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title}>
              <p>{item.description}</p>
              <p>{item.price}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Products;