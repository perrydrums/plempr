/**
 * ChatMessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  postMessage: async (request, response) => {
    // Make sure this is a socket request (not traditional HTTP)
    if (!request.isSocket) {
      return response.badRequest();
    }

    try {
      const user = await User.findOne({email:'johnnie86@gmail.com'});

      await ChatMessage.create({
        message: request.body.message,
        createdBy: user.id,
      });

      sails.sockets.blast('chatmessage', {
        message: request.body.message,
        createdBy: user,
        createdAt: Date.now(),
      });

    } catch (err) {
      return response.serverError(err);
    }

    return response.ok();
  }

};

