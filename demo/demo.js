class tp{
constructor(){
    this._fun1();
}




_fun1(){
    console.log('this is methods show ');

    this._fun2();

}

_fun2(){
    console.log("ya ha  2nd methods");
}

}
 
const TP = new tp();