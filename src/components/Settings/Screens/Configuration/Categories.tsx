import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import {
  checkIfSubCategories,
  deleteCategories,
  deleteCategoriesTransactions,
  deleteCatSubCategories,
  getCategories
} from '../../../../database/configuration';
import ModalBox from '../../../../globals/ModalBox';
import { Theme } from '../../../../globals/Theme';
import AddButton from './AddButton';
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
      <ModalBox
        modal={modal2}
        setModal={setModal2}
        header="Delete Category"
        subHeading="Do you want to delete this category?"
        firstButton="Yes"
        secondButton="No"
        onConfirm={deleteCategoryHandler}
      />
      {/********************************** Modal 1 ******************************************************/}
      <ModalBox
        modal={modal1}
        setModal={setModal1}
        header="Delete Category"
        subHeading="This category contains sub-categories. What would you like to do with these sub-categories?"
        firstButton="Delete categories and sub-categories"
        secondButton="Cancel"
        onConfirm={deleteCatSubCat}
      />

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
