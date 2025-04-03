import { Router } from 'express';
import { 
  verifyAdmin,
  getAllItems,
  addItem,
  removeItem,
  updateItem,
  updateInventory
} from '../controllers/admin.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();


router.use((req, res, next) => {
    authenticate(req, res, (err?: any) => {
      if (err) return next(err);
      verifyAdmin(req, res, next);
    });
  });




router.get('/items', getAllItems);
router.post('/items', addItem);
router.delete('/items/:id', removeItem);
router.put('/items/:id', (req, res, next) => {
  updateItem(req, res).catch(next);
});

router.put('/items/:id/inventory', (req, res, next) => {
    updateInventory(req, res).catch(next);
 });


export default router;




