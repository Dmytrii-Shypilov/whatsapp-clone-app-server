const Dialog = require("../models/dialog-model");
const User = require("../models/user-model");


const getAllDialogs = async (req,res,next) => {
  const {id, name} = req.user

  try {
    const allDialogs = await Dialog.find({})

    const userDialogs = allDialogs.reduce((acc, dialog, idx) => {
      
      if (dialog.participants.find(el=> el.id === id)) {
        acc.push(dialog)
        return acc
      }
      return acc
    }, [])

    console.log(userDialogs)
    res.status(201).json({dialogs: userDialogs})

  } catch (error) {
    next(error)
  }
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
  getAllDialogs
};
