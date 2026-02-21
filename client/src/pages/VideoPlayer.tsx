import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Video {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  duration: string;
  url: string;
  description: string;
  transcript: string;
  resources: { name: string; url: string }[];
}

interface Note {
  id: string;
  videoId: string;
  timestamp: number;
  content: string;
  createdAt: string;
}

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [quality, setQuality] = useState('1080p');

  // Sample video data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sampleVideos: Video[] = [
    {
      id: '1',
      title: 'Introduction to React Hooks',
      courseId: 'react-101',
      courseName: 'React Fundamentals',
      duration: '15:30',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Sample video
      description: 'Learn the basics of React Hooks including useState and useEffect',
      transcript: `Welcome to this lesson on React Hooks.
In this video, we'll explore useState and useEffect.
First, let's understand what hooks are and why they were introduced.
Hooks allow you to use state and other React features without writing a class.`,
      resources: [
        { name: 'React Hooks Documentation', url: 'https://react.dev/reference/react' },
        { name: 'Sample Code', url: '#' },
        { name: 'Quiz', url: '#' },
      ]
    }
  ];

  useEffect(() => {
    // Load video data
    const video = sampleVideos.find(v => v.id === videoId) || sampleVideos[0];
    setCurrentVideo(video);

    // Load notes from localStorage
    const savedNotes = localStorage.getItem(`video-notes-${video.id}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    // Load progress
    const savedTime = localStorage.getItem(`video-progress-${video.id}`);
    if (savedTime && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedTime);
    }
  }, [videoId, sampleVideos]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Save progress periodically
  useEffect(() => {
    if (currentVideo && currentTime > 0) {
      localStorage.setItem(`video-progress-${currentVideo.id}`, currentTime.toString());
    }
  }, [currentTime, currentVideo]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const addNote = () => {
    if (!noteContent.trim() || !currentVideo) return;

    const newNote: Note = {
      id: Date.now().toString(),
      videoId: currentVideo.id,
      timestamp: currentTime,
      content: noteContent,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`video-notes-${currentVideo.id}`, JSON.stringify(updatedNotes));
    setNoteContent('');
  };

  const jumpToNote = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
    }
  };

  const deleteNote = (noteId: string) => {
    if (!currentVideo) return;
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem(`video-notes-${currentVideo.id}`, JSON.stringify(updatedNotes));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div 
              className="bg-black rounded-xl overflow-hidden shadow-2xl relative group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(isPlaying ? false : true)}
            >
              <video
                ref={videoRef}
                src={currentVideo.url}
                className="w-full aspect-video"
                onClick={togglePlay}
              />

              {/* Custom Controls */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 mb-4 rounded-lg appearance-none cursor-pointer bg-gray-600"
                  style={{
                    background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
                  }}
                />

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    {/* Play/Pause */}
                    <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
                      {isPlaying ? (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Skip Buttons */}
                    <button onClick={() => skipTime(-10)} className="hover:text-indigo-400 text-sm">
                      ⏪ 10s
                    </button>
                    <button onClick={() => skipTime(10)} className="hover:text-indigo-400 text-sm">
                      10s ⏩
                    </button>

                    {/* Volume */}
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                      </svg>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1"
                      />
                    </div>

                    {/* Time */}
                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Playback Speed */}
                    <div className="relative group/speed">
                      <button className="hover:text-indigo-400 text-sm font-semibold">
                        {playbackRate}x
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 hidden group-hover/speed:block">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                          <button
                            key={rate}
                            onClick={() => changePlaybackRate(rate)}
                            className={`block w-full text-left px-3 py-1 rounded hover:bg-gray-700 ${playbackRate === rate ? 'text-indigo-400' : ''}`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quality */}
                    <div className="relative group/quality">
                      <button className="hover:text-indigo-400 text-sm">
                        {quality}
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 hidden group-hover/quality:block">
                        {['360p', '720p', '1080p'].map(q => (
                          <button
                            key={q}
                            onClick={() => setQuality(q)}
                            className={`block w-full text-left px-3 py-1 rounded hover:bg-gray-700 ${quality === q ? 'text-indigo-400' : ''}`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fullscreen */}
                    <button onClick={toggleFullscreen} className="hover:text-indigo-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info & Tabs */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setShowTranscript(false)}
                  className={`px-4 py-2 font-semibold ${!showTranscript ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setShowTranscript(true)}
                  className={`px-4 py-2 font-semibold ${showTranscript ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
                >
                  Transcript
                </button>
              </div>

              {!showTranscript ? (
                <div>
                  <p className="text-gray-700 mb-4">{currentVideo.description}</p>
                  
                  <h3 className="font-bold text-gray-900 mb-3">Resources</h3>
                  <div className="space-y-2">
                    {currentVideo.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{resource.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{currentVideo.transcript}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Notes */}
          <div className="space-y-6">
            {/* Add Note */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Take a Note
              </h3>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add your note here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">At {formatTime(currentTime)}</span>
                <button
                  onClick={addNote}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">My Notes ({notes.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No notes yet. Start taking notes!</p>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <button
                          onClick={() => jumpToNote(note.timestamp)}
                          className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                        >
                          {formatTime(note.timestamp)}
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
