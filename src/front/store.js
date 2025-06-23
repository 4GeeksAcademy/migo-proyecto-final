export const initialStore=()=>{
  return{
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    token: localStorage.getItem("token") || null,
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

    default:
      throw Error('Unknown action.');
  }    
}
