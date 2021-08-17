'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    message: DataTypes.STRING
  }, {});
  Tweet.associate = function(models) {
    // associations can be defined here
  };


  Tweet.allTweets = async () => await Tweet.findAll();

  Tweet.oneTweet = async (tweetId) => await Tweet.findByPk(tweetId)

  Tweet.addTweet = async (message) => await Tweet.create( {message} )

  Tweet.updateTweet = async (tweetId, message) => {
    console.log(tweetId, message)
    const tweet = await Tweet.oneTweet(tweetId);
    if (tweet === null) return null;

    await tweet.update({ message })
    await tweet.save();
    // const tweet = await Tweet.update({message: message}, {_id: tweetId})
    return tweet;
  }

  Tweet.deleteTweet = async (tweetId) => {
    const tweet = await Tweet.oneTweet(tweetId);
    if (tweet === null) return null;

    await tweet.destroy();
  }

  return Tweet;
};