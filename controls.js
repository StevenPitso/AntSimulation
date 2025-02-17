class Controls{
    constructor(){
        this._DEBUG_ = false;
        this._SWAN_FOOD_ = false;

        this.userInputs();
        this.#Buttons();
    }
    userInputs(){
        this.#Buttons();
    }
    #Buttons(){
        document.onkeydown = (event) => {

            switch(event.key){
                case 'd':
                    this._DEBUG_ = true;
                break;

            }
        }
        
        document.onkeyup = (event) =>{
            switch(event.key){
                case 'd':
                    this._DEBUG_ = false;
                break;
            }
        }

    }
}