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

    const httpRequest = require('request-promise');

    const words = request.body.message.split(' ');
    // let audio = '';
    let audioFiles = [];
    for (const word of words) {
      const url = `https://nl.wiktionary.org/api/rest_v1/page/media/${word}`;
      const response = await httpRequest.get(url);

      const json = JSON.parse(response);
      if (json.items.length > 0) {
        if (json.items[0].type === 'audio') {
          // audio = (json.items[0].original.source);
          audioFiles.push(json.items[0].original.source);
        }
      }
    }

    try {
      const user = await User.findOne({email:'johnnie86@gmail.com'});

      await ChatMessage.create({
        message: request.body.message,
        audio: audioFiles.join(';'),
        createdBy: user.id,
      });

      sails.sockets.blast('chatmessage', [{
        message: request.body.message,
        audio: audioFiles,
        createdBy: user,
        createdAt: Date.now(),
      }]);

    } catch (err) {
      return response.serverError(err);
    }

    return response.ok();
  },

  checkWord: async (req, res) => {
    // Make sure this is a socket request (not traditional HTTP)
    if (!req.isSocket) {
      return res.badRequest();
    }

    const httpRequest = require('request-promise');
    const word = req.body.word;
    let valid = false;

    try {
      const url = `https://nl.wiktionary.org/api/rest_v1/page/media/${word}`;

      const response = await httpRequest.get(url);
      const json = JSON.parse(response);


      // TODO: Make work if there's more media.
      if (json.items.length > 0) {
        if (json.items[0].type === 'audio') {
          valid = true;
        }
      }

    } catch (err) {
      valid = false;
    }

    res.send({valid});
  }

};

