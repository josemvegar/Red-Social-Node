const Follow = require("../models/Follow");

const followUserIds = async (identityUserId) => {
    try{
        
        // Sacar info de seguimiento
        let following= await Follow.find({"user" : identityUserId})
        .select({"followed": 1, "_id":0})
        .exec();
    
        
        let followers = await Follow.find({"followed" : identityUserId})
        .select({"user": 1, "_id":0})
        .exec();

        // Procesar array de id's
        let followingClean = [];
        following.forEach(follow => {
            followingClean.push(follow.followed);
        });
        let followersClean = [];
        followers.forEach(follow => {
            followersClean.push(follow.user);
        });
    
        return {
            followingClean,
            followersClean
        };
        /*return {
            following,
            followers
        };*/
    }
    catch(error){
        return {};
    }

}

const followThisUser = async (identityUserId, profileUserId) =>{
    try{
        
        // Sacar info de seguimiento
        let followin= await Follow.findOne({"user" : identityUserId, "followed": profileUserId});        
        let follower = await Follow.findOne({"user": profileUserId , "followed" : identityUserId});

        return {
            followin,
            follower
        }

    }
    catch(error){
        return {};
    }
}

module.exports= {
    followUserIds,
    followThisUser
};