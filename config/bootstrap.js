/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(cb) {

  sails.config.appName = 'Sails Chat App';

  // Generate Chat Messages
  try {
    let messageCount = ChatMessage.count();
    if (messageCount > 0){
      return;
    }

    let users = await User.find();
    if (users.length >= 3) {
      console.log('Generating messages...');

      await ChatMessage.create({
        message: 'Hey Everyone! Welcome to the community!',
        createdBy: users[1].id
      });

      await ChatMessage.create({
        message: 'How\'s it going?',
        createdBy: users[2].id
      });

      await ChatMessage.create({
        message: 'Super excited!',
        createdBy: users[0].id
      });

    } else {
      console.log('skipping message generation');
    }
  } catch(err){
    console.error(err);
  }

  cb();
};
