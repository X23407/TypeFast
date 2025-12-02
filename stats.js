class stats{
    constructor(){
        this.curData = false;
        this.buttonClick();
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
        if (this.wrong_list){
            // alert(this.wrong_list);
            localStorage.setItem("redirect","improve");
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
            document.getElementById(mode).classList.add("active");
        }else{
            localStorage.setItem("mode",mode);
            window.location.href = "index.html";
        }
        //hello
    }

    updateData(){
        // this.heightAdjuster()
        this.loadData();
        localStorage.setItem("redirect",false);
        document.getElementById("wpm_net").innerHTML = this.correctReader("wpm_net");
        document.getElementById("accuracy").innerHTML = this.correctReader("accuracy");
        document.getElementById("time_s").innerHTML = `${this.correctReader("time")}s`;
        document.getElementById("correct").innerHTML = `${this.correctReader("correct")}`;
        document.getElementById("wrong").innerHTML = this.correctReader("wrong");
        document.getElementById("extra").innerHTML = this.correctReader("extra");
        document.getElementById("wpm_total").innerHTML = this.correctReader("wpm");
        this.starFiller(this.curData["accuracy"]);
        // this.starAdder("fill");
        // this.starAdder("fill");
        // this.starAdder("hollow");
    }

    starFiller(accuracy){
        // accuracy =80;
        // alert(accuracy);
        if (accuracy>=95){
            document.getElementById("s1").classList.remove("empty"); 
            document.getElementById("s2").classList.remove("empty"); 
            document.getElementById("s3").classList.remove("empty"); 
        }else if (accuracy >=90){
            document.getElementById("s1").classList.remove("empty"); 
            document.getElementById("s2").classList.remove("empty"); 
            document.getElementById("s3").classList.add("empty"); 
        }else if (accuracy >=80){
            document.getElementById("s1").classList.remove("empty"); 
            document.getElementById("s2").classList.add("empty"); 
            document.getElementById("s3").classList.add("empty"); 
        }else{
            document.getElementById("s1").classList.add("empty"); 
            document.getElementById("s2").classList.add("empty"); 
            document.getElementById("s3").classList.add("empty"); 
        }
    }

    loadData(){
        this.curData = localStorage.getItem("dataPass");
        this.curData = JSON.parse(this.curData);
        this.wrong_list = JSON.parse(this.curData["wrong_list"]);
        console.log(this.curData);
        return;
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