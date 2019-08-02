import {
    TWEET_LIST_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
    tweets: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TWEET_LIST_SUCCESS:
            return { ...state };
        default:
            return state;
    }
};
