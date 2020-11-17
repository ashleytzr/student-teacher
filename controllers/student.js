const { validationResult } = require('express-validator');

const Student = require('../models/student');

// Extra APIs
exports.createStudent = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (typeof req.body.email === 'object') {
            const errorMessage =  JSON.stringify({ message: 'Please provide only one email' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }

        if (!errors.isEmpty()) {
            const errorMessage =  JSON.stringify({ message: 'Please provide a valid email for student.' });
            const error = new Error(errorMessage);
            error.statusCode = 400;
            throw error;
        }
        
        const email = req.body.email;
        let suspended = req.body.suspended;

        // Default suspended status is false if not provided
        if (suspended === undefined) {
            suspended = false;
        }

        await Student.upsert({
            email: email,
            suspended: suspended
        });

        res.status(201).json ({
                message: 'Student created successfully!',
        });
        
    } catch (err) {
        if (!err.statusCode) {
            console.log(err);
            res.status(500).json({ message: 'Oops, something went wrong! :(' });
        }

        res.status(err.statusCode).send(err.message);
    }
};

