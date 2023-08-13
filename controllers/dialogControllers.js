const Dialog = require("../models/dialog-model");
const User = require("../models/user-model");

const getAllDialogs = async (req, res, next) => {
  const { id, name } = req.user;

  try {
    const allDialogs = await Dialog.find({});

    const userDialogs = allDialogs.reduce((acc, dialog, idx) => {
      if (dialog.participants.find((el) => el.id === id)) {
        acc.push(dialog);
        return acc;
      }
      return acc;
    }, []);

    res.status(201).json({ dialogs: userDialogs });
  } catch (error) {
    next(error);
  }
};

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

    const doesDialogExist = await Dialog.findOne({ ...dialog });

    if (!doesDialogExist) {
      const newDialog = await Dialog.create(dialog);

      if (newDialog && userOne && userTwo) {
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
    }
  } catch (error) {
    console.log(error);
  }
};

const acceptInvite = async (dialogId, acceptorId) => {
  try {
    const dialog = await Dialog.findById(dialogId);

    const colocutor = dialog.participants.find((el) => el.id !== acceptorId);
    const acceptor = dialog.participants.find((el) => el.id === acceptorId);
    acceptor.accepted = true;
    await dialog.save();
    return dialog;
  } catch (error) {
    return {message: error.message}
  }
};

const addMessage = async (data)=> {
  const {lastMessageIdx, dialogId, messageData} = data
  try {
    const dialog = await Dialog.findById(dialogId)
   if (lastMessageIdx === null) {
    const newMessage = {
      from: messageData.from,
      messageContent: [messageData.message]
    }
    dialog.messages.push(newMessage)
   } else {
    dialog.messages[lastMessageIdx].messageContent.push(messageData.message)
   }
    dialog.save()
    return {messageReceived: true}
  } catch (error) {
    console.log(error)
  }
}

const readMessage = async (readersId, dialogId) => {
  try {
    const dialog = await Dialog.findById(dialogId)
    

  } catch (error) {
    
  }
}

module.exports = {
  addDialog,
  getAllDialogs,
  acceptInvite,
  addMessage
};
