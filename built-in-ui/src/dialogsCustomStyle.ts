import {
  DialogHorizontalAlign,
  DialogVerticalAlign,
  DialogsStyleState,
} from '@gorilla-engine-sdk/ge-dialogs-lib/dist/DialogsStyleState'

export const dialogsCustomStyle: DialogsStyleState = {
  pluginWidth: 920,
  pluginHeight: 640,

  modal: {
    horizontalAlign: DialogHorizontalAlign.CENTER,
    horizontalOffset: 0,
    verticalAlign: DialogVerticalAlign.CENTER,
    verticalOffset: 0,

    blockingBackgroundColor: '33000000',

    modalWidth: 400,
    modalHeight: 220,
    headerHeight: 50,
    horizontalContentMargin: 16,

    modal: {
      cornerRadius: 4,
      border: {
        width: 1,
        color: '3F4354',
      },
      backgroundColor: '2F333F',
    },

    title: {
      fontSize: 20,
      textColor: 'ffffff',
      textAlign: 'center',
    },

    dividerLine: {
      height: 1,
      backgroundColor: '3F4354',
    },

    message: {
      fontSize: 14,
      textColor: 'ffffff',
      textAlign: 'top left',
      multiLine: true,
    },

    cancelButton: {
      backgroundColor: '21242E',
      textColor: 'E1E6F5',
      font: 'fonts/Roboto-Medium.otf',
      cornerRadius: 4,
    },
    approveButton: {
      backgroundColor: '5177E0',
      textColor: 'E1E6F5',
      font: 'fonts/Roboto-Medium.otf',
      cornerRadius: 4,
    },

    closeButton: {
      width: 20,
      height: 20,
      backgroundColor: '333333',
      cornerRadius: 10,
      text: 'X',
    },
    closeButtonPosition: {
      position: 'right',
      space: 15,
    },
  },

  notification: {
    horizontalAlign: DialogHorizontalAlign.RIGHT,
    horizontalOffset: -30,
    verticalAlign: DialogVerticalAlign.BOTTOM,
    verticalOffset: -30,
    container: {
      width: 300,
      height: 40,
      cornerRadius: 5,
      backgroundColor: '333333',
    },
    label: {},
  },

  toolTip: {
    container: { backgroundColor: '000000', cornerRadius: 5, height: 35 },
    label: {
      fontSize: 13,
      textAlign: 'center',
    },
  },
}
