'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define(
    "Tweet",
    {
      message: {
        type: DataTypes.STRING(280),
        allowNull: false,
      },
    },
    {}
  );
  Tweet.associate = function (models) {
    Tweet.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
  };


  Tweet.allTweets = async () => await Tweet.findAll({
    include: [{ model: User, as: "user", attributes: ["username"] }],
    order: [["createdAt", "DESC"]],
    attributes: ["message"],
  });

  Tweet.oneTweet = async (tweetId) => await Tweet.findByPk(tweetId)

  Tweet.addTweet = async (message, userId) => await Tweet.create( {message, userId} )

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