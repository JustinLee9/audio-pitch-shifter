# Audio Pitch Shifter

A web-based audio player with speed control, volume adjustment, playlist management, and real-time waveform visualization.

🎵 **[Live Demo](https://audio-pitch-shifter.vercel.app)**

## Features

- **Audio Playback**: Play/pause audio files with support for various formats
- **Speed Control**: Adjust playback speed from 0.5x to 2x without pitch change
- **Volume Control**: Adjustable volume from 0 to 2x
- **Playlist Management**: 
  - Add songs to a playlist
  - Click to play any song
  - Delete songs from playlist
  - Navigate with Previous/Next buttons
- **Visual Feedback**: Real-time waveform visualization with gradient effects
- **Download**: Export modified audio at current speed as WAV files
- **Responsive Design**: Three-column layout (playlist, controls, future features)

## Technologies Used

- **Web Audio API**: Audio processing and playback
- **Canvas API**: Real-time waveform visualization
- **Vanilla JavaScript**: Core functionality
- **CSS Grid**: Responsive layout
- **Linked List**: Custom playlist data structure

## File Structure

```
├── index.html          # Main HTML structure
├── index.css           # Styling and layout
├── app.js              # Audio playback and visualization
├── playlist.js         # Playlist management logic
└── README.md           # Documentation
```

## How to Use

1. **Load Audio**: Click "Choose File" to select an audio file
2. **Add to Playlist**: Click "Add Song" to add the current audio to your playlist
3. **Play/Pause**: Click the "Play/Pause" button or click a song in the playlist
4. **Navigate**: Use the "<" and ">" buttons to go to previous/next songs
5. **Adjust Settings**: Use the sliders to control volume and speed
6. **Download**: Click "Download" to export the current audio at the selected speed

## Browser Compatibility

Requires a modern browser with support for:
- Web Audio API
- ES6+ JavaScript features
- CSS Grid
- Canvas API

Tested on Chrome, Firefox, Safari, and Edge.

## Setup

No build process required. Simply open `index.html` in a web browser or serve the files with any static file server.

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Then navigate to `http://localhost:8000`

## Data Structure

The playlist uses a **singly linked list** implementation:
- Each node contains a Song object (name, audio buffer)
- Supports O(1) append operations
- O(n) search and delete operations
- Efficient memory usage for dynamic playlist sizes

## Future Enhancements

- Loop/repeat modes
- Shuffle functionality
- Drag-and-drop song reordering
- Save/load playlists
- Equalizer controls
- Additional visualizer styles
