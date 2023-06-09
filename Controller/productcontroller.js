const Product = require('../Models/ProductModel');
const Errorhandler = require('../Utils/Errorhandler');
const catchAsyncError = require('../midleware/catchAsyncErrors')
const ApiFeature = require('../Utils/ApiFeature');

const cloudinary =require('cloudinary')

// Create Product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
exports.GetAllProduct =catchAsyncError( async (req, res, next) => {
  const resultPerPage = 18;
  const ProductCount = await Product.countDocuments();
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
  ;

  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();
  res.status(200).json({
    success: true,
    ProductCount,
    products,
    resultPerPage,
    filteredProductsCount,

  })
})

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Delete Product

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Update Product -- Admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});



exports.GetAllProduct =catchAsyncError( async (req, res, next) => {
  const resultPerPage = 18;
  const ProductCount = await Product.countDocuments();
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
  ;

  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();
  res.status(200).json({
    success: true,
    ProductCount,
    products,
    resultPerPage,
    filteredProductsCount,

  })
})



exports.GetProductdetail = catchAsyncError(async (req, res, next) => {


  const product = await Product.findById({ _id: req.params.id }).populate('user', "name");

  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }



  res.status(200).json({
    success: true,
    product,
  })
});





exports.DeleteProduct = async (req, res, next) => {


  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not find"
    })
  }
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  })
};

exports.UpdateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("Product not found", 404))
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
  res.status(200).json({
    success: true,
    message: "Update Successfully"
  })


}



exports.AddProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.review,
  });
});

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
