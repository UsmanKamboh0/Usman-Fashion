const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../Controller/PaymentController");
const router = express.Router();
const { isAnthentication } = require("../midleware/auth");

router.route("/payment/process").post(isAnthentication ,processPayment);

router.route("/stripeapikey").get(isAnthentication,sendStripeApiKey);

module.exports = router;