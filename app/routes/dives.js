var express = require('express');
var router = express.Router();
var Dive = require('../models/dive');

router.get('/', function(req, res) {
    req.query.skip ? skip = parseInt(req.query.skip) : skip = 0;
    req.query.take ? take = parseInt(req.query.take) : take = 0;

    Dive.find({ diver: req.query.diverID }).populate('diver buddy').skip(skip).limit(take).sort({ count: -1 }).exec(function(err, dives) {
        if (err) {
            res.status(500).json({ 'Error': 'Could not get dives. Stack trace: ' + err });
        } else {
            res.json(dives);
        }
    });
});

router.post('/', function(req, res) {
    Dive.create(req.body, function(err, dive) {
        if (err) {
            res.status(500).json({ 'Error': 'Could not create dive. Stack trace: ' + err });
        } else {
            res.json(dive);
        }
    });
});

router.put('/:id', function(req, res) {
    var diveID = req.params.id;
    var dive = req.body;
    dive.date = new Date(dive.date);
    if (dive.diver._id) {
        dive.diver = dive.diver._id;
    }
    if (dive.buddy) {
        if (dive.buddy._id) {
            dive.buddy = dive.buddy._id;
        }
    }

    Dive.findOneAndUpdate({ _id: diveID }, dive, { new: true }).populate('buddy').exec(function(err, dive) {
        if (err) {
            res.status(500).json({ 'Error': 'Could not update dive. Stack trace: ' + err });
        } else {
            res.json(dive);
        }
    });
});

router.delete('/:id', function(req, res) {
    var diveID = req.params.id;

    Dive.findOne({_id: diveID}).remove(function(err) {
        if (err) {
            res.status(500).json({ 'Error': 'Could not delete dive. Stack trace: ' + err });
        } else {
            res.status(200).json({ 'Message': 'Dive deleted.' });
        }
    });
});

module.exports = router;
