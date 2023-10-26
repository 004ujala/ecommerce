const express = require('express');
const Category = require('../models/categoryModel');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const slugify = require('slugify');
const router = express.Router();


// create category
router.post('/create-category', requireSignIn, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ success: false, message: "category name is required" });
        }
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: 'category already exists'
            })
        }
        const category = await new Category({
            name: name,
            slug: slugify(name)
        }).save();
        res.status(201).send({
            success: true,
            message: "new category created",
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error ocuured in category"
        })
    }
})

// update category
router.put('/update-category/:id', requireSignIn, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            message: "category updated",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error ocuured while updating category",
            error
        })
    }
})

// get all category
router.get('/get-category', async (req, res) => {
    try {
        const category = await Category.find({});
        res.status(200).send({
            success: true,
            message: "all added categories",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error occured while getting all categories",
            error
        })
    }
})

// single category
router.get('/single-category/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug: slug });
        res.status(200).send({
            success: true,
            message: "single category got successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error occurred while getting single category",
            error
        })
    }
})

// delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "category deleted successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error occurred while deleting category",
            error
        })
    }
})


module.exports = router;