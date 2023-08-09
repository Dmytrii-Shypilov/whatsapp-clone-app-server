const Dialog = require("../models/dialog-model");
const User = require("../models/user-model");


const getAllDialogs = (req,res,next) => {

}

const addDialog = async (initiator, colocutor) => {
  try {
    const userOne = await User.findById(initiator);
    const userTwo = await User.findById(colocutor);

    const dialog = {
      participants: [
        { id: userOne.id, name: userOne.name, accepted: true },
        { id: userTwo.id, name: userTwo.name, accepted: false },
      ],
    };
    const newDialog = await Dialog.create(dialog);

    if (newDialog) {
      await userOne.dialogs.push({
        dialogId: newDialog.id,
        colocutor: colocutor,
      });
      await userOne.save();
      await userTwo.dialogs.push({
        dialogId: newDialog.id,
        colocutor: initiator,
      });
      await userTwo.save();

      return newDialog;
    }

   
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addDialog,
};
