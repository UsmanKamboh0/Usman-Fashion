const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../Controller/OrderController");
const router = express.Router();

const { isAnthentication, authorizeRoles } = require("../midleware/auth");

router.route("/order/new").post(isAnthentication, newOrder);

router.route("/order/:id").get( getSingleOrder);

router.route("/orders/me").get(isAnthentication, myOrders);

router
  .route("/admin/orders")
  .get(isAnthentication, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAnthentication, authorizeRoles("admin"), updateOrder)
  .delete(isAnthentication, authorizeRoles("admin"), deleteOrder);

module.exports = router;
