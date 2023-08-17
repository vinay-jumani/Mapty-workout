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

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const submit = document.querySelector(".submit");

let map, mapevent;
let workouts = [];
class App {
    constructor(){
        this._getpostion();
        submit.addEventListener("click", this._newworkouter.bind(this));
        //get local storage
      this._getlocalstorage();
    }
// 1st
    _getlocalstorage(){
        const data =   JSON.parse(localStorage.getItem('workouts'));
        workouts = data;
        console.log(workouts);
        this.workouts.forEach((work =>{
        this._listdisplay(work);
        })
        
        )
        }
        
// 2nd
  _getpostion() {
    navigator.geolocation.getCurrentPosition(this._loadmap, function () {
      alert("Not have your location");
    });
  }

// 3rd
  _loadmap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const cooords = [latitude, longitude];

    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    map = L.map("map").setView(cooords, 16);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    


    map.on("click", function (mape) {
      mapevent = mape;
      console.log(mapevent);
      form.classList.remove("hidden");
      
    });
  
    this.workouts.forEach((work=>{
     this._mapmark(work);
      })
      );

  
}

// 4rt

_newworkouter(e) {
    e.preventDefault();

        //get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = mapevent.latlng;
        let workout;

        console.log(workouts);
        //if workout running create running
        if (type === "running") {
          //check if data is valid
          if (!Number.isFinite(distance || duration))
            return alert("Please enter number");
          workout = new running([lat, lng], distance, duration);
          workouts.push(workout);
        }

            //if workout cycle create running
    if (type === "cycling") {
        //check if data is valid
        if (!Number.isFinite(distance || duration))
          return alert("Please enter number");
        work = new cycle([lat, lng], distance, duration);
        workouts.push(workout);
      }
      //map ko display
      this._mapmark(workout);
    
      //list ko display

      this._listdisplay(workout);
    
      this._hiddenfield();

      this._setlocalstore()

    }



//map ka mark
    _mapmark(workout){

    // render workout on map as marker
    L.marker(workout.cooords)
      .addTo(map)
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


//list pa display
_listdisplay(workout){
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

_hiddenfield(){
inputDistance.value = inputDuration.value = "";

form.style.display = 'none'
form.classList.add('hidden');
setTimeout(()=>form.style.display = 'grid' , 1000 );
}

_setlocalstore(){
    localStorage.setItem('workouts',JSON.stringify(workouts));
}



}

const app1 =new App();