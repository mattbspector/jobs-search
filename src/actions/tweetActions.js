import {TWEET_LIST_SUCCESS} from './types';


export const getTweetList = () => {
    return (dispatch) => {
        dispatch({
            type: TWEET_LIST_SUCCESS
        });
    };
};
