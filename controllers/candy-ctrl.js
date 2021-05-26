const Candy = require('../models/candy-model');

const addCandy = async (req , res) => {
    const { path: image } = req.file;
    
    const { candyName, price} = req.body;
    const candy = new Candy({  candyName, price, image: image.replace('\\','/')});
    
    try {
        const newCandy = await candy.save();
        res.status(200).json({ status: 200, type: 'success' , message: 'Candy successfully added!' , newCandy});
    } catch(err) {
        if(err.keyValue && err.keyValue.candyName) {
            res.status(400).json({ status: 400, type: 'info' , message: 'Candy name already exists!' });
        }
        else {
            res.status(400).json({ status: 400, type: 'error' , message: `Oops, an error occurred  : ${err.message}` });
        }
    }
}

const getCandies = async (req, res) => {
    try {
        const candies = await Candy.find({});
        if(!candies.length) {
            res.status(404).json({ status: 404 , type: 'error' , message: 'There is no candies' });
        } else {
            res.status(200).json({ status: 200 , candies });
        }
    } catch(err) {
        res.status(400).json({ status: 400, type: 'error' , message: `Oops, an error occurred  : ${err.message}` });
    }
}

const deleteCandy = async (req, res) => {
    try {
        const candy =  await Candy.findOneAndDelete({ _id: req.params.id });
        if(!candy) {
            res.status(404).json({ status: 404 , type: 'error' , message: 'Candy not found' });
        } else {
            res.status(200).json({ status: 200 , candy });
        }
    } catch(err) {
        res.status(400).json({ status: 400, type: 'error' , message: `Oops, an error occurred  : ${err.message}` });
    }
}

const updateCandy = async (req, res) => {
    const updatedCandyData = req.body;
    if (!updatedCandyData) { 
        return res.status(400).json({ status: 400, type: 'error' , message: 'You must provide a candy data to update'});
    }
    try {
        const candy =  await Candy.findOne({ _id: req.params.id });
        if(!candy) {
            res.status(404).json({ status: 404 , type: 'error' , message: 'Candy not found' });
        } else {
                candy.candyName = updatedCandyData.candyName;
                candy.price = updatedCandyData.price;
            try {
                const updatedCandy = await candy.save();
                res.status(200).json({ status: 200, type: 'success' , message: 'Candy successfully updated!' , updatedCandy});
            } catch(err) {
                if(err.keyValue && err.keyValue.candyName) {
                    res.status(400).json({ status: 400, type: 'info' , message: 'Candy name already exists!' });
                }
                else {
                    res.status(400).json({ status: 400, type: 'error' , message: `Oops, an error occurred  : ${err.message}` });
                }
            }
        }
    } catch(err) {
        res.status(400).json({ status: 400, type: 'error' , message: `Oops, an error occurred  : ${err.message}` });
    }
}

const updateCandiesCounts = async (req, res) => {
    const order = req.body;
    const arrayToUpdate = order.map(candy => ({
        updateOne: {
              filter: { _id: candy.id },
              update: {
                $inc: {count: candy.count },
              }
            }
          })
    );

    try {
        await Candy.bulkWrite(arrayToUpdate);
        const newCandies = await Candy.find({});
        res.status(200).json({ status: 200, type: 'success' , message: 'Order was successfully placed!' , newCandies});
    } catch(err) {
        res.status(400).json({ status: 400, type: 'error' , message: `Oops, an error occurred  : ${err.message}` });
    }
}

module.exports = {
    addCandy,
    getCandies,
    deleteCandy,
    updateCandy,
    updateCandiesCounts,
}