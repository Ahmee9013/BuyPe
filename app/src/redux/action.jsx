export const SET_CONTACTS = 'SET_CONTACTS';
export const ADD_GROUP = 'ADD_GROUP';
export const UPDATE_GROUPS = "UPDATE_GROUPS";
export const DELETE_GROUP = "DELETE_GROUP";
export const SET_USER = "SET_USER";
export const LOGOUT_USER = "LOGOUT_USER";

export const setContacts = (contacts) => ({
  type: SET_CONTACTS,
  payload: contacts,
});

export const addGroup = (group) => ({
  type: ADD_GROUP,
  payload: group,
});

export const deleteGroupAction = (groupName) => ({
  type: DELETE_GROUP,
  payload: groupName,
});

export const updateGroupsAction = (groups) => ({
  type: UPDATE_GROUPS,
  payload: groups,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});
