"use strict";

// prettier-ignore

class Workout{
    date = new Date();
    id = (Date.now()+ '').slice(-10);    

    constructor(cooords,distance,duration){
        this.cooords = cooords;
        this.distance = distance;
        this.duration = Number(duration);
        console.log(typeof(duration),distance);
    }

    _setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        console.log(this._setDescription);
        
       this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
          months[this.date.getMonth()]
        } ${this.date.getDate()}`;
      }
    }

class running extends Workout {
  type = "running";
  constructor(cooords, distance, duration) {
    super(cooords, distance, duration);
    this._setDescription();
  }
}

class cycle extends Workout {
  type = "cycling";
  constructor(cooords, distance, duration) {
    super(cooords, distance, duration);
    this._setDescription();
  }
}

// const run1 = new running([39,-12],5,24)
// const cycle1 = new cycle([39,-12],15,95);

// console.log(run1,cycle1);

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const submit = document.querySelector(".submit");
let okbtn=document.querySelector('.okbtn');

okbtn.addEventListener('click',function codeAddress() {
  document.querySelector('.Rules').classList.add('hidden');
})



class App {
  #map;
  #mapevent;
  #workouts = [];
  constructor() {

    this._getpostion();
    submit.addEventListener("click", this._newworkout.bind(this));;
    //get local storage
    this._getlocalstorage();
    containerWorkouts.addEventListener('click',this.movetopop.bind(this));
  }



  _getpostion() {
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
      alert("Not have your location");
    });
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._map(work);
    });

  }

  _showForm(mapE) {
    this.#mapevent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _newworkout(e) {
    e.preventDefault();

    //get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapevent.latlng;
    let workout;

    console.log(this.#workouts);
    //if workout running create running
    if (type === "running") {
      //check if data is valid
      if (!Number.isFinite(distance || duration))
        return alert("Please enter number");
      workout = new running([lat, lng], distance, duration);
      
    }

    //if workout cycle create running
    if (type === "cycling") {
      //check if data is valid
      if (!Number.isFinite(distance || duration))
        return alert("Please enter number");
      workout = new cycle([lat, lng], distance, duration);
      
    }

    console.log(this.#workouts);

    this.#workouts.push(workout);

    this._map(workout);

    this._workouters(workout);

    this._local();
    inputDistance.value = inputDuration.value = "";

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);

  }

  _getlocalstorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._workouters(work);    });
  }


  _workouters(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id=${workout.id}>
     <h2 class="workout__title">${workout.description}</h2>
     <div class="workout__details">
       <span class="workout__icon">${
         workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
       }</span>
       <span class="workout__value">${workout.distance}</span>
       <span class="workout__unit">km</span>
     </div>
     <div class="workout__details">
       <span class="workout__icon">⏱</span>
       <span class="workout__value">${Number(workout.duration)}</span>
       <span class="workout__unit">min</span>
     </div>
        `;

    form.insertAdjacentHTML("afterend", html);
  }
  _map(workout) {
 
    L.marker(workout.cooords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();
  }
  _local() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  
}

movetopop(el){
const workoutel = el.target.closest('.workout');
console.log(workoutel);

if(!workoutel) return;

const works = this.#workouts.find(work =>work.id  === workoutel.dataset.id) ;

console.log(works);
this.#map.setView(works.cooords,17,{
  animate: true,
  pan: {
    duration:1,
  }

})
}

}

const app = new App();
