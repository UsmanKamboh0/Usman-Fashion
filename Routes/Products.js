const express=require('express');
const { GetAllProduct, AddProduct, DeleteProduct, UpdateProduct, GetProductdetail, deleteReview, getProductReviews, createProductReview, createProduct, getAdminProducts, deleteProduct, updateProduct } = require('../Controller/productcontroller');
const { isAnthentication, authorizeRoles } = require('../midleware/auth');
const router=express.Router();

router.route("/products").get(GetAllProduct);
router.route("/addproduct").post(isAnthentication,authorizeRoles("admin","partner"),AddProduct);
router.route("/product/:id").put(isAnthentication,authorizeRoles("admin"),UpdateProduct).get(GetProductdetail);
router.route("/review").put(isAnthentication, createProductReview);
router
  .route("/admin/product/new")
  .post(isAnthentication,authorizeRoles("admin"), createProduct);
  router
  .route("/admin/products")
  .get( getAdminProducts);
  router
  .route("/admin/product/:id")
  .put(isAnthentication,authorizeRoles("admin"), updateProduct)
  .delete(isAnthentication,authorizeRoles("admin"), deleteProduct);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAnthentication, deleteReview)

module.exports = router;
