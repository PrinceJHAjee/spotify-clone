console.log('Lets write some Javascript')
//some errors are there, we ll understand later.

let currentSong = new Audio();
let songs;
let currFolder;

// js function to convert seconds to minute:seconds in the format "00:00"
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    // Check if the path to fetch songs is correct
    let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${currFolder}/`)[1]);
        }
    }


       // show all the songs in the playlist
        let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }
     
    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            // function to play that clicked music 
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });


    return songs;
}

const playmusic = (track, pause = false) => {

     currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a");
    let cardContainer=document.querySelector(".cardContainer")
    // cardContainer.innerHTML=""; //clearing the existing cards if any
    let array=Array.from(anchors)
        
    for (let index = 0; index < array.length; index++) {
            const e= array[index];
            
        
        if(e.href.includes("/songs/")){
           let folder = e.href.split("/").slice(-1)[0]
           //    console.log(folder)
           //get the metadata of the folder
           let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
        //    console.log(a)
           let response = await a.json();
           console.log(response)

           cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
                            <circle cx="24" cy="24" r="24" fill="green" />
                            <g transform="translate(12, 12)">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </g>
                        </svg>
                          
                          
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="Dinner With Friends">
                    <h3>${response.title}</h3>
                    <p>${response.description}</p>
                </div>`
        }
    }

    //load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            // console.log(e)
            console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]); //whenever someone click on card, its first music will be played

        })
    })
    return songs;
   
}



////////// MAIN FUNCTION ///////////////
async function main() {
    // get the list of all the songs
    await getSongs("songs/ncs");
    

    playmusic(songs[0], true);

    //Display all the albums on the page
    displayAlbums()

  
   

    // attach an event listener to play  
    // (not rquired now as i haved added space bar play/pause control feature down the code and also added a fucntion to check and control the play/pause toggle and adedded event listener for click and space bar toggling as well.)
    
    // play.addEventListener("click", () => {
    //     if (currentSong.paused) {
    //         currentSong.play()
    //         play.src = "img/pause.svg"
    //     }
    //     else {
    //         currentSong.pause()
    //         play.src = "img/play.svg"
    //     }
    // })





    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        // to move the circle through the bar 
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100; // current song controlled via seekbar
    });

    // add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // add event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // add event listener to previous and next
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        // Check if the path splitting is correct
        let currentSongFilename = currentSong.src.split(`/${currFolder}/`).slice(-1)[0];
        let index = songs.indexOf(currentSongFilename);
        if (index - 1 >= 0) {
            playmusic(songs[index - 1]);
        }
        console.log(songs, index);
    });

    
    next.addEventListener("click", () => {
        console.log("Next clicked");
        // Check if the path splitting is correct
        let currentSongFilename = currentSong.src.split(`/${currFolder}/`).slice(-1)[0];
        let index = songs.indexOf(currentSongFilename);
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1]);
        }
        console.log(songs, index);
    });

    // add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100;
        
        if(currentSong.volume>0){
           
            // currentSong.volume = parseInt(e.target.value) / 100;
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")

        }
    });

    //add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
       
       if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
       }
       else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentSong.volume = 0.3; // 30% volume
        document.querySelector(".range").getElementsByTagName("input")[0].value=20;
       }
    })


     // Add an event listener to detect the spacebar key press
     document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            event.preventDefault(); // Prevent the default action (scrolling the page down)
            togglePlayPause();
        }
    });

    // attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        togglePlayPause();
    })

    //to check the song toggle
    function togglePlayPause() {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    }
    

     
}

main();
