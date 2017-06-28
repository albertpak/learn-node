const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');

        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That file type is not allowed!' }, false);
        }
    },
};

exports.homePage = (req, res) => {
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {
        title: 'Add Store',
    });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async(req, res, next) => {
    // check if there's a new file to resize
    if (!req.file) {
        next(); // skip to the next middleware
        return;
    }

    
};

exports.createStore = async(req, res) => {
    const store = await new Store(req.body).save();

    req.flash('success', `Successfully created ${store.name}.`);

    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async(req, res) => {
    const stores = await Store.find();
    res.render('stores', {
        title: 'Stores',
        stores,
    });
};

exports.editStore = async(req, res) => {
    const store = await Store.findOne({ _id: req.params.id });

    res.render('editStore', {
        title: 'Edit Store',
        store,
    });
};

exports.updateStore = async(req, res) => {
    // set as type 'Point' before save happens
    req.body.location.type = 'Point';

    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new store instead of the old one
        runValidators: true,
    }).exec();

    req.flash('success', `Successfully updated!`);
    res.redirect(`/stores/${store.id}/edit`);
};