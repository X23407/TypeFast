class stats{
    constructor(){
        this.curData = false;
        // document.getElementById("next").addEventListener("")/
        document.body.addEventListener("keyup", (e)=>{
            if (e.key == "Enter"){
                document.getElementById("next").click();
            }
        })
    }

    heightAdjuster(){
        let imgDiv = document.getElementById("image-div").clientHeight;
        let conDiv = document.getElementById("content-div").clientHeight;
        imgDiv = imgDiv<conDiv?conDiv:imgDiv;
        imgDiv += 30;
        document.getElementById("content-div").style.height = `${imgDiv}px`;
        document.getElementById("image-div").style.height = `${imgDiv}px`;
    }

    correctReader(value){
        // value ="wpm_net";
        if (this.curData.hasOwnProperty(value)){
            return this.curData[value];
        }else{
            return "N/A";
        }
    }

    updateData(){
        // this.heightAdjuster()
        this.loadData();
        document.getElementById("wpm_net").innerHTML = this.correctReader("wpm_net");
        document.getElementById("accuracy").innerHTML = this.correctReader("accuracy");
        document.getElementById("time").innerHTML = `${this.correctReader("time")}s`;
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
            this.starAdder("fill");
            this.starAdder("fill");
            this.starAdder("fill"); 
        }else if (accuracy >=90){
            this.starAdder("fill");
            this.starAdder("fill");
            this.starAdder("hollow");
        }else if (accuracy >=80){
            this.starAdder("fill");
            this.starAdder("hollow");
            this.starAdder("hollow");
        }else{
            this.starAdder("hollow");
            this.starAdder("hollow");
            this.starAdder("hollow");
        }
    }

    loadData(){
        this.curData = localStorage.getItem("dataPass");
        this.curData = JSON.parse(this.curData);
        console.log(this.curData);
        return;
    }

    starAdder(type = "fill"){
        let container = document.getElementById("img-container");
        let i = document.createElement('img');
        if (type == "fill"){
            i.src = "image/fill.png";
        }else{
            i.src = "image/hollow.png"
        }
        i.alt = "Star image";
        i.style.maxHeight = `${conDiv-35}px`
        container.appendChild(i);
    }
}