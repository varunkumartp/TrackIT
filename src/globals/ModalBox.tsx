import {View, Text, TouchableOpacity, Modal} from 'react-native';
import React, {useContext} from 'react';
import {ModalStyles} from './Modal.Styles';
import {ThemeContext} from '../contexts/ThemeContext';
import {Theme} from './Theme';

interface ModalBoxProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  header: string;
  subHeading: string;
  firstButton: string;
  secondButton: string;
  onConfirm: () => void;
}

const ModalBox = ({
  modal,
  setModal,
  header,
  subHeading,
  firstButton,
  secondButton,
  onConfirm,
}: ModalBoxProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <Modal transparent={true} visible={modal}>
      <View style={ModalStyles.mainView}>
        <View
          style={{
            ...ModalStyles.modalView,
            borderColor: activeColor.text1,
          }}>
          <View
            style={{
              ...ModalStyles.modalHeader,
              backgroundColor: activeColor.theme,
              borderBottomColor: activeColor.text1,
            }}>
            <Text
              style={{
                ...ModalStyles.modalHeaderText,
                color: activeColor.text1,
              }}>
              {header}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: activeColor.background,
              ...ModalStyles.modalContent,
            }}>
            <Text
              style={{
                ...ModalStyles.modalContentText,
                color: activeColor.text1,
              }}>
              {subHeading}
            </Text>
            <View>
              <TouchableOpacity onPress={() => onConfirm()}>
                <Text
                  style={{
                    ...ModalStyles.touchableText,
                    color: activeColor.text1,
                  }}>
                  {firstButton}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModal(false)}>
                <Text
                  style={{
                    ...ModalStyles.touchableText,
                    color: activeColor.text1,
                  }}>
                  {secondButton}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalBox;
