import { AJOUTE_JAIMEDATA,SUPRIMER_JAIMEDATA } from '../types/typeDataJaime';
const dataJaime = [];
const DataJaimeReducer = (state = dataJaime, action) => {
    switch (action.type) {
        case AJOUTE_JAIMEDATA:
            const jaimeExiste = state.find((jaime) => jaime.food.id === action.payload.food.id && jaime.user.id=== action.payload.user.id);
            if(jaimeExiste){
                 const jExiste = state.map((jaime) => jaime.food.id === action.payload.food.id && jaime.user.id === action.payload.user.id ? jaimeExiste : jaime);
                 return jExiste;
            }else{
                const newState = [...state,{ ...action.payload }]
                return  newState;
            }
        break;

        case SUPRIMER_JAIMEDATA:
            const newState = state.filter((jaime) => jaime.id !== action.payload.id);
            return newState;
        break;
        
        default:
            return state;
    }
}

export default DataJaimeReducer;