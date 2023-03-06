import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import {
  checkCategories,
  deleteCategories,
  deleteCategoriesTransactions,
  getSubCategories
} from '../../../../database/configuration';
import ModalBox from '../../../../globals/ModalBox';
import { Theme } from '../../../../globals/Theme';
import AddButton from './AddButton';
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
      <ModalBox
        modal={modal2}
        setModal={setModal2}
        header="Delete Sub Category"
        subHeading="Do you want to delete this sub category?"
        firstButton="Yes"
        secondButton="No"
        onConfirm={deleteSubCategoryHandler}
      />
      {/********************************** Modal 1 ******************************************************/}
      <ModalBox
        modal={modal1}
        setModal={setModal1}
        header="Delete Sub Category"
        subHeading="This sub-category contains transactions. What would you like to do with these transactions?"
        firstButton="Delete transactions and sub-category"
        secondButton="Cancel"
        onConfirm={deleteTXSubCategoryHandler}
      />
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
