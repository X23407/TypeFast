class main{
    constructor(){
        this.curPosirion = "1.0"
        this.correctSound = "s1.mp3";
        this.wrongSound = "c2.mp3";
        this.wrongCount = 0;
        this.sound =true;
        this.charTyped = 0;
        this.startTime=0;
        this.endTime =0;
        this.phraselength = 0;
        /*
        s4.wav : hard sound
        s3.wav : soft high pitch sound
        s2.waav : delete it
        s1.wav: similar to s4 but a bit soft
        s1.mp3 : perfect
        s2.mp3 : Good but monotonous
        pixiebay
        w5: delete it
        w4: to much delay..
        w3.mp3 : would work but required tesing
        w2: great but remove second beep


        */
        // document.getElementById("displayer").addEventListener("click",(e) =>{
        //     this.onclick();
        // })
        document.body.addEventListener("keydown",(e)=>{
            this.onclick(e);
        })
        
    }

    onclick(e){
        //shift / Control interfere with typing but is neccesary
        if (e.key == "Shift" || e.key == "Control"){
            return
        }
        let dispalyer = document.getElementById("displayer");
        let color = `<span style="color:green">`
        let spliter = `<span class="caret"></span>`;
        let str = dispalyer.innerHTML;
        //checking if it is intiall call
        if (this.charTyped == 0){
            this.phraselength = str.length-spliter.length;
            this.startTime = Date.now();
        }
        str = str.split(spliter);
        let fortext = str[1];
        let backtext = str[0];
        console.log(backtext);
        fortext = fortext.split("");
        // console.log(e.key)
        if (e.key == "Backspace"){
            if (backtext == "") return;
            backtext = this.getLastChar(backtext,spliter);
        }else if (fortext == ""){
            if (e.key == "Enter"){
                this.completed(e.key);
            }
            // alert("End has been reached");
            return
        }
        else if (e.key == fortext[0]){
            //the key is correct
            // this.wrongCount = 0;
            this.playSound(this.correctSound);
            fortext[0] = color+fortext[0]+ "</span>" + spliter;
        }else{
            //this key is wrong
            this.playSound(this.wrongSound);
            // if (this.wrongCount >=1) return;
            this.wrongCount += 1;
            color = `<span style="color:red">`
            fortext[0] = color+fortext[0]+ "</span>" + spliter;
        }
        //incrementing count and marking the begining
        this.charTyped ++;
        this.completed(fortext);
        dispalyer.innerHTML = backtext + fortext.join("");
        // console.log(str+"\n" +temp+ "  " + endIndex + "\n" + fortext.join(""))
    }

    completed(fortext){
        // fortext="ad0";
        if (fortext.length==1){
            this.endTime = Date.now();
            document.getElementById("continue-div").style.display = "flex";
            // document.writeln(`Character typed:  ${this.charTyped} Wrong Typed: ${this.wrongCount} Time taken ${(this.endTime-this.startTime)/1000} <br>
            // Phrase length: ${this.phraselength}`)
            this.saveStatistic();
        }else if (fortext == "Enter"){
            let a = document.createElement("a");
            a.href = "stats.html";
            document.body.appendChild(a);
            a.click();
        }
    }

    getLastChar(backtext,mode){
        backtext = backtext.split("<span");
        //extracting and removiing the last element
        let temp = backtext[backtext.length -1];
        // backtext = backtext.pop();
        backtext.pop();
        if (mode == "char") return temp.split(`">`)[1][0];
        else return backtext.join("<span") +mode+ temp.split(`">`)[1][0]
    }

    saveStatistic(){
        //Character typed: 53 Wrong Typed: 2 Time taken 0
// Phrase length: 49
        let correct = this.phraselength - this.wrongCount;
        let extra = this.charTyped - this.phraselength;
        let totat_time= (this.endTime-this.startTime)/1000; //insec
        let wpm_net = Math.round((correct/totat_time)*(60/5));
        let wpm = Math.round((this.charTyped/totat_time)*(60/5));
        let accuracy = Math.round((correct/this.charTyped)*100);
        console.clear();
        let curData = {
            "correct" : correct,
            "wrong" : this.wrongCount,
            "extra" : extra,
            "time" : totat_time,
            "wpm_net" : wpm_net,
            "wpm" : wpm,
            "accuracy":accuracy
        };
        console.log(curData);
        localStorage.setItem("dataPass",JSON.stringify(curData));
    }

    playSound(mode){
        if (this.sound){
            let sound = new Audio(mode);
            sound.play();
        }
    }
}