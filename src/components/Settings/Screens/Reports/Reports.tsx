import React, {useContext, useState} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {
  balanceSheet,
  exportExcel,
  incomeStatement,
} from '../../../../database/exportData';
import {ConfigStyle} from '../../../../globals/Config.Styles';
import {
  DateFilterDD,
  getFiscalYear,
  months,
} from '../../../../globals/DateFilter.component';
import {ModalStyles} from '../../../../globals/Modal.Styles';
import {Theme} from '../../../../globals/Theme';

const Reports = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState({
    month: -1,
    year: new Date().getFullYear(),
  });
  const [value, setValue] = useState('FY');
  const [func, setFunc] = useState('');

  const modalHandler = () => {
    let header = (
      value === 'FY'
        ? getFiscalYear(date)
        : value === 'Periodic'
        ? `${months[date.month - 1]} ${date.year}`
        : date.year
    ).toString();

    switch (func) {
      case 'excel':
        exportExcel(date, header);
        break;
      case 'incomeStatement':
        incomeStatement(date, header);
        break;
      case 'balanceSheet':
        balanceSheet(date, header);
        break;
      default:
        break;
    }
    setModal(false);
  };

  const touchableHandler = (funct: string) => {
    setFunc(funct);
    setModal(true);
  };

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        onPress={() => touchableHandler('excel')}
        underlayColor={activeColor.theme}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Download transactions to Excel
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        onPress={() => touchableHandler('incomeStatement')}
        underlayColor={activeColor.theme}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Download Income Statement
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        onPress={() => touchableHandler('balanceSheet')}
        underlayColor={activeColor.theme}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Download Balance Sheet
        </Text>
      </TouchableHighlight>

      <Modal transparent={true} visible={modal}>
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
                <TouchableOpacity onPress={() => modalHandler()}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    Download
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModal(false)}>
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

export default Reports;
