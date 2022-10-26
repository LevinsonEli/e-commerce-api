const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const OrdersDbController = require('../db/controllers/orders');
const ProductsDbController = require('../db/controllers/products');

const fakeStripeAPI = async ({ amount, currency }) => {
 const clientSecret = 'secretValue';
 return { clientSecret, amount };
}

const getAllOrders = async (req, res) => {
  const orders = await OrdersDbController.getInstance().getMany();
  res.status(StatusCodes.OK).json({ orders });
}

const getOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await OrdersDbController.getInstance().get(orderId);

  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await OrdersDbController.getInstance().getManyByUser(req.user.userId);
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req, res) => {
   const { items: cartItems, tax, shippingFee } = req.body;
   if (!cartItems || cartItems.length < 1)
     throw new CustomError.BadRequestError('Cart items must be provided');
   if (!tax || !shippingFee)
     throw new CustomError.BadRequestError(
       'Tax and shipping fee must be provided'
     );

   let orderItems = [];
   let subtotal = 0;

   for (const item of cartItems) {
    const dbProduct = await ProductsDbController.getInstance().get(
      item.product
    );
     const { name, price, image, _id } = dbProduct;
     const singleOrderItem = {
       amount: item.amount,
       name,
       price,
       image,
       product: _id,
     };

     orderItems.push(singleOrderItem);
     subtotal += item.amount + price;
   }

   const total = tax + shippingFee + subtotal;
   const paymentIntent = await fakeStripeAPI({
     amount: total,
     currency: 'usd',
   });

   const order = await OrdersDbController.getInstance().add({
     orderItems,
     total,
     subtotal,
     tax,
     shippingFee,
     clientSecret: paymentIntent.clientSecret,
     user: req.user.userId,
   });

   res
     .status(StatusCodes.CREATED)
     .json({ order, clientSecret: order.clientSecret });
};

const payOrder = async (req, res) => { 
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await OrdersDbController.getInstance().get(orderId);

  checkPermissions(req.user, order.user);
  
  const payedOrder = await OrdersDbController.getInstance().pay(orderId, paymentIntentId);

  res.status(StatusCodes.OK).json({ payedOrder });
};

module.exports = {
  getAllOrders,
  getOrder,
  getCurrentUserOrders,
  createOrder,
  payOrder,
};