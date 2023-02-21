import {Modal} from 'react-native';
import React, {useContext, useState} from 'react';
import {PswdContext} from '../../contexts/PswdContext';
import LockScreen from '../Settings/Screens/Passcode/LockScreen';
import {LockContext} from '../../contexts/LockContext';

const AppLockScreen = () => {
  const {pswd} = useContext(PswdContext);
  const {locked, setLocked} = useContext(LockContext);
  return (
    <Modal visible={locked}>
      <LockScreen
        setModal={setLocked}
        close={true}
        header="Enter the passcode"
        pswd={pswd.mode}
        changeHandler={() => setLocked(false)}
      />
    </Modal>
  );
};

export default AppLockScreen;
