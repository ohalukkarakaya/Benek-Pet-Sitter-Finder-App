import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getStoryCommentsController = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const storyId = req.params.storyId.toString();
        const lastElementId = req.params.lastElementId || 'null';
        let limit = parseInt(req.params.limit) || 15;

        if (!storyId) {
            return res.status(400).json({
                error: true,
                message: "Missing Param"
            });
        }

        const story = await Story.findById(storyId).lean();
        if (!story) {
            return res.status(404).json({
                error: true,
                message: "Story Not Found"
            });
        }

        const storyOwner = await User.findById(story.userId.toString());
        if (!storyOwner || storyOwner.blockedUsers.includes(req.user._id.toString())) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized"
            });
        }

        const reversedComments = story.comments.reverse();
        let skip = lastElementId !== 'null' ? reversedComments.findIndex(commentObject => commentObject._id.toString() === lastElementId) + 1 : 0;
        let comments = [];

        if (skip === 0) {
            const usersComments = reversedComments.filter(
                commentObject =>
                    commentObject.userId.toString() === userId
            );

            limit = limit - usersComments.length;
            comments.push(...usersComments);
        }

        if (limit > 0) {
            const commentList = reversedComments.filter(
                commentObject =>
                    commentObject.userId.toString() !== userId
            );
            const limitedComments = commentList.slice(skip, skip + limit);
            comments.push(...limitedComments);
        }

        if (comments.length > 0) {
            for (let commentObject of comments) {
                const commentedUser = await User.findById(commentObject.userId.toString());
                const commentedUserInfo = getLightWeightUserInfoHelper(commentedUser);

                commentObject.user = commentedUserInfo;
                delete commentObject.userId;

                let firstFiveOfLikeLimit = Math.min(commentObject.likes.length, 5);

                commentObject.firstFiveLikedUser = [];
                for (let i = 0; i < firstFiveOfLikeLimit; i++) {
                    const likedUser = await User.findById(commentObject.likes[i].toString());
                    const likedUserInfo = getLightWeightUserInfoHelper(likedUser);

                    commentObject.firstFiveLikedUser.push(likedUserInfo);
                }

                const replyCount = commentObject.replies.length;
                let lastReply = replyCount > 0 ? commentObject.replies[replyCount - 1] : {};

                if (lastReply.likes) {
                    lastReply.likeCount = lastReply.likes.length;
                    delete lastReply.likes;
                }

                let lastThreeRepliedUsers = [];
                if (commentObject.replies.length > 0) {
                    const uniqueUsers = new Set();
                    for (let i = 0; i < commentObject.replies.length; i++) {
                        if (uniqueUsers.size >= 3) break;

                        const reply = commentObject.replies[i];
                        if (reply) {
                            const repliedUser = await User.findById(reply.userId.toString());
                            const repliedUserInfo = getLightWeightUserInfoHelper(repliedUser);

                            if (!uniqueUsers.has(reply.userId.toString())) {
                                uniqueUsers.add(reply.userId.toString());
                                lastThreeRepliedUsers.push(repliedUserInfo);
                            }
                        }
                    }
                }

                commentObject.lastThreeRepliedUsers = lastThreeRepliedUsers;

                commentObject.lastReply = lastReply;
                commentObject.replyCount = replyCount;
                commentObject.likeCount = commentObject.likes.length;

                delete commentObject.likes;
                delete commentObject.replies;
            }

            const usersComments = comments.filter(
                commentObject => commentObject.user.userId.toString() === userId
            ).sort((a, b) => b.createdAt - a.createdAt);

            const otherComments = comments.filter(
                commentObject => commentObject.user.userId.toString() !== userId
            ).sort((a, b) => b.createdAt - a.createdAt);

            const resultCommentData = [...usersComments, ...otherComments];
            return res.status(200).json({
                error: false,
                message: "Comments Prepared successfully",
                totalCommentCount: story.comments.length,
                commentCount: comments.length,
                comments: resultCommentData
            });
        } else {
            return res.status(404).json({
                error: true,
                message: "No Comment Found"
            });
        }
    } catch (err) {
        console.log("ERROR: getStoryCommentsController - ", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

export default getStoryCommentsController;
