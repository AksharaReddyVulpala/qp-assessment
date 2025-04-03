import { RequestHandler, Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { getCart,addToCart,removeFromCart, getAvailableItems } from '../controllers/cart.js';
import { verifyAdmin } from '../controllers/admin.js';
import { placeOrder } from '../controllers/order.js';

const router = Router();


// router.use((req, res, next) => {
//     authenticate(req, res, (err?: any) => {
//         if (err) return next(err); 
//         // Ensure verifyAdmin also follows proper middleware structure
//         return verifyAdmin(req, res, next);
//     });
// });

router.use((req, res, next) => {
    authenticate(req, res,next);
  });
  

// router.get('/', getCart);
// router.post('/items', addToCart);
// router.delete('/items/:itemId', removeFromCart);
// //router.post('/checkout', CartController.placeOrder);


router.get('/allitems', getAvailableItems); 

router.get('/', (req, res, next) => {
    getCart(req, res).catch(next);
  });
router.post('/cartitems', (req, res, next) => {
    addToCart(req, res).catch(next);
  });

  router.delete('/cartitems/:itemId', (req, res, next) => {
    removeFromCart(req, res).catch(next);
  });



  router.post('/checkout', (req, res, next) => {
    placeOrder(req, res).catch(next);
  });

export default router;