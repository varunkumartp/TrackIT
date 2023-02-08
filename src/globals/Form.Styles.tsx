import {StyleSheet} from 'react-native';

export const FormStyles = StyleSheet.create({
  text: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
  },
  fields: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    flex: 2,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    padding: 0,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '50%',
    paddingHorizontal: 5,
  },
  parentContainer: {
    flex: 1,
  },

  buttonField: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonText: {
    margin: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  pressable: {
    borderRadius: 20,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
});
