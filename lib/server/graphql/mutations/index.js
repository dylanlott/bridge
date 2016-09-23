'use strict';

const graphql = require('graphql');
const addPaymentProcessor = require('./add-payment-processor');
const removePaymentProcessor = require('./remove-payment-processor');
const addManualPayment = require('./addManualPayment');

const rootMutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPaymentProcessor: addPaymentProcessor,
    removePaymentProcessor: removePaymentProcessor,
    addManualPayment: addManualPayment
  }
});

module.exports = rootMutation;
