import { StyleSheet } from "react-native";

export const ListStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    zIndex: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 15,
    margin: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 2,
  },
  text: {
    fontSize: 11,
    marginVertical: 10,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  options: {
    zIndex: 2,
    borderBottomColor: '#777',
    borderBottomWidth: 1,
  },
});
