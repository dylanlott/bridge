'use strict';

const graphql = require('graphql');
const graphqlService = require('../index');
const creditType = require('../types/credit');
const paymentProcessorEnum = require('../types/payment-processor-enum');

const addManualPayment = {
  type: creditType,
  args: {
    _id: {
      type: graphql.GraphQLInt
    },
    data: {
      type: graphql.GraphQLString
    }
  },
  resolve: function(_, args) {
    return graphqlService.currentUser
      .then((user) => {
        console.log("addManualPayment user: ", user);
      })
  }
}
