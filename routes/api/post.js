const keystone = require('keystone');

exports = module.exports = (req, res) => {
  keystone
    .list('Post')
    .model.findOne({ _id: req.query.id })
    .populate('author categories')
    .exec((err, result) => {
      res.json(result);
    });
};
