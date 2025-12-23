import { useState, useRef, useEffect, useCallback } from 'react'
import { MousePointer2, Pencil, StickyNote, Type, Square, MoreHorizontal, ZoomIn, ZoomOut, Move, Users, FileText, Info, ThumbsUp, Clock, Settings } from 'lucide-react'
import type { CurrentPage, StickyNoteData } from '../App'
import styles from './Whiteboard.module.css'

interface CollaboratorCursor {
  id: string
  name: string
  color: string
  x: number
  y: number
  targetX: number
  targetY: number
}

const COLORS = ['#FFEB3B', '#4FC3F7', '#81C784', '#CE93D8', '#F48FB1']

const FAKE_COLLABORATORS = [
  { id: 'amar', name: 'Amar Sundaram', color: '#FF5630' },
  { id: 'josh', name: 'Josh Williams', color: '#00B8D9' },
  { id: 'crystal', name: 'Crystal Wu', color: '#36B37E' },
  { id: 'eva', name: 'Eva Lien', color: '#6554C0' },
]

interface WhiteboardProps {
  page: CurrentPage
  notes: StickyNoteData[]
  onUpdateNotes: (notes: StickyNoteData[]) => void
}

export function Whiteboard({ page, notes, onUpdateNotes }: WhiteboardProps) {
  const [tool, setTool] = useState<'select' | 'pen' | 'sticky' | 'text' | 'shape'>('select')
  const [cursors, setCursors] = useState<CollaboratorCursor[]>([])
  const [draggingNote, setDraggingNote] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Initialize and animate fake collaborator cursors
  useEffect(() => {
    const initialCursors: CollaboratorCursor[] = FAKE_COLLABORATORS.map((c) => ({
      ...c,
      x: Math.random() * 600 + 100,
      y: Math.random() * 300 + 50,
      targetX: Math.random() * 600 + 100,
      targetY: Math.random() * 300 + 50,
    }))
    setCursors(initialCursors)

    const interval = setInterval(() => {
      setCursors((prev) =>
        prev.map((cursor) => {
          const dx = cursor.targetX - cursor.x
          const dy = cursor.targetY - cursor.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 5) {
            return {
              ...cursor,
              x: cursor.targetX,
              y: cursor.targetY,
              targetX: Math.random() * 700 + 50,
              targetY: Math.random() * 350 + 50,
            }
          }

          return {
            ...cursor,
            x: cursor.x + dx * 0.06,
            y: cursor.y + dy * 0.06,
          }
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handleNoteMouseDown = useCallback((noteId: string, e: React.MouseEvent) => {
    if (tool !== 'select') return
    e.preventDefault()
    setDraggingNote(noteId)
  }, [tool])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingNote || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom - 70
    const y = (e.clientY - rect.top) / zoom - 40

    onUpdateNotes(
      notes.map((note) =>
        note.id === draggingNote
          ? { ...note, x: Math.max(0, x), y: Math.max(0, y) }
          : note
      )
    )
  }, [draggingNote, zoom, notes, onUpdateNotes])

  const handleMouseUp = useCallback(() => {
    setDraggingNote(null)
  }, [])

  const addNote = () => {
    const newNote: StickyNoteData = {
      id: Date.now().toString(),
      x: 200 + Math.random() * 200,
      y: 150 + Math.random() * 100,
      text: 'New idea...',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      author: 'You',
    }
    onUpdateNotes([...notes, newNote])
    setTool('select')
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.spaceName}>Air-ly</span>
          <span className={styles.separator}>/</span>
          <span className={styles.pageTitle}>{page.title}</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.collaboratorAvatars}>
            {FAKE_COLLABORATORS.map((c) => (
              <div
                key={c.id}
                className={styles.collaboratorAvatar}
                style={{ backgroundColor: c.color }}
                title={c.name}
              >
                {c.name.charAt(0)}
              </div>
            ))}
            <div className={styles.moreCollaborators}>+3</div>
          </div>
          <button className={styles.actionBtn}>
            <FileText size={16} />
          </button>
          <button className={styles.actionBtn}>
            <Settings size={16} />
          </button>
          <button className={styles.shareBtn}>Share</button>
          <button className={styles.actionBtn}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className={styles.canvasWrapper}>
        {/* Column Headers */}
        <div className={styles.columnHeaders}>
          <div className={styles.columnHeader} style={{ left: '100px' }}>
            <span className={styles.columnIcon}>✅</span>
            <span className={styles.columnTitle}>Good</span>
          </div>
          <div className={styles.columnHeader} style={{ left: '420px' }}>
            <span className={styles.columnIcon}>👎</span>
            <span className={styles.columnTitle}>Bad / could be better</span>
          </div>
          <div className={styles.columnHeader} style={{ left: '620px' }}>
            <span className={styles.columnIcon}>💡</span>
            <span className={styles.columnTitle}>Ideas</span>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className={styles.canvas}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          {/* Sticky Notes */}
          {notes.map((note) => (
            <div
              key={note.id}
              className={styles.stickyNote}
              style={{
                left: note.x,
                top: note.y,
                backgroundColor: note.color,
              }}
              onMouseDown={(e) => handleNoteMouseDown(note.id, e)}
            >
              <div className={styles.noteContent}>{note.text}</div>
              <div className={styles.noteAuthor}>{note.author}</div>
            </div>
          ))}

          {/* Collaborative Cursors */}
          {cursors.map((cursor) => (
            <div
              key={cursor.id}
              className={styles.cursor}
              style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
                  fill={cursor.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
              <span className={styles.cursorLabel} style={{ backgroundColor: cursor.color }}>
                {cursor.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Toolbar */}
        <div className={styles.toolbar}>
          <button
            className={`${styles.tool} ${tool === 'select' ? styles.active : ''}`}
            onClick={() => setTool('select')}
          >
            <MousePointer2 size={18} />
          </button>
          <div className={styles.toolDivider} />
          <button className={styles.tool}>
            <Move size={18} />
          </button>
          <button className={`${styles.tool} ${styles.colorTool}`}>
            <div className={styles.colorSwatch} />
            Aa
          </button>
          <button className={styles.tool}>
            <div className={styles.colorPicker} />
          </button>
          <div className={styles.toolDivider} />
          <button
            className={`${styles.tool} ${tool === 'pen' ? styles.active : ''}`}
            onClick={() => setTool('pen')}
          >
            <Pencil size={18} />
          </button>
          <button
            className={`${styles.tool} ${tool === 'shape' ? styles.active : ''}`}
            onClick={() => setTool('shape')}
          >
            <Square size={18} />
          </button>
          <button className={styles.tool}>
            <Users size={18} />
          </button>
          <button className={styles.tool}>
            <FileText size={18} />
          </button>
          <button className={styles.tool}>
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Right Sidebar */}
        <div className={styles.rightSidebar}>
          <button className={styles.sidebarBtn}><Settings size={16} /></button>
          <button className={styles.sidebarBtn}><FileText size={16} /></button>
          <button className={styles.sidebarBtn}><Info size={16} /></button>
          <button className={styles.sidebarBtn}><ThumbsUp size={16} /></button>
          <button className={styles.sidebarBtn}><Users size={16} /></button>
          <button className={styles.sidebarBtn}><Clock size={16} /></button>
        </div>

        {/* Zoom Controls */}
        <div className={styles.zoomControls}>
          <button onClick={() => setZoom((z) => Math.min(2, z + 0.25))}>
            <ZoomIn size={16} />
          </button>
          <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}>
            <ZoomOut size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

