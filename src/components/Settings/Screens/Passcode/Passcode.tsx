import React, { useContext, useState } from 'react';
import {
  Modal,
  Switch, Text,
  TouchableHighlight, View
} from 'react-native';
import { LockContext } from '../../../../contexts/LockContext';
import { PswdContext } from '../../../../contexts/PswdContext';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import { ConfigStyle } from '../../../../globals/Config.Styles';
import { Theme } from '../../../../globals/Theme';
import LockScreen from './LockScreen';

const Passcode = () => {
  const {theme} = useContext(ThemeContext);
  const {passcode, updatePasscodePref} = useContext(LockContext);
  const {pswd, updatePswd} = useContext(PswdContext);
  let activeColor = Theme[theme.mode];
  const [screen1, setScreen1] = useState(false);
  const [screen2, setScreen2] = useState(false);
  const [newPswd, setNewPswd] = useState(pswd.mode);
  const [change, setChange] = useState(false);
  const [enable, setEnable] = useState(passcode.mode === 'enable');

  const turnOffHandler = () => {
    updatePasscodePref({mode: 'disabled'});
    updatePswd({mode: ''});
    setScreen1(false);
    setEnable(false);
  };

  const changeHandler = () => {
    setEnable(false);
    setChange(false);
    setScreen1(true);
  };

  const turnOnHandler = (pswd: string) => {
    setNewPswd(pswd);
    setScreen2(true);
    setScreen1(false);
  };

  const setHandler = (pswd: string) => {
    updatePasscodePref({mode: 'enable'});
    updatePswd({mode: pswd});
    setEnable(!enable);
    setScreen2(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        underlayColor={activeColor.theme}
        onPress={() => setScreen1(true)}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
            Turn {!enable ? 'on' : 'off'} Passcode
          </Text>
          <Switch
            value={enable}
            disabled={true}
            trackColor={{
              false: activeColor.red,
              true: activeColor.blue,
            }}
            thumbColor={activeColor.theme}
          />
        </View>
      </TouchableHighlight>
      {enable && (
        <TouchableHighlight
          style={{
            ...ConfigStyle.touchableView,
            borderBottomColor: activeColor.text1,
          }}
          underlayColor={activeColor.theme}
          onPress={() => setChange(true)}>
          <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
            Change Passcode
          </Text>
        </TouchableHighlight>
      )}
      {/* Turn on/off passcode */}
      <Modal visible={screen1}>
        <LockScreen
          setModal={setScreen1}
          header={`Enter ${!enable ? 'new ' : ''}Passcode`}
          pswd={enable ? pswd.mode : undefined}
          changeHandler={enable ? turnOffHandler : turnOnHandler}
        />
      </Modal>
      <Modal visible={screen2}>
        <LockScreen
          setModal={setScreen2}
          header="Re-enter new Passcode"
          pswd={newPswd}
          changeHandler={setHandler}
        />
      </Modal>
      {/* Change passcode */}
      <Modal visible={change}>
        <LockScreen
          setModal={setChange}
          header="Enter old Passcode"
          pswd={pswd.mode}
          changeHandler={changeHandler}
        />
      </Modal>
    </View>
  );
};

export default Passcode;
