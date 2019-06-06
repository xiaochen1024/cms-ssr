// const keystone = require('keystone');

const keystone = require('keystone');

exports = module.exports = async (req, res) => {
  const getPostCategoryData = () => new Promise((resolve) => {
    keystone
      .list('PostCategory')
      .model.find()
      .sort('name')
      .exec((err, result) => {
        resolve(result);
      });
  });
  const getPostsData = key => new Promise((resolve) => {
    const { category, page, size } = req.query;
    const categoryKey = category || key;
    const returnPostData = (p) => {
      p.exec((err, result) => {
        result.results.forEach((element) => {
          element.content = { brief: element.content.brief };
        });
        resolve(result);
      });
    };

    const p = keystone
      .list('Post')
      .paginate({
        page: page || 1,
        perPage: size || 5,
        maxPages: size || 5,
        filters: {
          state: 'published',
          // categories: { $elemMatch: { name: '11' } },
        },
      })
      .sort('-publishedDate')
      .populate('author categories', 'name');

    if (categoryKey) {
      keystone
        .list('PostCategory')
        .model.findOne({ key: categoryKey })
        .exec((err, result) => {
          p.where('categories').in([result]);
          returnPostData(p);
        });
    } else {
      returnPostData(p);
    }
  });

  if (req.query.category) {
    const data = await getPostsData(req.query.category);
    res.send(data);
  } else {
    if (req.query.ismobile) {
      const data = await getPostsData();
      res.send(data);
      return;
    }
    getPostCategoryData().then((categories) => {
      const pArr = categories.map(v => getPostsData(v.key));
      Promise.all(pArr).then((posts) => {
        const data = categories.map((element, index) => ({
          key: element.key,
          name: element.name,
          posts: posts[index],
        }));
        res.send(data);
      });
    });
  }
};
