const categoryRouter = require("express").Router();
const categoryController = require("../../controllers/categoryController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin;

categoryRouter.get('/', categoryController.getAllCategories);

categoryRouter.get('/withSub', categoryController.getAllCategoriesWithSub);

categoryRouter.post('/', categoryController.addNewCategory);

categoryRouter.put('/:categoryId', categoryController.update);

categoryRouter.delete('/:categoryId', categoryController.deleteCategory);

module.exports.categoryRouter = categoryRouter;
