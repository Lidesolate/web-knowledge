let animal = {
  set walk(value){
    console.log('animal walk');
  }
}

let rabbit = Object.create(animal);

rabbit.walk = 'true';

Object.defineProperty(rabbit, 'walk', {
  value: function(){
    console.log('rabbit walk')
  },
})

rabbit.walk();