// Defining Authorisation according to roles

module.exports = {
  'POST /cart/add': ['customer'],
  'DELETE /cart/': ['customer'],
  'GET /cart/': ['customer'],
  'GET /customers/': ['restaurant'],
  'GET /customers/(.+)': ['restaurant'],
  'GET /customers/profile': ['customer'],
  'PUT /customers/(.+)': ['customer'],
  'DELETE /customers/(.+)': ['admin'],
  'POST /customers/address': ['customer'],
  'GET /customers/address': ['customer'],
  'POST /dishes/newdish': ['restaurant'],
  'PUT /dishes/(.+)': ['restaurant'],
  'GET /dishes/(.+)': ['restaurant'],
  'GET /dishes/': ['restaurant'],
  'DELETE /dishes/(.+)': ['restaurant'],
  'POST /orders/neworder': ['customer'],
  'PUT /orders/finalorder': ['customer'],
  'PUT /orders/(.+)': ['restaurant'],
  'GET /orders/': ['customer', 'restaurant'],
  'GET /orders/(.+)': ['customer', 'restaurant'],
  'PUT /restaurant/(.+)': ['restaurant'],
  'DELETE /restaurant/(.+)': ['admin'],
  'GET /restaurant/(.+)': ['restaurant', 'customer'],

  
};
