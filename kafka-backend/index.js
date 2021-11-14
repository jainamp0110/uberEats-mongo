/* eslint-disable camelcase */
/* eslint-disable no-new-require */
// eslint-disable-next-line new-cap
const connection = new require('./kafka/connection');
const mongoose = require('mongoose');

// topics files
const createRestaurant = require('./services/restaurants/create');

const updateCustomer = require('./services/customers/update');

const placeOrder = require('./services/orders/place');

function handleTopicRequest(topic_name, fname) {
  const consumer = connection.getConsumer(topic_name);
  const producer = connection.getProducer();
  consumer.on('message', (message) => {
    try {
      const data = JSON.parse(message.value);
      console.log('Sending request: ', data);
      fname(data.data, (err, res) => {
        let payloads = [];
        if (err) {
          payloads = [
            {
              topic: 'response_topic',
              messages: JSON.stringify({
                correlationId: data.correlationId,
                data: err,
              }),
              partition: 0,
            },
          ];
        } else {
          payloads = [
            {
              topic: 'response_topic',
              messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res,
              }),
              partition: 0,
            },
          ];
        }
        producer.send(payloads, (error) => {
          if (error) {
            console.log('Error from backend: ', JSON.stringify(error));
            return;
          }
          console.log('Sent data from backend: ', JSON.stringify(res));
        });
      });
    } catch (e) {
      const payloads = [
        {
          topic: 'response_topic',
          messages: JSON.stringify({
            data: e,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, (error, producerData) => {
        if (error) {
          console.log('Error with kafka: ', JSON.stringify(error));
          return;
        }
        console.log('Kafka backend reponse: ', JSON.stringify(producerData));
      });
    }
  });
}

mongoose.connect(
  `mongodb+srv://admin:admin@cluster0.jmcs4.mongodb.net/uberEats?retryWrites=true&w=majority`,
  {
    useNewUrlParser: 'true',
    autoIndex: true,
  },
);

// Add your TOPICs here
// First argument is topic name
// Second argument is a function that will handle this topic request

handleTopicRequest('restaurant.create', createRestaurant);

handleTopicRequest('customer.update', updateCustomer);

handleTopicRequest('order.place', placeOrder);
