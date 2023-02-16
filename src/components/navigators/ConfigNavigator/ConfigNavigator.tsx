import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Configuration from '../../Settings/Screens/Configuration/Configuration';
import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';
import Categories from '../../Settings/Screens/Configuration/Categories';
import SubCategories from '../../Settings/Screens/Configuration/SubCategories';
import CategoryForm from '../../Settings/Screens/Configuration/CategoryForm';
import SubCategoryForm from '../../Settings/Screens/Configuration/SubCategoryForm';
import DefaultCurrency from '../../Settings/Screens/Configuration/DefaultCurrency';

const ConfigStack = createNativeStackNavigator<ConfigStackParamList>();

const ConfigNavigator = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <ConfigStack.Navigator
      initialRouteName="Configuration"
      screenOptions={{
        headerStyle: {
          backgroundColor: activeColor.theme,
        },
        headerTintColor: activeColor.text1,
        animation: 'slide_from_right',
      }}>
      <ConfigStack.Screen name="Configuration" component={Configuration} />
      <ConfigStack.Screen
        name="Categories"
        component={Categories}
        initialParams={{type: 'Expense'}}
        options={({route}) => ({
          title: `${route.params.type} Categories`,
        })}
      />
      <ConfigStack.Screen
        name="CategoryForm"
        component={CategoryForm}
        options={{
          title: `Category Form`,
        }}
      />
      <ConfigStack.Screen
        name="SubCategoryForm"
        component={SubCategoryForm}
        options={{
          title: `Sub-Category Form`,
        }}
      />
      <ConfigStack.Screen
        name="SubCategories"
        component={SubCategories}
        options={({route}) => ({
          title: `${route.params.name} Sub-Categories`,
        })}
      />
      <ConfigStack.Screen
        name="DefaultCurrency"
        component={DefaultCurrency}
        options={({route}) => ({
          title: `Select Default Currency`,
        })}
      />
    </ConfigStack.Navigator>
  );
};

export default ConfigNavigator;
