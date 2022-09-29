var coinsArr;//מערך של כל המטבעות
var modalStr;
var coinsDataPick = [];
var coinsIdArr = [];// מערך של המטבעות שבתצוגה
var chosenCoin = {};//המטבע שנלחץ לעוד אינפורמציה
var coinsToTRack = [];//מערך של מטבעות שרוצים לעקוב אחריהם
var coinClass = [];//מערך של ה class של המטבע שנבחר
var inner = document.getElementById('example');//לאיפה אני מכניסה בתצוגה
//הinput של החיפוש
const myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('spinner'));
const myModal2 = bootstrap.Modal.getOrCreateInstance(document.getElementById('exampleModalToggle'));
const searchNow = document.getElementById('searchNow');//כפתור החיפוש
const home = document.getElementById('home');
const liveReport = document.getElementById('Live Report');
const about = document.getElementById('about');
home.addEventListener('click', homePage);
liveReport.addEventListener('click', goLive);
about.addEventListener('click', goAbout);
const limitTime = 120;
var index;//הdataset
var x;//הכרטיס שלחץ
var index1;//הdataset
var x1;//הכרטיס שלחץ
const getCoins = () => {//מביא את כל המטבעות
    cleanHtml(inner);
    fetch('./data/coins.json')
        .then(res => res.json())
        .then(data => coinsArr = data)
        .then(res2 => {
            for (let i = 0; i < 100; i++) {
                coinsIdArr.push(res2[i]);
                renderToHtml(res2[i], i);
            }
        });
}
getCoins();
const more = (event) => {//כשלוחצים על עוד אינפורמציה
    myModal.show();
    let x = event.target.dataset.id;
    let coinMoreInfo = document.getElementById(x);
    let temp = coinsIdArr[x].id;
    coinClass = [];
    for (let i = 0; i < coinMoreInfo.classList.length; i++)
        coinClass.push(coinMoreInfo.classList[i]);
    if (coinClass.indexOf('open') == -1) {
        if (CACHE[temp] && (new Date - CACHE[temp].fetchTimestamp) / 1000 < limitTime) {
            getMoreIntoHtml(coinMoreInfo, CACHE[temp]);
            myModal.hide();
        }
        else {
            fetch(`https://api.coingecko.com/api/v3/coins/${coinsIdArr[x].id}`)
                .then(res => res.json())
                .then(resj => {
                    CACHE[temp] = new Coin(resj);
                    getMoreIntoHtml(coinMoreInfo, CACHE[temp]);
                    myModal.hide();
                });
        }
        coinMoreInfo.classList.add('open');

    }
    else {
        cleanHtml(coinMoreInfo);
        coinMoreInfo.classList.remove('open');
        myModal.hide();
    }
}
searchNow.addEventListener('click', searchMe);
function searchMe() {//פונקציית החיפוש
    myModal.show();
    var search = document.getElementById('search').value;
    if (search != undefined) {
        cleanHtml(inner);
        document.getElementById('search').value = "";
        const filtrered = (coinsIdArr.filter(c => (c.symbol == search)))[0];
        if (filtrered != undefined) {
            let index = coinsIdArr.indexOf(filtrered);
            renderToHtml(coinsIdArr[index], index);
            myModal.hide();
        }
        else {
            myModal.hide();
            inner.innerHTML =
                `<p class="white">
           No Coins Found
        </p>`;
        }
    }

    else {
        myModal.hide();
        inner.innerHTML =
            `<p class="white">
           No Coins Found
        </p>`;
    }

}

function track(event) {//פונקציית מעקב
    index = event.target.dataset.pick;
    x = document.getElementById(`track+${index}`);
    let elementClassas = [];
    for (let i = 0; i < x.classList.length; i++) {
        elementClassas.push(x.classList[i]);
    }
    if (elementClassas.indexOf('turn') == -1) {
        if (coinsToTRack.length < 5) {
            coinsDataPick.push(index);
            coinsToTRack.push(coinsArr[index]);
            x.classList.add('turn');
        }
        else {
            index1 = event.target.dataset.pick;
            x1 = document.getElementById(`track+${index1}`);
            document.querySelectorAll('.myButton').forEach(b => b.disabled = true);
            x.checked = false;
            buildModal()
        }
    }
    else {
        x.classList.remove('turn');
        let c = coinsToTRack.indexOf(coinsIdArr[index]);
        coinsToTRack.splice(c, 1);
        coinsDataPick.splice(c, 1);
    }


}

function goLive() {//שלוחצים לLive
    cleanHtml(inner);
    if (coinsToTRack.length != 0) {
        for (let i = 0; i < coinsToTRack.length; i++) {
            inner.innerHTML += `
        <table>
        <thead>
            <tr>
                <th>Chosen Coin:</th>
            </tr>
        </thead>  
        <tbody>
            <tr>
                <td style="color: white;">${coinsToTRack[i].name}</td>    
            </tr>
        </tbody>
    </table>`

        }
    }
    else {
        inner.innerHTML =
            `<p class="white">
           No Coins Found
        </p>`;
    }



}
function goAbout() {//כשלוחצים על about
    myModal.show();
    inner.innerHTML =
        `<p class="white">
            My name is osant dayan, im 19.5 years old and this is my second project.<br>
            This project is like digital coins app which give you the option to see each<br>
            coin image and current values in 3 diffrent currencies:USD,ERU,ILS.<br>
            This app also provide "search coin by name" and "live track" abilities.<br>
        </p>`;
    myModal.hide();
}
function homePage() {
    getCoins();
}

function getMoreIntoHtml(element, myObj) {//שם ב html את האינפורמציה הנוספת
    element.innerHTML += `
                     <img src="${myObj.image.thumb}">
                    <div>${myObj.market_data.current_price.ils + `₪`}</div>
                    <div>${myObj.market_data.current_price.usd + `$`}</div>
                    <div>${myObj.market_data.current_price.eur + `€`}</div>`;


}
function renderToHtml(obj, i) {//מכניס מטבעות ל html
    let x = obj.symbol;
    let y = coinsToTRack.filter(c => c.symbol == x);
    if (coinsToTRack.indexOf(y[0]) == -1) {
        inner.innerHTML += `<div  class="col">
                    <div class="card" style="width: 18rem;">
                    <div class="card-body">
                    <h5 class="card-title">${obj.symbol}</h5>
                    <span> 
                    <div class="form-check form-switch">
                    <input onclick="track(event)" id="track+${i}" data-pick=${i} class="form-check-input myButton" type="checkbox" id="flexSwitchCheckDefault">
                    </div></span>
                    <p class="card-text">${obj.name}</p>
                    <button data-id="${i}" onclick="more(event)" class="btn btn-primary">More Info</button>
                    <div class="one" id="${i}"></div>
                    </div>
                     </div></div>`
    }
    else {
        inner.innerHTML += `<div  class="col">
                    <div class="card" style="width: 18rem;">
                    <div class="card-body">
                    <h5 class="card-title">${obj.symbol}</h5>
                    <span> 
                    <div class="form-check form-switch">
                    <input onclick="track(event)" id="track+${i}" data-pick=${i} class="form-check-input myButton turn"  checked type="checkbox" id="flexSwitchCheckDefault">
                    </div></span>
                    <p class="card-text">${obj.name}</p>
                    <button data-id="${i}" onclick="more(event)" class="btn btn-primary">More Info</button>
                    <div class="one" id="${i}"></div>
                    </div>
                     </div></div>`
    }

}
function cleanHtml(a) {//מנקה את הhtml
    a.innerHTML = "";
}




function buildModalStr() {//בונה את המחרוזת להכניס למודל
    modalStr = "";
    for (let i = 0; i < coinsToTRack.length; i++) {
        modalStr += `<div class="col">
        <div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${coinsToTRack[i].symbol}</h5>
                <span>
                    <div class="form-check form-switch">
                        <input onclick="track(event)" id="track+${coinsDataPick[i]}" data-pick=${coinsDataPick[i]} class="form-check-input myButton turn" type="checkbox" checked id="flexSwitchCheckDefault">
                    </div></span>
                <p class="card-text">${coinsToTRack[i].name}</p>
                <div class="one" id="${coinsDataPick[i]}"></div>
            </div>
        </div></div>`
    }
    return modalStr;
}
function buildModal() {//בונה את המודל בעצמו
    document.getElementById('mBody').innerHTML = buildModalStr();
    myModal2.show();

}

function back() {
    myModal.show();
    if (coinsToTRack.length == 2) {
        document.querySelectorAll('.myButton').forEach(b => b.disabled = false);
        coinsDataPick.push(index1);
        coinsToTRack.push(coinsArr[index1]);
        x1.classList.add('turn');
        x1.checked = true;
    }
    homePage();
    myModal.hide();
}
