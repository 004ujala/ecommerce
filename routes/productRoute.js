const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const colors = require('colors');
const formidable = require('express-formidable');
const router = express.Router();
const fs = require('fs');
const ProductModel = require('../models/productModel');
const slugify = require('slugify');
const { populate } = require('../models/userModel');

router.use(formidable());

router.post('/create-product', requireSignIn, isAdmin, async (req, res) => {
    try {
        var { name, slug, description, price, category, quantity, shipping } = req.fields;
        var { photo } = req.files;
        // validation
        switch (true) {
            case !name:
                return res.status(500).send({ message: "Name is required" });
            case !description:
                return res.status(500).send({ message: "Description is required" });
            case !price:
                return res.status(500).send({ message: "Price is required" });
            case !category:
                return res.status(500).send({ message: "Category is required" });
            case !quantity:
                return res.status(500).send({ message: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ message: "Photo is required and should be less than 1mb" });
        }
        const product = new ProductModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).send({
            success: true,
            message: "product added successfully",
            product
        });
    } catch (error) {
        console.log(`${error}`.bgRed.white);
        res.status(500).send({
            success: false,
            message: "server error occurred while creating product",
            error
        })
    }
})

router.get('/get-product', async (req, res) => {
    try {
        const products = await ProductModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "all products fetched properly",
            products
        })

    } catch (error) {
        console.log(`some internal error while getting all products`.bgRed.white);
        res.status(500).send({
            success: true,
            message: "some internal error occurred while fetcching all products",
            error
        })
    }
})

// single product
router.get('/get-product/:slug', async (req, res) => {
    try {
        const product = await ProductModel.findOne({ slug: req.params.slug }).populate('category').select("-photo");
        res.status(200).send({
            success: true,
            message: "single product fetched successfully",
            product
        })
    } catch (error) {
        console.log(`internal server error while fetching single product`.bgRed.white);
        res.status(500).send({
            success: false,
            message: "internal server error while fetching single product",
            error
        })
    }
})

router.get('/product-photo/:pid', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(`getting error while fetching product photo`.bgRed.white);
        res.status(500).send({
            success: false,
            message: "internal server error while fetching product photos",
            error
        })
    }
})

router.delete('/product/:pid', async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "product deleted successfully"
        })
    } catch (error) {
        console.log(`some internal error occured while deleting product`.bgRed.white);
        res.status(500).send({
            success: false,
            message: "internal error occurred while deleting product",
            error
        })
    }
})

router.put('/update-product/:pid', requireSignIn, isAdmin, async (req, res) => {
    try {
        var { name, slug, description, price, category, quantity, shipping } = req.fields;
        var { photo } = req.files;
        // validation
        switch (true) {
            case !name:
                return res.status(500).send({ message: "Name is required" });
            case !description:
                return res.status(500).send({ message: "Description is required" });
            case !price:
                return res.status(500).send({ message: "Price is required" });
            case !category:
                return res.status(500).send({ message: "Category is required" });
            case !quantity:
                return res.status(500).send({ message: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ message: "Photo is required and should be less than 1mb" });
        }
        const product = await ProductModel.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).send({
            success: true,
            message: "product updated successfully",
            product
        });
    } catch (error) {
        console.log(`${error}`.bgRed.white);
        res.status(500).send({
            success: false,
            message: "server error occurred while updating product",
            error
        })
    }
})

module.exports = router;