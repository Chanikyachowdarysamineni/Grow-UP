import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Note {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseName: string;
  lessonName?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  highlighted: boolean;
  color: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'color'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    courseId: '1',
    courseName: 'General Notes',
    lessonName: '',
    tags: [] as string[],
    color: 'yellow'
  });
  const [newTag, setNewTag] = useState('');

  const noteColors = [
    { name: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800' },
    { name: 'blue', bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
    { name: 'green', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
    { name: 'pink', bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800' },
    { name: 'purple', bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' }
  ];

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const storedNotes = localStorage.getItem('courseNotes');
    
    const defaultNotes: Note[] = [
      {
        id: '1',
        title: 'React Hooks Best Practices',
        content: 'Always use useCallback for functions passed as props to prevent unnecessary re-renders. Remember to include all dependencies in the dependency array.\n\nKey points:\n- useCallback for function memoization\n- useMemo for expensive calculations\n- useEffect cleanup functions are crucial',
        courseId: '1',
        courseName: 'React Advanced',
        lessonName: 'Custom Hooks',
        tags: ['react', 'hooks', 'performance'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        highlighted: true,
        color: 'blue'
      },
      {
        id: '2',
        title: 'Python List Comprehensions',
        content: 'List comprehensions provide a concise way to create lists.\n\nSyntax: [expression for item in iterable if condition]\n\nExample:\nsquares = [x**2 for x in range(10)]\neven_squares = [x**2 for x in range(10) if x % 2 == 0]',
        courseId: '2',
        courseName: 'Python Mastery',
        lessonName: 'Advanced Python',
        tags: ['python', 'syntax', 'lists'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        highlighted: false,
        color: 'green'
      },
      {
        id: '3',
        title: 'Algorithm Complexity',
        content: 'Big O Notation Quick Reference:\n\nO(1) - Constant time\nO(log n) - Logarithmic - Binary search\nO(n) - Linear - Simple loops\nO(n log n) - Merge sort, Quick sort\nO(n²) - Nested loops\nO(2^n) - Recursive algorithms\n\nAlways aim for the lowest complexity!',
        courseId: '3',
        courseName: 'Data Structures',
        tags: ['algorithms', 'complexity', 'interview'],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
        highlighted: true,
        color: 'purple'
      }
    ];

    setNotes(storedNotes ? JSON.parse(storedNotes) : defaultNotes);
  };

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('courseNotes', JSON.stringify(updatedNotes));
  };

  const createNote = () => {
    if (!newNote.title || !newNote.content) {
      alert('Please fill in title and content');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      ...newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      highlighted: false
    };

    saveNotes([note, ...notes]);
    setNewNote({
      title: '',
      content: '',
      courseId: '1',
      courseName: 'General Notes',
      lessonName: '',
      tags: [],
      color: 'yellow'
    });
    setIsCreating(false);
  };

  const updateNote = () => {
    if (!editingNote) return;

    const updatedNotes = notes.map(n =>
      n.id === editingNote.id ? { ...editingNote, updatedAt: new Date().toISOString() } : n
    );
    saveNotes(updatedNotes);
    setEditingNote(null);
  };

  const deleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      saveNotes(notes.filter(n => n.id !== noteId));
    }
  };

  const toggleHighlight = (noteId: string) => {
    const updatedNotes = notes.map(n =>
      n.id === noteId ? { ...n, highlighted: !n.highlighted } : n
    );
    saveNotes(updatedNotes);
  };

  const exportNote = (note: Note) => {
    const text = `${note.title}\n\n${note.content}\n\nCourse: ${note.courseName}\nTags: ${note.tags.join(', ')}\nCreated: ${new Date(note.createdAt).toLocaleDateString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const duplicateNote = (note: Note) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveNotes([newNote, ...notes]);
  };

  // Utility functions for future tag management features
  // const addTagToNote = (noteId: string, tag: string) => {
  //   const updatedNotes = notes.map(n =>
  //     n.id === noteId && !n.tags.includes(tag) ? { ...n, tags: [...n.tags, tag] } : n
  //   );
  //   saveNotes(updatedNotes);
  // };

  // const removeTagFromNote = (noteId: string, tag: string) => {
  //   const updatedNotes = notes.map(n =>
  //     n.id === noteId ? { ...n, tags: n.tags.filter(t => t !== tag) } : n
  //   );
  //   saveNotes(updatedNotes);
  // };

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  let filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'all' || note.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });
  // Apply sorting
  filteredNotes = filteredNotes.sort((a, b) => {
    if (a.highlighted !== b.highlighted) {
      return b.highlighted ? 1 : -1; // Pinned notes first
    }
    switch (sortBy) {
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'color':
        return a.color.localeCompare(b.color);
      default:
        return 0;
    }
  });
  const getColorClasses = (colorName: string) => {
    return noteColors.find(c => c.name === colorName) || noteColors[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Notes</h1>
              <p className="text-indigo-100">Capture insights and highlights from your learning</p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              ✏️ New Note
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search and Controls Row */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div className="md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white"
                >
                  <option value="date">Latest First</option>
                  <option value="title">By Title</option>
                  <option value="color">By Color</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="List View"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tag Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterTag('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterTag === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Notes
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterTag === tag
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-1">{notes.length}</div>
            <div className="text-sm text-gray-600">Total Notes</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {notes.filter(n => n.highlighted).length}
            </div>
            <div className="text-sm text-gray-600">Highlighted</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">{allTags.length}</div>
            <div className="text-sm text-gray-600">Tags</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {new Set(notes.map(n => n.courseName)).size}
            </div>
            <div className="text-sm text-gray-600">Courses</div>
          </div>
        </div>

        {/* Notes Grid/List View */}
        <div className={viewMode === 'grid' ? 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6' : 'space-y-4'}>
          {filteredNotes.map((note) => {
            const colorClasses = getColorClasses(note.color);
            
            if (viewMode === 'list') {
              // List View - Compact horizontal layout
              return (
                <div
                  key={note.id}
                  className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow`}
                >
                  <div className="flex gap-4">
                    {/* Highlight Star */}
                    <button
                      onClick={() => toggleHighlight(note.id)}
                      className="text-2xl hover:scale-110 transition-transform self-start"
                    >
                      {note.highlighted ? '⭐' : '☆'}
                    </button>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold ${colorClasses.text} mb-1 truncate`}>
                        {note.title}
                      </h3>
                      <div className="text-xs text-gray-600 mb-2">
                        {note.courseName} {note.lessonName && `• ${note.lessonName}`}
                      </div>
                      <p className={`${colorClasses.text} text-sm line-clamp-2 mb-2`}>
                        {note.content}
                      </p>
                      
                      {/* Tags */}
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingNote(note)}
                        className="px-3 py-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-lg text-sm transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => exportNote(note)}
                        className="px-3 py-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 text-blue-700 rounded-lg text-sm transition-colors"
                        title="Export"
                      >
                        📥
                      </button>
                      <button
                        onClick={() => duplicateNote(note)}
                        className="px-3 py-2 bg-green-500 bg-opacity-20 hover:bg-opacity-30 text-green-700 rounded-lg text-sm transition-colors"
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="px-3 py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-700 rounded-lg text-sm transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            
            // Grid View - Card layout
            return (
              <div
                key={note.id}
                className={`break-inside-avoid ${colorClasses.bg} ${colorClasses.border} border-2 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow relative`}
              >
                {/* Highlight Star */}
                <button
                  onClick={() => toggleHighlight(note.id)}
                  className="absolute top-4 right-4 text-2xl hover:scale-110 transition-transform"
                >
                  {note.highlighted ? '⭐' : '☆'}
                </button>

                {/* Note Content */}
                <h3 className={`text-xl font-bold ${colorClasses.text} mb-2 pr-8`}>
                  {note.title}
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                  <div className="font-medium">{note.courseName}</div>
                  {note.lessonName && <div className="text-xs">{note.lessonName}</div>}
                </div>

                <p className={`${colorClasses.text} whitespace-pre-wrap mb-4`}>
                  {note.content}
                </p>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium flex items-center gap-1"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                <div className="text-xs text-gray-500 mb-4 border-t border-gray-300 pt-3">
                  <div>Created: {new Date(note.createdAt).toLocaleDateString()}</div>
                  {note.createdAt !== note.updatedAt && (
                    <div>Updated: {new Date(note.updatedAt).toLocaleDateString()}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEditingNote(note)}
                    className="py-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-lg font-medium text-sm transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => exportNote(note)}
                    className="py-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 text-blue-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    📥 Export
                  </button>
                  <button
                    onClick={() => duplicateNote(note)}
                    className="py-2 bg-green-500 bg-opacity-20 hover:bg-opacity-30 text-green-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    📋 Duplicate
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Notes Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterTag !== 'all'
                ? 'No notes match your search criteria'
                : 'Start taking notes to capture important insights'}
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create Your First Note
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Note Modal */}
      {(isCreating || editingNote) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setIsCreating(false);
            setEditingNote(null);
          }}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={editingNote ? editingNote.title : newNote.title}
                  onChange={(e) =>
                    editingNote
                      ? setEditingNote({ ...editingNote, title: e.target.value })
                      : setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter note title..."
                />
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <input
                  type="text"
                  value={editingNote ? editingNote.courseName : newNote.courseName}
                  onChange={(e) =>
                    editingNote
                      ? setEditingNote({ ...editingNote, courseName: e.target.value })
                      : setNewNote({ ...newNote, courseName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Course name..."
                />
              </div>

              {/* Lesson Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson (optional)
                </label>
                <input
                  type="text"
                  value={editingNote ? editingNote.lessonName || '' : newNote.lessonName}
                  onChange={(e) =>
                    editingNote
                      ? setEditingNote({ ...editingNote, lessonName: e.target.value })
                      : setNewNote({ ...newNote, lessonName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Lesson name..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  value={editingNote ? editingNote.content : newNote.content}
                  onChange={(e) =>
                    editingNote
                      ? setEditingNote({ ...editingNote, content: e.target.value })
                      : setNewNote({ ...newNote, content: e.target.value })
                  }
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                  placeholder="Write your notes here..."
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-3">
                  {noteColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() =>
                        editingNote
                          ? setEditingNote({ ...editingNote, color: color.name })
                          : setNewNote({ ...newNote, color: color.name })
                      }
                      className={`w-12 h-12 rounded-lg ${color.bg} ${color.border} border-2 hover:scale-110 transition-transform ${
                        (editingNote ? editingNote.color : newNote.color) === color.name
                          ? 'ring-4 ring-indigo-600'
                          : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(editingNote ? editingNote.tags : newNote.tags).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() =>
                          editingNote
                            ? setEditingNote({
                                ...editingNote,
                                tags: editingNote.tags.filter((t) => t !== tag)
                              })
                            : setNewNote({ ...newNote, tags: newNote.tags.filter((t) => t !== tag) })
                        }
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newTag.trim()) {
                        if (editingNote) {
                          setEditingNote({
                            ...editingNote,
                            tags: [...editingNote.tags, newTag.trim()]
                          });
                        } else {
                          setNewNote({ ...newNote, tags: [...newNote.tags, newTag.trim()] });
                        }
                        setNewTag('');
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={() => {
                      if (newTag.trim()) {
                        if (editingNote) {
                          setEditingNote({
                            ...editingNote,
                            tags: [...editingNote.tags, newTag.trim()]
                          });
                        } else {
                          setNewNote({ ...newNote, tags: [...newNote.tags, newTag.trim()] });
                        }
                        setNewTag('');
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingNote(null);
                  }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingNote ? updateNote : createNote}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
