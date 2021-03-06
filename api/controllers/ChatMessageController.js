/**
 * ChatMessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const easterEggs = ['oke', 'nice'];

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
      if (easterEggs.indexOf(word) !== -1) {
        audioFiles.push(`/audio/${word}.mp3`);
        continue;
      }
      const url = `https://nl.wiktionary.org/api/rest_v1/page/media/${word}`;
      const response = await httpRequest.get(url);

      const json = JSON.parse(response);

      if (Array.isArray(json.items)) {
        for (const item of json.items) {
          if (item.type === 'audio') {
            audioFiles.push(item.original.source);
            break;
          }
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

      if (Array.isArray(json.items)) {
        for (const item of json.items) {
          if (item.type === 'audio') {
            valid = true;
            break;
          }
        }
      }
    } catch (err) {
      valid = false;
    }

    if (easterEggs.indexOf(word) !== -1) {
      valid = true;
    }

    res.send({valid});
  }

};
