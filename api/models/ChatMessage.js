/**
 * ChatMessage.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {

    primaryKey: {
      type: 'number',
      autoIncrement: true
    },

    message: {
      type: 'string',
      required: true
    },

    audio: {
      type: 'string',
      required: true,
    },

    createdBy : {
      model: 'user',
      required: true
    }
  }
};
