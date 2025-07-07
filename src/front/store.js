export const initialStore=()=>{
  return{
    message: null,
    token: localStorage.getItem("token") || null,
    pets: []
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_pet':

      const { id,  name, species, breed, age, wheight } = action.payload

      return {
        ...store,
        pets: store.pets.map((pet) => (pet.id === id ? { ...pet, name: name, species:species, breed:breed, age:age, wheight:wheight } : pet))
      };

    case 'SET_PETS':
      return {
        ...store,
        pets: action.payload
      }

    default:
      throw Error('Unknown action.');
  }    
}
