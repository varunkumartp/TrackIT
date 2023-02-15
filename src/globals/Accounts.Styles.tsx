import { StyleSheet } from "react-native";

export const AccountsStyles = StyleSheet.create({
  text: {
    marginVertical: 10,
    marginHorizontal: 12,
    fontWeight: 'bold',
  },
  headerAccount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 5,
  },
  headerText: {
    fontSize: 15,
    margin: 10,
    fontWeight: 'bold',
  },
  nonHeaderAccount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nonHeaderText: {
    fontSize: 13,
    margin: 10,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
