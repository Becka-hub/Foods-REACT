import { AJOUTE_USER,SUPRIMER_USER } from '../types/typeUser';
const user = [];
const UserReducer = (state = user, action) => {
    if (localStorage.getItem('user')) {
        state = JSON.parse(localStorage.getItem('user'));
    }
    switch (action.type) {
        case AJOUTE_USER:
            state=action.payload;
            return  state;
        break;
        case SUPRIMER_USER:
            return state = [];
        default:
            return state;
            
    }
}

export default UserReducer;