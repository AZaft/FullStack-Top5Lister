const Top5List = require('../models/top5list-model');

createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Top 5 List',
        })
    }

    const top5List = new Top5List(body);
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({ success: false, error: err })
    }

    top5List
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                top5List: top5List,
                message: 'Top 5 List Created!'
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Top 5 List Not Created!'
            })
        })
}

updateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        top5List.name = body.name
        top5List.items = body.items
        top5List.views = body.views
        top5List.likes = body.likes
        top5List.dislikes = body.dislikes
        top5List.comments = body.comments
        top5List.published = body.published
        top5List.publishDate = body.publishDate
        top5List.community = body.community
        top5List.communityScore = body.communityScore
        top5List
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
    })
}

deleteTop5List = async (req, res) => {
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }
        Top5List.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({ success: true, data: top5List })
        }).catch(err => console.log(err))
    })
}

getTop5ListById = async (req, res) => {
    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, top5List: list })
    }).catch(err => console.log(err))
}

getTop5Lists = async (req, res) => {
    async function asyncFindList() {
        console.log("find all published lists");
        await Top5List.find({ published: true }, (err, top5Lists) => {
            console.log("found Top5Lists: " + top5Lists);
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!top5Lists) {
                return res
                    .status(404)
                    .json({ success: false, error: 'Top 5 Lists not found' })
            }
            else {
                console.log(top5Lists)
                return res.status(200).json({ success: true, top5Lists: top5Lists })
            }
        }).catch(err => console.log(err))
    }
    asyncFindList();
}

getTop5ListsByUser = async (req, res) => {
    async function asyncFindList(user) {
        console.log("find all Top5Lists owned by " + user);
        await Top5List.find({ user: user }, (err, top5Lists) => {
            console.log("found Top5Lists: " + top5Lists);
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!top5Lists) {
                return res
                    .status(404)
                    .json({ success: false, error: 'Top 5 Lists not found' })
            }
            else {
                console.log(top5Lists)
                return res.status(200).json({ success: true, top5Lists: top5Lists })
            }
        }).catch(err => console.log(err))
    }
    asyncFindList(req.params.user);
}


getTop5ListsByName = async (req, res) => {
    async function asyncFindList(name) {
        console.log("find all Top5Lists named " + name);
        await Top5List.find({ name: {$regex : "^" + name, $options: 'i'}, published: true }, (err, top5Lists) => {
            console.log("found Top5Lists: " + top5Lists);
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!top5Lists) {
                return res
                    .status(404)
                    .json({ success: false, error: 'Top 5 Lists not found' })
            }
            else {
                console.log(top5Lists)
                return res.status(200).json({ success: true, top5Lists: top5Lists })
            }
        }).catch(err => console.log(err))
    }
    asyncFindList(req.params.name);
}

getTop5CommunityList = async (req, res) => {
    async function asyncFindList(name) {
        await Top5List.findOne({ name: name, community: true }, (err, top5List) => {
            console.log("found Community List: " + top5List);
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!top5List) {
                return res
                    .status(404)
                    .json({ success: false, error: 'Top 5 Lists not found' })
            }
            else {
                console.log(top5List)
                return res.status(200).json({ success: true, top5List: top5List })
            }
        }).catch(err => console.log(err))
    }
    asyncFindList(req.params.name);
}

module.exports = {
    createTop5List,
    updateTop5List,
    deleteTop5List,
    getTop5Lists,
    getTop5ListsByUser,
    getTop5ListById,
    getTop5ListsByName,
    getTop5CommunityList
}