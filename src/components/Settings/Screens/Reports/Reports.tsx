import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {Theme} from '../../../../globals/Theme';
import {Styles} from '../../../../globals/Styles.Styles';
import {exportExcel} from '../../../../database/exportData';
import {ModalStyles} from '../../../../globals/Modal.Styles';
import {DateFilterDD} from '../../../../globals/DateFilter.component';

const Reports = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [excelModal, setExcelModal] = useState(false);
  const [date, setDate] = useState({
    month: -1,
    year: new Date().getFullYear(),
  });
  const [value, setValue] = useState('FY');
  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        onPress={() => setExcelModal(true)}
        underlayColor={activeColor.theme}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Download transactions to Excel
        </Text>
      </TouchableHighlight>
      <Modal transparent={true} visible={excelModal}>
        <View style={ModalStyles.mainView}>
          <View
            style={{
              ...ModalStyles.modalView,
              borderColor: activeColor.text1,
            }}>
            <View
              style={{
                paddingHorizontal: 5,
                borderBottomColor: activeColor.text1,
                backgroundColor: activeColor.theme,
              }}>
              <DateFilterDD
                date={date}
                setDate={setDate}
                value={value}
                setValue={setValue}
              />
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
                Select the time period
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    exportExcel(date);
                    setExcelModal(false);
                  }}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    Download
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setExcelModal(false)}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ConfigStyle = StyleSheet.create({
  touchableView: {
    padding: 5,
    borderBottomWidth: 1,
  },
  text: {
    ...Styles.text,
    fontSize: 15,
  },
});

export default Reports;
