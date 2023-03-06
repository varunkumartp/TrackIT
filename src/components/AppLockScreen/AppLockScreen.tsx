import React, { useContext } from 'react';
import { Modal } from 'react-native';
import { LockContext } from '../../contexts/LockContext';
import { PswdContext } from '../../contexts/PswdContext';
import LockScreen from '../Settings/Screens/Passcode/LockScreen';

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
