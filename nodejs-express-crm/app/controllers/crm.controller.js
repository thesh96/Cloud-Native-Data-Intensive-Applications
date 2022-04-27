const kafkaConsumer = require("../models/crm.kafkaConsumer");

module.exports = (app) => {

    kafkaConsumer.consume();
}