const subCategoryRouter = require("express").Router();
const subCategoryController = require("../../controllers/subCategoryController");
const passport = require('passport/lib');
const upload = require('../../config/fileUpload').upload('image');


const adminAuth = require('../../validation/Auth').isAdmin;

subCategoryRouter.get('/:subCategoryId/filters', subCategoryController.getFiltersOfSubCategory);

subCategoryRouter.get('/byCategory', subCategoryController.getSubCategoriesOfCategory);

subCategoryRouter.get('/', subCategoryController.getAllSubCategories);

subCategoryRouter.post('/', upload, subCategoryController.addNewSubCategory);

subCategoryRouter.put('/:subcategoryId', subCategoryController.update);

subCategoryRouter.put('/:subcategoryId', subCategoryController.deleteSubCategory);

module.exports.subCategoryRouter = subCategoryRouter;
