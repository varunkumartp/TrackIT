import {
  View,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {Theme} from '../../../../globals/Theme';
import {ModalStyles} from '../../../../globals/Modal.Styles';
import {
  checkIfSubCategories,
  deleteCategories,
  deleteCategoriesTransactions,
  deleteCatSubCategories,
  getCategories,
} from '../../../../database/configuration';
import AddButton from './AddButton';
import {useIsFocused} from '@react-navigation/native';
import CategoriesItem from './CategoriesItem';

type CategoriesProp = NativeStackScreenProps<
  ConfigStackParamList,
  'Categories'
>;

const Categories = ({route, navigation}: CategoriesProp) => {
  const focused = useIsFocused();
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [categories, setCategories] = useState<Accounts[]>([]);
  const [count, setCount] = useState(-1);
  const [modal1, setModal1] = useState(false); // Modal with delete transactions
  const [modal2, setModal2] = useState(false); // Simple Yes No Modal
  const [deleteID, setDeleteID] = useState('');

  const deleteCategoryHandler = () => {
    setModal2(false);
    deleteCategoriesTransactions(deleteID);
    deleteCategories(deleteID);
    setDeleteID('');
    getCategories(route.params.type, setCategories);
  };

  const deleteCatSubCat = () => {
    setModal1(false);
    deleteCatSubCategories(deleteID);
    deleteCategoryHandler();
  };

  const formHandler = (ID: string, name: string) => {
    navigation.navigate('CategoryForm', {
      ID: ID,
      name: name,
      type: route.params.type,
    });
  };

  const categoryHandler = (ID: string, name: string) => {
    navigation.navigate('SubCategories', {
      ID: ID,
      name: name,
      type: route.params.type,
    });
  };

  useEffect(() => {
    if (count === 0) {
      setModal2(true);
    } else if (count > 0) {
      setModal1(true);
    }
    setCount(-1);
  }, [count]);

  useEffect(() => {
    getCategories(route.params.type, setCategories);
  }, [focused]);

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
            categoryHandler={categoryHandler}
            check={ID => {
              setDeleteID(ID);
              checkIfSubCategories(ID, setCount);
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
                Delete Category
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
                Do you want to delete this category?
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity onPress={() => deleteCategoryHandler()}>
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
                Delete Category
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
                This category contains sub-categories. What would you like to do
                with these sub-categories?
              </Text>
              <View>
                {/* Feature for future release */}
                {/* <TouchableOpacity onPress={() => setModal1(false)}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.secondary,
                    }}>
                    Move transactions to a different Account
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => deleteCatSubCat()}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    Delete categories and sub-categories
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
        path="CategoryForm"
        ID={''}
        type={route.params.type}
        name={''}
      />
    </View>
  );
};

export default Categories;
