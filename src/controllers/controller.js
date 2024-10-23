


































































































//************LINE 100 *///////////////
const deleteUser = async (req, res) => {
    try{
        let uname = req.params.username
        let pword = req.params.password
        let query = {username: uname, password: pword};

        await User.findOneAndDelete(query).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({
                    success: false,
                    message: "User deletion failed", error: "Unable to locate User" });
            res.status(201).json({ success: true, foundUser});
        })
        .catch( (error) => {
            res.status(404).json({success: false, error: error.message});
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};

const updateUserCheese = async (req, res) => {
    try{
        let uname = req.params.username
        let pword = req.params.password
        let ch = req.params.cheese
        let query = {username: uname, password: pword};
        let update = {cheese: ch};

        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
            res.status(201).json({ success: true, foundUser});
        })
        .catch ( (error) => {
            res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};
const updateUserPfp = async (req, res) => {
    try{
        let uname = req.params.username
        let pword = req.params.password
        let pfp = req.params.profilepicture
        let query = {username: uname, password: pword};
        let update = {profilepicture: pfp};

        await User.findOneAndUpdate(query, update, {new:true}).then( (foundUser) => {
            if (!foundUser)
                return res.status(404).json({ success: false, message: "User update failed", error: "Unable to locate User"});
            res.status(201).json({ success: true, foundUser});
        })
        .catch ( (error) => {
            res.status(404).json({ success: false, error: error.message});
        })
    } catch (error){
        res.status(500).json({ success: false, message: "Internal server error"});
    }
};






































//************LINE 200 */////////////// ^MINE



































































































//************LINE 300 *///////////////



































































































//************LINE 400 *///////////////



































































































//************LINE 500 *///////////////