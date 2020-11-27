import { combineReducers } from 'redux';
import { GAME_STOPPED, STOP_CURRENT_GAME, USER_LOGGED, USER_QUIT_APP } from '../actions';
import { feedReducer } from './feed.reducer';
import database from '@react-native-firebase/database';


function auth(state = { user: {} as any, waiting: false }, action: any) {
  switch (action.type) {

    case USER_LOGGED:
      let user = action.value;
      var nextState = {
        ...state,
        user: user,
      };

      // Set the /users/:userId value to true
      if (user != null) {
        let ref = database().ref("online").child(user.uid)
        ref.set(true).then(() => console.log('Online presence set for user : ' + user.uid));
        // Remove the node whenever the client disconnects
        database().ref("online").child(user.uid)
          .onDisconnect()
          .remove()
          .then(() => console.log('On disconnect function configured.'));
      }
      return nextState;


    default:
      return state;
  }

}

function game(state = { user: null, waiting: false }, action: any) {
  switch (action.type) {

    case STOP_CURRENT_GAME:
      var nextState = {
        ...state,
        wantsToStop: true,
      };
      return nextState;

    case GAME_STOPPED:
      var nextState = {
        ...state,
        wantsToStop: false,
      };
      return nextState;

    default:
      return state;
  }

}



export const rootReducer = combineReducers({
  feed: feedReducer,
  auth: auth,
  game: game
  // stories: storiesReducer
});

export type RootState = ReturnType<typeof rootReducer>;