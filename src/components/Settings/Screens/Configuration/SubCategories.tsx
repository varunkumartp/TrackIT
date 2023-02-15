import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {Theme} from '../../../../globals/Theme';
import {
  checkCategories,
  deleteCategories,
  deleteCategoriesTransactions,
  getSubCategories,
} from '../../../../database/configuration';
import { ModalStyles } from '../../../../globals/Modal.Styles';
import AddButton from './AddButton';
import {useIsFocused} from '@react-navigation/native';
import CategoriesItem from './CategoriesItem';
type SubCategoriesProp = NativeStackScreenProps<
  ConfigStackParamList,
  'SubCategories'
>;

const SubCategories = ({route, navigation}: SubCategoriesProp) => {
  const focused = useIsFocused();
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [categories, setCategories] = useState<Accounts[]>([]);
  const [count, setCount] = useState(-1);
  const [modal1, setModal1] = useState(false); // Modal with delete transactions
  const [modal2, setModal2] = useState(false); // Simple Yes No Modal
  const [deleteID, setDeleteID] = useState('');
  const formHandler = (ID: string, name: string) => {
    navigation.navigate('SubCategoryForm', {
      ID: ID,
      name: name,
      type: route.params.type,
    });
  };

  const deleteSubCategoryHandler = () => {
    setModal2(false);
    deleteCategories(deleteID);
    setDeleteID('');
    getSubCategories(route.params.ID, route.params.type, setCategories);
  };

  const deleteTXSubCategoryHandler = () => {
    setModal1(false);
    deleteCategoriesTransactions(deleteID);
    deleteSubCategoryHandler();
  };

  useEffect(() => {
    getSubCategories(route.params.ID, route.params.type, setCategories);
  }, [focused]);

  useEffect(() => {
    if (count === 0) {
      setModal2(true);
    } else if (count > 0) {
      setModal1(true);
    }
    setCount(-1);
  }, [count]);

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <FlatList
        data={categories}
        keyboardShouldPersistTaps="handled"
        keyExtractor={item => item.ID}
        ListFooterComponent={() => <View style={{padding: 50}} />}
        renderItem={({item}) => (
          <CategoriesItem
            data={item}
            type={route.params.type}
            formhandler={formHandler}
            categoryHandler={(ID, name) => {}}
            check={ID => {
              setDeleteID(ID);
              checkCategories(ID, route.params.type, setCount);
            }}
          />
        )}
      />
      {/********************************** Modal 2 ******************************************************/}
      <Modal transparent={true} visible={modal2}>
        <View style={ModalStyles.mainView}>
          <View
            style={{
              ...ModalStyles.modalView,
              borderColor: activeColor.text1,
            }}>
            <View
              style={{
                ...ModalStyles.modalHeader,
                borderBottomColor: activeColor.text1,

                backgroundColor: activeColor.theme,
              }}>
              <Text
                style={{
                  ...ModalStyles.modalHeaderText,
                  color: activeColor.text1,
                }}>
                Delete Sub Category
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
                Do you want to delete this sub-category?
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity onPress={() => deleteSubCategoryHandler()}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModal2(false)}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/********************************** Modal 1 ******************************************************/}
      <Modal transparent={true} visible={modal1}>
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
                Delete Sub-Category
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
                This sub-category contains transactions. What would you like to do
                with these transactions?
              </Text>
              <View>
                {/* Feature for future release */}
                {/* <TouchableOpacity onPress={() => setModal1(false)}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.secondary,
                    }}>
                    Move transactions to a different sub-category
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => deleteTXSubCategoryHandler()}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    Delete transactions and sub-category
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModal1(false)}>
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
      <AddButton
        path="SubCategoryForm"
        ID={route.params.ID}
        type={route.params.type}
        name={''}
      />
    </View>
  );
};

export default SubCategories;
