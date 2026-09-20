class stats{
    constructor(){
        this.curData = false;
        
        this.constraintMode = localStorage.getItem("constraintMode") || "time";
        this.selectedTime = parseInt(localStorage.getItem("selectedTime")) || 30;
        if (this.selectedTime !== 0 && !this.selectedTime) this.selectedTime = 0; // fallback logic
        this.selectedWordMode = localStorage.getItem("selectedWordMode") || "short";

        this.buttonClick();
        this.initConstraintUI();
        // this.wrong_list = JSON.parse(localStorage.getItem("wrong_list"))
        // document.getElementById("next").addEventListener("")/
        document.body.addEventListener("keyup", (e)=>{
            console.log(e);
            if (e.shiftKey && e.key == "Enter"){
                this.improve();
            }
            else if (e.key == "Enter"){
                document.getElementById("next").click();
            }
        })
    }

    setting(){
        window.location.href = "home.html";
    }


    correctReader(value){
        // value ="wpm_net";
        if (this.curData.hasOwnProperty(value)){
            return this.curData[value];
        }else{
            return "N/A";
        }
    }


    next(){
        window.location.href = "index.html";
    }
    improve(){
        if (this.wrong_list && Object.keys(this.wrong_list).length > 0){
            // alert(this.wrong_list);
            localStorage.setItem("redirect","improve");
            localStorage.setItem("constraintMode", "time");
            localStorage.setItem("selectedTime", "0");
            window.location.href = "index.html";
        }else{
            this.redo();
        }
    }
    redo(){
        localStorage.setItem("redirect","redo");
        window.location.href = "index.html";
    }

    buttonClick(mode=false){
        if (mode == false){
            let mode = localStorage.getItem("mode");
            if (!mode){
                mode = "relax";
                /*Avoiding error for the first user*/
            }
            document.getElementById(mode).classList.add("active");
        }else{
            localStorage.setItem("mode",mode);
            window.location.href = "index.html";
        }
        //hello
    }

    setTime(time) {
        localStorage.setItem("constraintMode", "time");
        localStorage.setItem("selectedTime", time);
        window.location.href = "index.html";
    }

    setWordMode(mode) {
        localStorage.setItem("constraintMode", "word");
        localStorage.setItem("selectedWordMode", mode);
        window.location.href = "index.html";
    }

    toggleConstraintMode() {
        let current = localStorage.getItem("constraintMode") || "time";
        let next = current === "time" ? "word" : "time";
        localStorage.setItem("constraintMode", next);
        window.location.href = "index.html";
    }

    initConstraintUI() {
        let toggle = document.getElementById("constraint-toggle");
        let timeEls = document.querySelectorAll(".constraint-time");
        let wordEls = document.querySelectorAll(".constraint-word");

        if (this.constraintMode === "time") {
            if (toggle) toggle.innerText = "Time ▼";
            timeEls.forEach(el => el.style.display = "");
            wordEls.forEach(el => el.style.display = "none");
            
            let times = [15, 30, 60, 120, 0];
            times.forEach(t => {
                let el = document.getElementById(`time-${t}`);
                if (el) {
                    if (t === this.selectedTime) el.classList.add("active");
                    else el.classList.remove("active");
                }
            });
        } else {
            if (toggle) toggle.innerText = "Words ▼";
            timeEls.forEach(el => el.style.display = "none");
            wordEls.forEach(el => el.style.display = "");
            
            let words = ["short", "medium", "large", "xlarge"];
            words.forEach(w => {
                let el = document.getElementById(`word-${w}`);
                if (el) {
                    if (w === this.selectedWordMode) el.classList.add("active");
                    else el.classList.remove("active");
                }
            });
        }
    }

    updateData(){
        // this.heightAdjuster()
        localStorage.setItem("redirect",false);
        if (!this.loadData()){
            return;
            /* Error Handling */
        };
        document.getElementById("wpm_net").innerHTML = this.correctReader("wpm_net");
        document.getElementById("accuracy").innerHTML = this.correctReader("accuracy");
        document.getElementById("time_s").innerHTML = `${this.correctReader("time")}s`;
        document.getElementById("correct").innerHTML = `${this.correctReader("correct")}`;
        document.getElementById("wrong").innerHTML = this.correctReader("wrong");
        document.getElementById("extra").innerHTML = this.correctReader("extra");
        document.getElementById("wpm_total").innerHTML = this.correctReader("wpm");
        this.starFiller(this.curData["accuracy"]);
    }

    starFiller(accuracy){
        // accuracy =95;
        // alert(accuracy);
        let message = "";
        if (accuracy>=95){
            document.getElementById("s1").classList.remove("empty"); 
            document.getElementById("s2").classList.remove("empty"); 
            document.getElementById("s3").classList.remove("empty");
            let choice = ["Great Accuracy!!!","Awesome Job!!!","keep it up!!!"]
            message = choice[Math.floor(Math.random()*choice.length)];
        }else if (accuracy >=90){
            document.getElementById("s1").classList.remove("empty"); 
            document.getElementById("s2").classList.remove("empty"); 
            document.getElementById("s3").classList.add("empty"); 
            let choice = ["Good Accuracy!!!","Not great accuracy!!!","You can increase little more accuracy!!!"]
            message = choice[Math.floor(Math.random()*choice.length)];
        }else if (accuracy >=80){
            document.getElementById("s1").classList.remove("empty"); 
            document.getElementById("s2").classList.add("empty"); 
            document.getElementById("s3").classList.add("empty"); 
            let choice = ["One Star!!!","Today One star, Tomrrow two Star!!!","Never give up!!!","Keep Practicing!!!"]
            message = choice[Math.floor(Math.random()*choice.length)];
        }else{
            document.getElementById("s1").classList.add("empty"); 
            document.getElementById("s2").classList.add("empty"); 
            document.getElementById("s3").classList.add("empty"); 
            let choice = ["One Star!!!","No Worries, Keep gooing!!!","Bingo, Keep practicing!!!"]
            message = choice[Math.floor(Math.random()*choice.length)];
        }
        document.getElementById("motivater").innerHTML = message;
    }

    loadData(){
        this.curData = localStorage.getItem("dataPass");
        if (!this.curData){
            return false;
        }
        this.curData = JSON.parse(this.curData);
        this.wrong_list = JSON.parse(this.curData["wrong_list"]);
        console.log(this.curData);
        return true;
    }

    // starAdder(type = "fill"){
    //     let container = document.getElementById("img-container");
    //     let i = document.createElement('img');
    //     if (type == "fill"){
    //         i.src = "image/fill.png";
    //     }else{
    //         i.src = "image/hollow.png"
    //     }
    //     i.alt = "Star image";
    //     i.style.maxHeight = `${conDiv-35}px`
    //     container.appendChild(i);
    // }
}