// DOM elements
const addBtn = document.getElementById("addBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Track currently playing song node
let currentNode = null;

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

// Store song data
class Song {
    constructor(name, buffer) {
        this.name = name;
        this.buffer = buffer;
    }
}

// Singly linked list for playlist
class Playlist {
    constructor() {
        this.head = null;
    }

    // Add song to playlist
    append(name, buffer) {
        let newSong = new Song(name, buffer);
        let newNode = new Node(newSong);
        if (!this.head) {
            this.head = newNode;
            return;
        }
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }

    // Get the node before the given node
    getPrevious(node) {
        if (this.head === node) return null;

        let current = this.head;
        while (current && current.next !== node) {
            current = current.next;
        }
        return current;
    }

    // Get the node after the given node
    getNext(node) {
        return node?.next || null;
    }

    // Delete a song from the playlist
    delete(song) {
        if (!this.head) return;

        if (this.head.value.name === song.name) {
            this.head = this.head.next;
            return;
        }

        let current = this.head;
        while (current.next) {
            if (current.next.value.name === song.name) {
                current.next = current.next.next;
                return;
            }
            current = current.next;
        }
    }
}

// Initialize playlist
const playlist = new Playlist();

// Switch to a different song and start playing
function switchToSong(node) {
    if (!node) return;

    if (source) {
        source.stop();
        source = null;
    }

    currentNode = node;
    audioBuffer = node.value.buffer;
    originalFileName = node.value.name;
    startTime = 0;
    pausedAt = 0;
    isPlaying = false;
    playBtn.click();
}

// Add current audio to playlist
addBtn.addEventListener("click", () => {
    if (!audioBuffer) return;
    playlist.append(originalFileName, audioBuffer);
    displayPlaylist();
});

// Display all songs in the playlist
function displayPlaylist() {
    const container = document.getElementById("playlistContainer");
    container.innerHTML = "";

    let current = playlist.head;
    while (current) {
        const song = current.value;
        const node = current;
        const listItem = document.createElement("li");
        listItem.textContent = song.name;

        // Create delete button for each song
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playlist.delete(song);
            displayPlaylist();
        });

        listItem.appendChild(deleteBtn);
        listItem.addEventListener("click", () => switchToSong(node));
        container.appendChild(listItem);

        current = current.next;
    }
}

// Go to previous song
prevBtn.addEventListener("click", () => {
    if (currentNode) {
        switchToSong(playlist.getPrevious(currentNode));
    }
});

// Go to next song
nextBtn.addEventListener("click", () => {
    if (currentNode) {
        switchToSong(playlist.getNext(currentNode));
    }
});