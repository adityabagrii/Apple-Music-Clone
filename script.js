let currSong = new Audio();
console.log(window.innerWidth)
async function getSongs() {
    let a = await fetch('/Apple%20Music%20Clone/songs/');
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith('.m4a')) {
            songs.push(element.href);
        }
    }
    return songs;
}

async function getCovers() {
    let a = await fetch('/Apple%20Music%20Clone/covers/')
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let covers = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith('.webp')) {
            covers.push(element.href);
        }
    }
    return covers;
}

function createCard(song, cover) {
    let html = `<div class="card">
                    <svg class="playBtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="rgba(77, 77, 77, 0.8)" />
                        <polygon points="35,25 35,75 75,50" fill="#fff" />
                    </svg>
                    <img src=${cover} class="albumCover">
                    <h3 class="cardTitle">${song.split("/songs/")[1].replace(/%20/g, " ").slice(0, -4).split(' - ')[1]}</h3>
                    <p class="cardDesc">${song.split("/songs/")[1].replace(/%20/g, " ").slice(0, -4).split(' - ')[0]}</p>
                </div>`;
    return html;
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid Input";
    }

    const mins = Math.floor(seconds / 60);
    const remainingSecs = Math.floor(seconds % 60);

    const formattedMins = String(mins).padStart(2, "0");
    const formattedSecs = String(remainingSecs).padStart(2, "0");

    return `${formattedMins}:${formattedSecs}`;
}

function playSong(song, songs, covers) {
    let songName = song.replace(/ /g, "%20");
    for (let i = 0; i < songs.length; i++) {
        if (songs[i].includes(songName)) {
            currSong.src = songs[i];
            document.querySelector('.Track').innerHTML =
                `<div class="trackImage" style="padding: 0">
                                                        <img src=${covers[i]} class="trackicn">
                                                        </div>
                                                        <div class="trackInfo justify-content align-items" style="padding-top: 2%;">
                                                            <div class="TrackName" style="display: flex; justify-content: center; align-items: center;font-size: 0.8vw;">${songs[i].split("/songs/")[1].replace(/%20/g, " ").slice(0, -4).split(' - ')[1]}</div>
                                                            <div class="artsistName" style="color: rgb(165, 165, 165); width: 100%;">
                                                                <ul type="none" style="display: flex;justify-content: space-between;padding-left:10px;padding-right:10px;height: 2px;font-size: 0.7vw;">
                                                                    <li class = "currTime">00:00</li>
                                                                    <li style ="display: inline-block;">${songs[i].split("/songs/")[1].replace(/%20/g, " ").slice(0, -4).split(' - ')[0]}</li>
                                                                    <li class = "totalDuration">00:00</li>
                                                                </ul>
                                                            </div>
                                                        </div>`
            currSong.play();
        }
    }
}

async function main() {
    let songs = await getSongs();
    console.log(songs);

    let covers = await getCovers();
    console.log(covers);

    let cards = document.querySelector('.cardContainer');
    for (let i = 0; i < songs.length; i++) {
        cards.innerHTML += createCard(songs[i], covers[i]);
    }

    Array.from(document.getElementsByClassName('playBtn')).forEach(e => {
        e.addEventListener('click', element => {
            console.log(element.target.closest('.card').querySelector('.cardTitle').innerText);
            playSong(element.target.closest('.card').querySelector('.cardTitle').innerText, songs, covers);
        })
    })

    let play = document.getElementById('play');
    play.addEventListener('click', () => {
        if (currSong.paused) {
            currSong.play();
        }
        else {
            currSong.pause();
        }
    })

    let next = document.getElementById('next');
    next.addEventListener('click', () => {
        let songName = currSong.src;
        let songIndex = songs.indexOf(songName);
        if (songIndex == songs.length - 1) {
            songIndex = 0;
        }
        else {
            songIndex++;
        }
        playSong(songs[songIndex], songs, covers);
    })

    let prev = document.getElementById('previous');
    prev.addEventListener('click', () => {
        let songName = currSong.src;
        let songIndex = songs.indexOf(songName);
        if (songIndex == 0) {
            songIndex = songs.length - 1;
        }
        else {
            songIndex--;
        }
        playSong(songs[songIndex], songs, covers);
    })

    currSong.addEventListener("timeupdate", () => {
        let played = (currSong.currentTime / currSong.duration) * 100;
        let circle = document.querySelector('.circle');
        let currSeek = document.querySelector('.currSeek');
        document.querySelector('.currTime').innerText = formatTime(currSong.currentTime);
        document.querySelector('.totalDuration').innerText = formatTime(currSong.duration);
        circle.style.left = `${played}%`;
        currSeek.style.width = `${played}%`;
    })

    document.querySelector('.seekbar').addEventListener('click', e => {
        document.querySelector('.circle').style.left = ((e.offsetX / e.target.getBoundingClientRect().width) * 100) + "%";
        document.querySelector('.currSeek').style.width = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currSong.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * currSong.duration;
    })

    document.querySelector('.volume').getElementsByTagName('input')[0].addEventListener('change', e => {
        currSong.volume = parseInt(e.target.value) / 100;
    })

    document.querySelector('.hamburger').addEventListener('click', e => {
        document.querySelector('.sidebar').style.left = "0%";
    })

    document.querySelector('.crossBtn').addEventListener('click', e => {
        document.querySelector('.sidebar').style.left = "-100%";
    })

    if (window.innerWidth <= 550) {
        document.querySelector('.volumeIcon').addEventListener('click', function () {
            let volumeRange = document.querySelector('.volumeRange');
            if (volumeRange.style.display === 'none' || volumeRange.style.display === '') {
                volumeRange.style = `position: absolute;
                min-width: 80px;
                max-width: 90px;
                appearance: slider-vertical;
                z-index: 1;
                display: block;
                top: 6%;
                right: -5%;`
            } else {
                volumeRange.style.display = 'none';
            }
        });
    }
}

main();