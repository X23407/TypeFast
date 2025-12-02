class main{
    constructor(){
        this.curPosirion = "1.0"
        this.correctSound = "s1.mp3";
        this.wrongSound = "c2.mp3";
        this.wrongCount = 0;
        this.sound =true;
        this.wrongChar = [];
        this.charTyped = 0;
        this.startTime=0;
        this.endTime =0;
        this.phraselength = 0;
        this.backspaceCount = 0;
        this.correctCount =0;
        this.random_lines = false;
        this.mode=localStorage.getItem("mode");//"default";
        this.dataHandler();
        this.timeBtn = false;
        this.buttonClick(this.mode);
        this.specialKey = {
                "ArrowLeft" : "←",
                "ArrowRight" : "→",
                "ArrowUp" : "↑",
                "ArrowDown" : "↓",
            }
        document.body.addEventListener("keydown",(e)=>{
            this.onclick(e);
        })
        
    }
    setting(){
        window.location.href = 'home.html';
    }

    onclick(e){
        //shift / Control interfere with typing but is neccesary
        console.log("clickec");
        if (e.key == "Shift" || e.key == "Control" || e.key == "CapsLock" ){
            return
        }else if(e.key =="Tab"){
            e.preventDefault();
            // window.location.reload();
            return;
        }
        e.preventDefault();
        // alert(e.key);
        let dispalyer = document.getElementById("displayer");
        let color = `<span class="correct">`
        let spliter = `<span class="caret"></span>`;
        let str = dispalyer.innerHTML;
        //checking if it is intiall call
        if (this.charTyped == 0){
            this.phraselength = str.length-spliter.length;
            this.startTime = Date.now();
            if (this.timeBtn){
                this.timeupdater();
            }
        }
        str = str.split(spliter);
        let fortext = str[1];
        let backtext = str[0];
        console.log(backtext);
        fortext = fortext.split("");
        fortext = this.specialCase(fortext);
        console.log(fortext);
        // console.log(e.key)
        // if (this.specialKey.hasOwnProperty(e.key)){
        //     alert(this.specialKey[e.key] + " "+e.key);
        // }
        if (e.key == "Backspace"){
            this.correctCount ++;
            this.backspaceCount ++;
            if (backtext == "") return;
            backtext = this.getLastChar(backtext,spliter);
        }else if (fortext == ""){
            if (e.key == "Enter"){
                this.completed(e.key);
            }
            // alert("End has been reached");
            return
        }
        else if (e.key == fortext[0] || (this.specialKey.hasOwnProperty(e.key)) && fortext[0] == this.specialKey[e.key]){
            this.correctCount ++;
            //the key is correct
            // this.wrongCount = 0;
            this.playSound(this.correctSound);
            fortext[0] = color+fortext[0]+ "</span>" + spliter;
        }
        else{
            //this key is wrong
            // this.wrongChar.unshift(this.getLastChar(backtext,"char"));
            // console.log(fortext[0]);
            console.log("wrong" + e.key+ "  "+fortext[0]+fortext[1]+fortext[2]);
            this.wrongChar.unshift(fortext[0]);
            this.playSound(this.wrongSound);
            // if (this.wrongCount >=1) return;
            this.wrongCount += 1;
            color = `<span class="wrong">`
            if (fortext[0] == "43554"){
                fortext[0] = color+"␣"+ "</span>" + spliter;
            }else{
                // fortext[0] = color+fortext[0]+ "</span>" + spliter;
                fortext[0] = color+fortext[0]+ "</span>" + spliter;
            }
        }
        //incrementing count and marking the begining
        this.charTyped ++;
        this.completed(fortext);
        dispalyer.innerHTML = backtext + fortext.join("");
        // console.log(str+"\n" +temp+ "  " + endIndex + "\n" + fortext.join(""))
    }

    specialCase(fortext){
        if (fortext[1] == "g" && fortext[2] == "t" && fortext[3] == ";" ){
            fortext.shift(); // removes &
            fortext.shift(); // removes g
            fortext.shift(); // removes t
            fortext.shift(); // removes ;
            fortext.unshift(">");
        }else if (fortext[1] == "l" && fortext[2] == "t" && fortext[3] == ";" ){
            fortext.shift(); // removes &
            fortext.shift(); // removes g
            fortext.shift(); // removes t
            fortext.shift(); // removes ;
            fortext.unshift("<");
        }else if(fortext[1]=="a" && fortext[2]== "m" && fortext[3] == "p" && fortext[4] == ";"){
            fortext.shift() // removes &
            fortext.shift() // removes a
            fortext.shift() // removes m
            fortext.shift() // removes p
            fortext.shift() // removes ;
            fortext.unshift("&");
        }
        // console.log(fortext);
        return fortext;
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
        /*temp.split(`">`)[1] = <char> + </span>
        &lt;</span>
        */ 
        // Done 
        temp = temp.split(`">`)[1];
        // console.log(temp +"Hello") //a</span>
        temp = temp.split('</span>');
        // console.log(temp[0] +"Hello") //a,Hello
        temp = temp[0];
        // if (temp.split('</span>')){

        // }
        if (mode == "char") return temp;
        else return backtext.join("<span") +mode+ temp;
    }

    saveStatistic(){
        let correct = this.correctCount;
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
            "time" : Math.round(totat_time),
            "wpm_net" : wpm_net,
            "wpm" : wpm,
            "accuracy":accuracy,
            "wrong_list" : JSON.stringify(this.wrongChar)
        };
        // localStorage.setItem("wrong_list" , JSON.stringify(this.wrongChar));
        localStorage.setItem("dataPass",JSON.stringify(curData));
        curData["total_typed"] = this.charTyped;
        console.log(curData);
    }

    playSound(mode){
        return;
        if (this.sound){
            let sound = new Audio(mode);
            sound.play();
        }
    }

    modeSelecter(){
        let text = "";
        let redirect = localStorage.getItem("redirect");
        // this.mode = "right";
        //localStorage.setItem("redirect","improve");
        console.log(redirect);

        /*-----MODE THAT AFFECT TEXT GENERATION--------*/
        if (redirect == 'improve'){
            text = "This is for improvement."
            text = this.improve();
            document.getElementById("displayer").innerHTML =  `<span class="caret"></span>`+ text;
            return;
            // alert("improvement");
            } else if(this.mode == "right"){
                while(text.length<200){
                    // text += this.rigth_words[Math.trunc(Math.random()*this.rigth_words.length)] + " "
                    text += this.left_hand_words[Math.trunc(Math.random()*this.left_hand_words.length)] + " "
                }
                text += this.left_hand_words[Math.trunc(Math.random()*this.left_hand_words.length)]
            }
            else if (this.mode == "code"){
                text = `${this.ultimate_lines[Math.round(Math.random()* this.ultimate_lines.length)]} ${this.ultimate_lines[Math.round(Math.random()* this.ultimate_lines.length)]}`// ${this.ultimate_lines[Math.round(Math.random()* this.ultimate_lines.length)]}`;
            }
            else{
                text = `${this.random_lines[Math.round(Math.random()* this.random_lines.length)]} ${this.random_lines[Math.round(Math.random()* this.random_lines.length)]}` //${this.random_lines[Math.round(Math.random()* this.random_lines.length)]}`;
            }

        /*-----MODE THAT AFFECT/ADD EXTRA CHAR TO GENERATED TEXT--------*/
        if (this.mode == "number"){
            text=text.split(" ");
            for (let i=0;i<text.length ;i++){
                text[i] += Math.round(Math.random()*10);
            }
            text = text.join(" ");
        }else if(this.mode == "punctuation"){
            text=text.split(" ");
            let punctuation  = [
                "@", "!", "`", "~", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=",
                "{", "}", "[", "]", "|", "\\", ":", ";", "\"", "'", ",", ".", "?", "/","←", "→", "↑" , "↓"
                ];
            for (let i=0;i<text.length ;i++){
                text[i] += punctuation[Math.trunc(Math.random()*punctuation.length)];
            }
            text = text.join(" ");
        }else if(this.mode =="relax"){
            text = text.toLowerCase();
            text = text.replaceAll(".","");
        }
        else if(this.mode == "custom"){
            //custom_mode
        }else if(this.mode == "arrow"){
            text=text.split(" ");
            let arrow = ["←", "→", "↑" , "↓"];
            for (let i=0;i<text.length ;i++){
                text[i] += arrow[Math.trunc(Math.random()*arrow.length)];
            }
            text = text.join(" ");
        }
        // text = `'unordered_map <int,string> um = {{1,\"A\"}};',`;
        // text = "← → ↑ ↓"
        document.getElementById("displayer").innerHTML =  `<span class="caret"></span>`+ text;
    }

    timeupdater(duration = 15000*2) {
        const interval = 1000; // run every 1 second
        let elapsed = 0;

        const thread = setInterval(() => {
            // console.log(`Thread running... ${elapsed / 1000}s`);
            //displaying
            document.getElementById("clock").innerHTML = `${30 - (elapsed / 1000)}s`
            elapsed += interval;
        }, interval);

        setTimeout(() => {
            clearInterval(thread);
            this.completed("1");
            this.completed("Enter");
            // alert("Ender");
        }, duration);
    }

    reset(id,mode){
        if (mode == "active"){
            const element = document.getElementById(id);
            element.classList.add("active");
            localStorage.setItem("mode",mode);
        } else{
            const element = document.getElementById(id);
            element.classList.add("active");
            localStorage.setItem("mode",mode);
        }
    }

    buttonClick(mode){
        this.mode = mode;
        // localStorage.setItem("redirect",false);
        let activeBtn = (id) => {
            const element = document.getElementById(id);
            element.classList.add("active");
            localStorage.setItem("mode",mode);
            // element.style.color = "cyan";
            // element.style.backgroundColor = "lightgrey";
        };
        let resetBtn = (id) => {
            const element = document.getElementById(id);
            // element.style.color = "black";
            element.classList.remove("active");
            // element.style.backgroundColor = "transparent";
        };

        let buttons = [
            "number",
            "punctuation",
            "time",
            "relax",
            // "custom",
            "code",
            "arrow",
        ]
        for (let i=0;i<buttons.length;i++){
            // if (buttons[i] == "time") this.timeBtn();
            if (mode == buttons[i]){
                activeBtn(buttons[i]);
                this.modeSelecter();
                if (mode == "time"){
                    this.timeFunction();
                }else if(mode=="custom"){
                    this.customFun();
                }
                // else if(mode=="boost"){
                //     this.boster_swapper()
                // }
            }
            else {
                resetBtn(buttons[i]);
            }
        }
    }

    customFun(){
        let text = prompt("Enter the character you want to practice");
        }
    
    improve(){
        let curData = localStorage.getItem("dataPass");
        curData = JSON.parse(curData);
        curData = JSON.parse(curData["wrong_list"]);
        let text = "";
        curData.forEach(element => {
            let choice = [4,5,6];
            let length = choice[Math.trunc(Math.random()*choice.length)];
            //monotonous
            for (let i=0;i<length;i++){
                text += element;
                if (i==length-1){
                    text += " ";
                }
                if (text.length > 150){
                    break;
                }
            }
        });
        //hybrid
        let hybrid = curData.length;
        if (hybrid < 5){
            hybrid = 5;
        }else if (length > 20){
            hybrid = 20;
        }
        for (let i=0;i<hybrid;i++){
            let choice = [4,5,6];
            let length = choice[Math.trunc(Math.random()*choice.length)];
            //monotonous
            for (let ii=0;ii<length;ii++){
                text += curData[Math.trunc(Math.random()*curData.length)]
            }
            text += " ";
        }
        console.log(curData);
        return text;
    }

    timeFunction(){
        if (!this.timeBtn){
            document.getElementById("clock").style.display = "inline-flex" ;
            document.getElementById("clock").innerText = "30s";
            this.timeBtn = true;
        }else{
            document.getElementById("clock").style.display = "none" ;
            document.getElementById("clock").innerText = "";
            this.timeBtn = false;
            
        }
    }

    dataHandler(){
        this.left_hand_words = [
"red","sad","fad","dad","bad","bed","bee","bar","bat","bag",
"cab","car","cat","cast","cart","care","case","cave","cafe","cage",
"rag","rat","rate","rave","raft","race","read","reed","reef","rear",
"tar","tea","tear","tab","tad","tav","tag","tax","tact","tart",
"war","ware","was","wax","wag","wad","wade","weed","week","weave",
"far","fat","fear","fast","fate","face","fact","fade","faze","fax",
"gas","gate","gag","gab","gar","gear","get","gave","gear","gaze",
"vet","vat","var","vast","vase","vac","vacate","vex","verb","verse",
"bear","beast","beastly","beat","beet","beer","bard","bare","base","bash",
"barge","barred","barter","barterer","barge","barr","barge","barely","ban","band",
"bandage","banded","bander","bandana","bang","bangs","banter","banterer","bantered","bast",
"batch","batched","baton","batter","battered","batterer","bar","bare","barest","barely",
"beg","beggar","begged","beggarer","begging","begged","begot","belt","belted","belter",
"bet","better","best","beast","beach","beached","beachy","beam","beamed","beamer",
"bread","bred","bree","breed","breeder","breeding","breast","breath","breather","breathing",
"creat","create","created","creator","crate","crater","crave","craved","craver","crazed",
"craze","crazer","crazing","craft","crafted","crafter","crafting","crafts","crab","crabby",
"scar","scare","scared","scarf","scarce","scavenge","scavenged","scavenger","scavenging","scab",
"scan","scanned","scanner","scanning","scant","scanter","scantest","scathe","scathed","scatter",
"seat","sear","searred","searling","seam","seamed","seamer","seaming","sean","sear",
"serf","serve","served","server","serving","servant","servants","serge","serfdom","serene",
"west","wear","wearer","wearing","wean","weaned","weaner","weave","weaver","weaved",
"waxer","waxing","waft","wafted","wafting","wafer","wafering","waffle","waffled","waffler",
"rest","rear","reader","reading","read","reared","reaper","reap","reaped","reaping",
"reef","refer","referred","referring","referent","referee","refeed","refeel","refeeling","reverb",
"tear","tease","teased","teaser","teasing","team","teamed","teaming","teal","teary",
"text","texter","texted","texting","tether","tethered","tethering","test","tested","tester",
"sea","seat","seated","seating","seam","seamer","seamy","seal","sealed","sealer",
"sadly","sadness","sadden","saddened","saddest","sand","sanded","sander","sanding","sandbar",
"saga","sag","sage","sager","sagest","savage","savaged","savager","saving","saved",
"draft","drafted","drafter","drafts","drag","dragged","dragger","dragging","drastic","drast",
"grace","graded","grader","grad","grade","gradual","gradually","grant","granter","granting",
"great","greater","greatest","grease","greased","greaser","greasing","green","greener","greenest",
"vet","vest","vessel","vesper","vex","vexed","vexing","vexer","verb","verge",
"zest","zester","zested","zesting","zag","zagged","zagging","zap","zapper","zapping",
"axe","axed","axer","axing","axle","axled","axler","axling","ava","aver",
"averred","avert","averted","averring","avatar","avast","abase","abased","abaser","abasing",
"weft","wefter","wefts","welt","welted","welter","welts","web","webbed","webber",
"brew","brewed","brewer","brewing","brev","breech","breezy","breach","breached","breacher",
"fret","fretter","fretted","fretting","free","freed","freer","freeing","freeze","freezer",
"tread","treader","treading","treat","treated","treaty","treats","tree","treed","treeless",
"crab","crabby","crabbed","crabbing","crave","craver","craving","creep","creeper","creeping",
"stab","stabbed","stabber","stabbing","star","stare","stared","staring","start","started",
"startle","startled","starter","starve","starved","starving","scarab","scarf","scarfed","scarred"
]

        this.rigth_words = [
"oil","ion","lip","lop","pop","pip","hip","hop","him","yum","yup","pin","pun","nun","nil","nun",
"nom","nip","kin","kim","jim","jin","jog","jog","jog","jog","jog",
"pol","poll","pill","pool","polo","polo","fill","film","folk","fold",
"look","loom","loop","loon","loll","lull","lull","moll","moll","moll",
"mill","milk","mimic","minim","minimum","million","minion","lining","linking","looming",
"pulp","pull","pupil","pillion","pillion","pillion","polling","polio","poly","polyp",
"mono","moon","mooning","moni","monin","monion","mononym","mononymic","monsoon","monsoonish",
"hook","hoop","honk","honk","honk","hull","hull","hulk","hulkish","hullo",
"julip","julip","jillion","jillionth","jinn","jinnee","jinxed","jinxy","junky","junk",
"punk","punny","punion","punium","punning","pollution","pollute","polluted","polluter","pollux",
"ill","illinium","ilium","ilium","illini","iliumic","illogical","illogic","illogically","illogicalism",
"inn","inning","innominate","innominal","innominity","innomium","innominous","innuendo","innuic","innumer",
"kilo","kill","killing","killjoy","kink","kinky","kinkily","kinkiness","king","kingly",
"lingo","ling","lingual","linguini","linguistics","linguist","lingua","lining","linin","linny",
"monoic","monic","monism","monistic","monition","monitor","monitoring","moniker","monkey","monk",
"ploy","ploys","ploying","ployment","plonk","plonked","plonker","plonking","plonkiness","plump",
"ploying","plume","pluming","plumage","plumb","plumbing","plumbline","plumbly","plume","pluming",
"holly","honk","honing","holing","holism","holistic","hologram","holograph","holographic","holonym",
"polyphonic","polyphony","polyphonyic","polyomino","polynomial","polygonic","polygon","polylingual","polylingually","polylingualism",
"yumminess","yummy","yummily","yummiest","yoking","yolk","yolkless","yokel","yokeling","yokelish",
"nook","nookie","nooking","nookish","noon","nooning","noonish","noonlike","noonly","non",
"nonillion","nonillionth","nonionic","noni","nonn","nonnic","nonlingual","nonlink","nonlocal","nonmimic",
"pill","pilling","pillage","pillaged","pillager","pillaging","pillory","pilloried","pillorize","pillow",
"pillowly","pillowiness","pillowlike","pillowcase","pillowy","pilo","piloni","pilonic","piloting","pilot",
"pilotless","pilotlike","pilotship","pilotfish","pilotman","pilomotor","pilous","pious","piously","piousish",
"mium","mim","mimicry","mimicked","mimicker","mimicking","miming","mimish","mimosa","mim",
"limp","limply","limpid","limping","limpness","limpnesses","limpidly","limpidness","limpidities","limbus",
"limbo","limboing","limbous","limbousness","limn","limning","limner","limners","limnic","liminality",
"pony","ponying","ponyish","ponyism","ponyling","ponylike","ponylion","ponylon","ponym","ponymic",
"loop","looping","loopy","loopyish","loopiness","loopline","looplike","loopless","loopfull","loopingness",
"lollipop","lollipopping","lollipoplike","lollipopman","lolling","lollingly","lollying","lolled","loller","lollish",
"polonium","polonial","polonist","polonizing","polonialism","poloniality","poloni","polonius","polonially","polonize",
"monolith","monolithic","monolithically","monolithism","monolingual","monolingually","monolingualism","monomy","mononymy","monomyth",
"holonymy","holonymic","holonymical","holonymically","holonomic","holon","holonic","holonism","holonist","holonify"
]

        this.ultimate_lines = [
        // # -----------------------------------------------------------
        // # 🟦 1. PURE C++ CODE (100 LINES)
        // # -----------------------------------------------------------
        `for(int i=0; i<100; ++i){ std::cout << i << \",\"; }`,
        "std::vector<int> v = {1,2,3,4}; for(auto &x : v){ x*=2; }",
        `if(ptr == nullptr){ throw std::runtime_error(\"Null\"); }`,
        "try{ func(); } catch(const std::exception& e){ std::cerr << e.what(); }",
        "int* arr = new int[n]; for(int i=0;i<n;i++){ arr[i]=i*i; } delete[] arr;",
        `std::string s = (flag ? \"YES\" : \"NO\");`,
        "while((c = getchar()) != EOF){ buffer.push_back(c); }",
        "switch(code){ case 200: ok(); break; default: err(); }",
        "auto lambda = [&](int x){ return x%2==0 ? x/2 : x*3+1; };",
        "struct Node{ int x; Node* next; };",
        "template<typename T> void swapT(T& a, T& b){ T t=a; a=b; b=t; }",
        "std::unique_ptr<int> p = std::make_unique<int>(42);",
        "for(size_t i=0; i<vec.size(); ++i){ vec[i] += 1; }",
        `if(a<b && b<c){ std::cout<<\"Chain\"; }`,
        "int x = (a>b ? a-b : b-a);",
        `std::map<std::string,int> mp = {{\"A\",1},{\"B\",2}};`,
        "for(const auto &p : mp){ std::cout << p.first << p.second; }",
        "std::array<int,5> arr = {1,2,3,4,5};",
        "do{ i++; }while(i<10);",
        `fstream f(\"data.txt\", ios::in|ios::out);`,
        `if(!(std::cin >> x)){ std::cerr<<\"ERR\"; }`,
        "enum Color{RED=1,BLUE=2,GREEN=3};",
        "int* p = new int(10); delete p;",
        `std::cout << \"Value:\" << *p << \"\\n\";`,
        "vector<vector<int>> m(3, vector<int>(3,0));",
        "int y = static_cast<int>(3.14);",
        "Foo* f = new Foo(); f->bar(); delete f;",
        "for(int i=10; i-->0;){ std::cout<<i; }",
        `if((x&1)==1){ std::cout<<\"odd\"; }`,
        "int res = (a|b) & (~c);",
        "std::cout << std::setw(5) << num;",
        "std::sort(v.begin(), v.end(), [](int a,int b){ return a>b; });",
        "std::reverse(v.begin(), v.end());",
        `std::string s=\"abc\"; s.insert(1,\"XYZ\");`,
        `for(char c : s){ std::cout<<c<<\"-\"; }`, 
        "if(a==b && b==c){ doSomething(); }",
        "std::vector<int> a(10, 0);",
        "Node* head = nullptr; head = new Node{10,nullptr};",
        "std::stack<int> st; st.push(10); st.pop();",
        "int r = rand()%100;",
        "int mat[3][3] = {{1,2,3},{4,5,6},{7,8,9}};",
        "std::priority_queue<int> pq; pq.push(5);",
        "for(int i=0;i<lines.size();++i){ cout<<lines[i]; }",
        "if((x>=0 && x<=9) || (y<0)){ run(); }",
        `fstream file(\"log.txt\", ios::app); file<<\"NEW\";`,
        `std::tuple<int,string,bool> t = {1,\"abc\",true};`,
        "auto [a2,b2,c2] = t;",
        "shared_ptr<int> sp = make_shared<int>(99);",
        "weak_ptr<int> wp = sp;",
        `const char* msg = \"Hello\";`,
        "long long L = 1234567890123LL;",
        `double d = std::stod(\"3.14\");`,
        `string hexV = \"0xFA\";`,
        "int mask = 0b101010;",
        "cout<<((val>>1)&1);",
        "vector<int> out; copy(v.begin(),v.end(),back_inserter(out));",
        "for(auto it=v.rbegin(); it!=v.rend(); ++it){ cout<<*it; }",
        "mutex m; m.lock(); m.unlock();",
        "thread t1(print); t1.join();",
        "condition_variable cv; unique_lock<mutex> lk(m);",
        "cv.wait(lk,[]{return ready;});",
        "int x2 = std::min(a,b);",
        "for(int i=0;i<5;++i){ for(int j=0;j<5;++j){ cout<<i*j; } }",
        `cout<<\"Sum=\"<<accumulate(v.begin(),v.end(),0);`,
        "vector<int> v2; v2.reserve(100);",
        "int* p2 = reinterpret_cast<int*>(ptr);",
        "ofstream outF(\"data.bin\", ios::binary);",
        "queue<int> q; q.push(1); q.pop();",
        "deque<int> dq = {1,2,3}; dq.push_front(0);",
        "set<int> ss = {4,2,1,3};",
        'unordered_map <int,string> um = {{1,\"A\"}};',
        "if(auto it = um.find(1); it != um.end()){ cout<<it->second; }",
        `bool ok = regex_match(str, regex(\"[A-Za-z]+\"));`,
        `ifstream in(\"inp.txt\"); string line;`,
        "cout<<fixed<<setprecision(3)<<pi;",
        `inline int add(int a,int b){ return a+b; }`,
        "constexpr int N=100;",
        `char buf[256]; sprintf(buf,\"%d\",num);`,
        "for(auto &x : arr){ x+=10; }",
        "array<int,3> ar = {7,8,9};",
        "int z = ++counter;",
        `if((a^b)==0){ cout<<\"same\"; }`,
        "int k = (flag)?1:0;",
        "vector<int> even; copy_if(v.begin(),v.end(),back_inserter(even),[](int n){return n%2==0;});",
        "transform(v.begin(),v.end(),v.begin(),[](int n){return n*2;});",
        "char ch = static_cast<char>(65);",
        "if(error) return EXIT_FAILURE;",
        "Node* cur = head; while(cur){ cur=cur->next; }",
        "for(int &i : v){ i = i<0 ? -i : i; }",
        "multiset<int> ms = {3,3,1};",
        `try{ throw 5; } catch(int e){ cout<<\"INT\"; }`,
        "int arr3[5] = {0};",
        "bool st = std::isalnum(c);",
        "cout<<\"0x\"<<std::hex<<255;",
        "string rev = string(s.rbegin(), s.rend());",

        // # -----------------------------------------------------------
        // # 🟩 2. OTHER LANGUAGES (30 LINES)
        // # -----------------------------------------------------------
        `print(\"Hello World\", x*2)  # Python`,
        "nums = [i for i in range(10) if i%2==0]  # Python",
        "def foo(a,b=0): return a+b*2  # Python",
        `my_dict = {\"a\":1,\"b\":2}  # Python`,
        "lambda x: x**2 + 1  # Python",
        `import os; os.system(\"echo hi\")`,
        "console.log(a > b ? a : b);  // JS",
        `let obj = {name:\"X\", val:42}; // JS`,
        "const arr = [...data]; // JS",
        `if(a===b){ console.log(\"eq\"); } // JS`,
        "function test(x){ return x*x; } // JS",
        "public class Main{ public static void main(String[]a){ System.out.println(42); }}",
        "int[] arr = {1,2,3,4};  // Java",
        `String s = \"Hello\" + name;  // Java`,
        "HashMap<String,Integer> hm = new HashMap<>();",
        `System.out.println(x==10 ? \"Yes\" : \"No\");`,
        "val list = listOf(1,2,3)  // Kotlin",
        "fun add(a:Int,b:Int)=a+b  // Kotlin",
        'print(\"Sum = ${a+b}\") // Kotlin',
        `echo \"Hello\"; // PHP`,
        "$arr = array(1,2,3); // PHP",
        "my $x = 42; print $x; # Perl",
        `puts \"Hello #{name}\" # Ruby`,
        "total = list.sum() # Ruby",
        "SELECT * FROM users WHERE id=1;",
        "UPDATE users SET name='X' WHERE id=2;",
        "echo $(ls | wc -l) # Bash",
        "sed 's/x/y/g' file.txt",
        "awk '{print $1,$2}' file",
        `grep -E \"[0-9]+\" logs.txt`,

        // # -----------------------------------------------------------
        // # 🟧 3. TERMINAL / GIT / LINUX / API (20 LINES)
        // # -----------------------------------------------------------
        `git commit -m \"Fix: memory-leak @ pointer\"`,
        "git push origin main --force",
        "git checkout -b feature/x99",
        "git merge --no-ff dev",
        `git stash save \"temp_work\"`,
        "curl -X GET https://api.example.com/user?id=42",
        `curl -H \"Auth: Bearer TOKEN\" -d '{\"x\":1}'`,
        "curl -X DELETE https://api.site.com/x/7",
        "ls -la /etc/config/",
        "chmod 755 ./run.sh",
        "sudo apt-get update && sudo apt-get upgrade -y",
        "tar -czvf backup.tar.gz ./project",
        "systemctl restart nginx",
        "docker run -it ubuntu bash",
        "ping -c 4 google.com",
        "wget https://example.com/file.zip",
        "kill -9 1234",
        "top -o cpu",
        "ssh user@192.168.1.10",
        `grep -rn \"error\" ./logs/`,

        // # -----------------------------------------------------------
        // # 🟪 4. MEANINGFUL SPECIAL-CHARACTER SENTENCES (50 LINES)
        // # -----------------------------------------------------------
        `The server returned code 503, and he muttered: \"Not again...\"`,
        `She typed \"rm -rf /??\" as a joke, but nobody laughed.`,
        "The dashboard flashed ***WARNING-42*** before going silent.",
        "He saved the file as config_v2.7-final@2025!",
        "A strange bug printed 'null??' instead of the username.",
        "The phone buzzed with #404 notifications in 3 minutes.",
        "Her password looked like 'A7$d!Q9#x2', yet she forgot it.",
        "He whispered: \" Did you just delete main.cpp?\"",
        "The script returned {status:false, err:\"X99-FATAL\"}.",
        "A random beep echoed after pressing Ctrl+Shift+7.",
        "He renamed the folder 'project_v5_final_final_REAL'.",
        "The popup displayed: \"Error >> Unknown token '<>'\".",
        "Her system clock jumped from 12:59 -> 00:00 unexpectedly.",
        "The file 'data_01$$.log' kept regenerating mysteriously.",
        "He received 17 emails titled '#URGENT#-FixThis!!'.",
        "The robot replied with a cheerful 'beep-beep-007!'.",
        "Her WiFi password was literally 'dont_ask_123!'.",
        "The equation 7*9=63 popped into his head randomly.",
        "The window title read: \"LOADING... 99% >>>\" forever.",
        "He screamed when the build said \"FAILED @ 98%\".",
        "The terminal spat out '$$$ segmentation fault $$$'.",
        "Someone wrote 'TODO??' in every function.",
        "The config key 'alpha.zeta.delta' stopped working.",
        "The counter jumped from #19 to #3000 instantly.",
        "He saw the note: \"Reboot? (y/N)\" and panicked.",
        "The temperature sensor showed '88C!! warning!'.",
        "The message ended with '@@@ END OF FILE @@@'.",
        "Her keyboard typed '/////////////////' by itself.",
        "The clock blinked '12:34:56##' repeatedly.",
        "He found the comment '// why does this work?'.",
        "The bot posted '###WELCOME###' to every channel.",
        "The screen displayed '<NULL_OBJECT:0xFF00>'.",
        "The alert said \"Backup OK!  Time: 04:17\".",
        "She labeled the drive 'DANGER_ZONE_2.0'.",
        "He heard the PC fan spin at 9000rpm??!",
        "A sticky note read: \"Fix bug #77 before 5pm\".",
        "The log printed '[WARN-X]: unstable voltage'.",
        "He renamed the file to 'notes(3)@final.txt'.",
        "The alarm blared: \"CODE-RED ###\".",
        "The phone displayed  'Notification x 44'.",
        "She typed ;) , :) into the terminal accidentally.",
        "The counter overflowed into '999999->000000'.",
        "The sign read: 'AUTHORIZED_PERSONNEL_ONLY!'.",
        "The old monitor flickered '##NO SIGNAL##'.",
        "He tagged the message '@admin PLEASE HELP!!'.",
        "The bot answered '42 <heart>' for everything.",
        "The elevator button panel flashed '^v^v^v'.",
        "The weather app said '31C ~ feels like 45C '.",
        "The terminal printed '>>> PROCESS COMPLETE ~ ~ ~'.",
        "The fridge WiFi name was literally '404-NOT-FOUND'.",
        "The toaster beeped 'BEEP-777' for no reason."
        ]

        this.random_lines = [
                "The quick brown fox jumps over the lazy dog.",
                "Raindrops tapping softly against the window pane.",
                "A sudden breeze carried the scent of jasmine.",
                "Coding late at night feels oddly peaceful.",
                "The library was silent except for turning pages.",
                "A cat stretched lazily under the warm sunlight.",
                "He scribbled notes furiously before the deadline.",
                "The mountain peaks glowed orange at sunrise.",
                "Music echoed faintly through the empty hallway.",
                "She smiled as the puzzle pieces finally fit.",
                "A lantern flickered in the quiet village street.",
                "The aroma of coffee filled the small cafe.",
                "Stars shimmered brightly in the midnight sky.",
                "The old typewriter clacked with rhythmic precision.",
                "A gentle ripple spread across the calm lake.",
                "The train whistle signaled its departure at dawn.",
                "He found a hidden key beneath the rug.",
                "The festival lights sparkled in every color.",
                "A forgotten diary lay covered in dust.",
                "The clock ticked steadily, marking each passing second.",
                "Soft thunder rolled across the distant hills.",
                "Fresh paint filled the air with a sharp scent.",
                "A lone bicycle leaned against the brick wall.",
                "Warm bread cooled on a kitchen counter.",
                "Fireflies drifted lazily above the tall grass.",
                "The old radio crackled back to life.",
                "A paper boat floated gently down the stream.",
                "Dust swirled in golden beams of sunlight.",
                "Wind chimes sang in the passing breeze.",
                "A notebook lay open, its pages half-filled.",
                "Snowflakes melted instantly on her palm.",
                "The candle flame danced wildly for a moment.",
                "A distant owl hooted in the quiet night.",
                "The teapot whistled cheerfully on the stove.",
                "Footprints trailed off into the soft sand.",
                "He tightened his scarf as the cold wind blew.",
                "The elevator dinged softly at each floor.",
                "A kite fluttered high above the beach.",
                "The classroom buzzed with low chatter.",
                "Leaves rustled gently along the sidewalk.",
                "The pastry crumbled perfectly at each bite.",
                "A rainbow arched boldly across the sky.",
                "The old dog wagged its tail slowly.",
                "A cool mist hovered above the valley.",
                "The candle dripped wax onto the table.",
                "A mailbox creaked as it opened.",
                "The seedlings sprouted after last night’s rain.",
                "A car horn echoed faintly down the street.",
                "The blanket felt warm against the winter chill.",
                "The mirror reflected a soft morning glow.",
                "He hummed a tune without realizing.",
                "The lake reflected the moon like glass.",
                "A soft purr rumbled from the kitten.",
                "The spiral staircase wound upward endlessly.",
                "A pencil rolled off the desk silently.",
                "The ocean waves sparkled beneath the sun.",
                "The old bridge groaned under each step.",
                "Bubbles drifted upward in the sunlight.",
                "The stopwatch clicked to a sudden halt.",
                "Morning dew shimmered on each blade of grass.",
                "The wooden floor creaked beneath his boots.",
                "A seagull screeched overhead as it passed.",
                "The bakery door chimed as she walked in.",
                "The clouds parted to reveal a bright moon.",
                "An old postcard lay tucked inside a book.",
                "The fountain splashed lightly in the courtyard.",
                "He brushed sand off his shoes.",
                "A pair of glasses rested on the dusty shelf.",
                "The wind howled past the narrow alley.",
                "The cozy cabin smelled of pinewood.",
                "Raindrops clung to the glass like tiny jewels.",
                "The engine sputtered before roaring awake.",
                "A butterfly hovered for a brief moment.",
                "The clock tower chimed across the square.",
                "A gentle knock echoed through the hallway.",
                "Fire crackled merrily in the hearth.",
                "The swing creaked as it moved slowly.",
                "He tucked the letter into his pocket.",
                "A sparkler fizzed brightly under the night sky.",
                "The compass needle quivered.",
                "Soft fabric brushed against her hand.",
                "A suitcase thudded onto the floor.",
                "The lifeguard's whistle pierced the air.",
                "A map fluttered in the wind.",
                "The curtains billowed outward.",
                "A pigeon cooed from the rooftop.",
                "He sipped tea thoughtfully.",
                "A mushroom sprouted under the oak tree.",
                "The bench was still damp from rain.",
                "A quiet hum filled the workshop.",
                "The spotlight illuminated the empty stage.",
                "A paperclip snapped in half.",
                "The forest floor crackled underfoot.",
                "A feather drifted downward slowly.",
                "Her bracelet jingled as she walked.",
                "The room smelled faintly of lavender.",
                "A coin spun loudly on the table.",
                "The clouds darkened before the storm.",
                "A shoelace dragged loosely behind him.",
                "The attic was thick with cobwebs.",
                "She closed her umbrella with a shake.",
                "A fox darted across the snowy path.",
                "A candlewick glowed red before fading.",
                "The ferris wheel turned lazily.",
                "A gentle cough echoed in the hallway.",
                "The chalk squeaked across the board.",
                "A scarf fluttered behind her.",
                "Cold air seeped through the window crack.",
                "A puddle reflected the neon lights.",
                "The doorknob felt unusually warm.",
                "A kite string tangled in the branches.",
                "The field rustled with hidden insects.",
                "A spoon clattered into the sink.",
                "The tram bell rang sharply.",
                "Her shadow stretched across the ground.",
                "A whisper drifted from the next room.",
                "The walkway shimmered after rainfall.",
                "A mailbox flag bobbed up and down.",
                "The cobblestones were slick with rain.",
                "The horizon glowed faintly at dusk.",
                "A raven perched on the fence.",
                "The soda fizzed loudly when opened.",
                "A wooden flute lay beside the fire.",
                "The windmill blades turned slowly.",
                "The staircase spiraled downward.",
                "A small flame flickered dangerously.",
                "The motorcycle roared past.",
                "A daisy swayed gently in the breeze.",
                "The coin purse jingled faintly.",
                "A thin fog crawled across the field.",
                "The kettle bubbled softly.",
                "A newspaper rustled in the wind.",
                "The night air carried distant laughter.",
                "The old gate screeched open.",
                "A lantern glowed softly in the dark.",
                "The paintbrush glided smoothly.",
                "A squirrel darted up the tree.",
                "The bakery smelled heavenly.",
                "A trolley rattled down the tracks.",
                "The window latch clicked shut.",
                "A paper crane sat on the table.",
                "Snow crunched under their boots.",
                "The suitcase zipper jammed.",
                "The forest echoed with distant birds.",
                "A leaf skittered across the pavement.",
                "The projector whirred quietly.",
                "A dog barked in the distance.",
                "The elevator hummed upward.",
                "A sleepy yawn filled the room.",
                "The streetlamp flickered on.",
                "A breeze tugged at his collar.",
                "The library card slipped from her hand.",
                "A small frog leapt into the pond.",
                "The fountain lights shimmered.",
                "A violin note hung in the air.",
                "The floor tiles felt cool.",
                "A distant train rumbled.",
                "The clouds glowed pink at sunset.",
                "A lone star shone brightly.",
                "The river flowed steadily onward.",
                "A moth tapped against the lampshade.",
                "The breadknife scraped the cutting board.",
                "A soft sneeze broke the silence.",
                "The bell tower loomed overhead.",
                "A pencil snapped mid-sentence.",
                "The pond rippled as fish swam beneath.",
                "A gentle breeze rustled the curtains.",
                "The stove hissed as it heated.",
                "A cat pawed at the edge of the pillow.",
                "The lantern's glass clinked softly.",
                "A clock chimed from across town.",
                "The reeds whispered in the wind.",
                "A sparrow hopped across the fence.",
                "The chair wobbled slightly.",
                "A beam of light pierced the clouds.",
                "The aroma of spices filled the room.",
                "A branch snapped somewhere nearby.",
                "The ocean breeze tasted salty.",
                "A crumpled note lay abandoned.",
                "The playground sat empty and still.",
                "A candle guttered in the wind.",
                "The shadows danced across the wall.",
                "A squirrel chattered angrily.",
                "The tap dripped rhythmically.",
                "A crow cawed overhead.",
                "The page turned with a soft rustle.",
                "A backpack thudded onto the floor.",
                "The screen glowed in the dark.",
                "A violin case rested against the wall.",
                "The street grew quiet after midnight.",
                "A pebble skipped across the water.",
                "The fountain's spray sparkled like diamonds.",
                "A leaf floated gently downward.",
                "The cat hissed at a passing dog.",
                "A whisper of wind brushed the treetops.",
                "The chandelier glimmered in the light.",
                "A gentle sigh escaped her lips.",
                "The floor was cool beneath bare feet.",
                "A lone balloon drifted skyward.",
                "The rooftop glinted in the sun.",
                "A twig snapped beneath his boot.",
                "The bookstore smelled of old paper.",
                "A slow drip echoed in the cave.",
                "The berries glistened with dew.",
                "A distant bell echoed faintly.",
                "The blanket wrapped snugly around him.",
                "A lantern bobbed along the street.",
                "The old clock pendulum swung lazily.",
                "A raindrop ran down the window.",
                "The daffodils waved in the wind."
            ]

    }
}