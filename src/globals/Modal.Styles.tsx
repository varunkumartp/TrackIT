import {StyleSheet} from 'react-native';

export const ModalStyles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    borderWidth: 1,
  },
  modalHeader: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalHeaderText: {
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
  },
  modalContent: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  modalContentText: {
    fontSize: 17,
    margin: 10,
    fontWeight: 'bold',
  },
  touchableText: {
    fontSize: 13,
    margin: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
