const addButton = document.getElementById("addButton");

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class Song {
    constructor(name, buffer) {
        (this.name = name), (this.buffer = buffer);
    }
}

class Playlist {
    constructor() {
        this.head = null;
    }

    append(name, buffer) {
        let newSong = new Song(name, buffer);
        let newnode = new Node(newSong);
        if (!this.head) {
            this.head = newnode;
            return;
        }
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newnode;
    }

    delete(song) {
        if (this.head.value.name === song.name) {
            this.head = this.head.next
        } else {
            let prev = null
            let current = this.head;
            while (current) {
                if (current.value.name === song.name) {
                    prev.next = current.next;
                    return;
                } else {
                    prev = current;
                    current = current.next
                }
            }
        }
    }

    printList() {
        let current = this.head;
        let result = "";
        while (current) {
            result += current.value.buffer + "\n";
            current = current.next;
        }
        console.log(result + "null");
    }
}

const playlist = new Playlist();

addButton.addEventListener("click", () => {
    if (!audioBuffer) return;

    playlist.append(originalFileName, audioBuffer);
    console.log("Added", originalFileName, audioBuffer);
    displayPlaylist();
});

displayPlaylist = () => {
    let container = document.getElementById("playlistContainer");
    container.innerHTML = "";
    let current = playlist.head;
    while (current) {
        let song = current.value;
        let listItem = document.createElement("li");
        listItem.textContent = current.value.name;
        
        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playlist.delete(song);
            displayPlaylist();
        });
        
        listItem.appendChild(deleteBtn);

        listItem.addEventListener("click", () => {
            audioBuffer = song.buffer;
            originalFileName = song.name;
            startTime = 0;
            pausedAt = 0;
            playButton.click();
        });
        
        container.appendChild(listItem);
        current = current.next;
    }
};