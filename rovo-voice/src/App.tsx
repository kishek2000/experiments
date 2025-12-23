import { useState, useCallback } from 'react'
import { ConfluenceShell } from './components/ConfluenceShell'
import { RovoChat } from './components/RovoChat'
import { ApiKeyModal } from './components/ApiKeyModal'
import './App.css'

export type PageType = 'page' | 'whiteboard'

export interface CurrentPage {
  id: string
  title: string
  type: PageType
}

// Dynamic page content structure
export interface PageSection {
  id: string
  title: string
  content: string
}

export interface PageTableRow {
  label: string
  value: string
}

export interface PageContentData {
  sections: PageSection[]
  tableRows: PageTableRow[]
  status: string
}

// Whiteboard note structure
export interface StickyNoteData {
  id: string
  x: number
  y: number
  text: string
  color: string
  author: string
}

// Initial page content
const INITIAL_PAGE_CONTENT: PageContentData = {
  sections: [
    {
      id: 'intro',
      title: 'Project Blueberry',
      content: 'Blueberry is the codename for a project focused on making changes to our development portal and inventory management system. PPG will require changes by the web development team to launch a new customer inventory portal to help users more accurately predict and implement changes.'
    },
    {
      id: 'launch',
      title: 'Launch plan',
      content: "In this marketing deck, we go over the vision, goals, and potential of Blueberry. We'll provide an overview of Blueberry, highlighting its objectives, features, and potential impact in the ecosystem. Moreover, we'll explore the potential impact of Blueberry within its ecosystem, illustrating the transformative effects it is poised to have on users, industries, and broader societal dynamics."
    },
    {
      id: 'mission',
      title: 'Mission',
      content: 'Our mission is to empower users to do banking, better than ever. We are a credit card company created in the future to take our customers to the future.'
    }
  ],
  tableRows: [
    { label: 'Driver', value: '@Taha Kandemir' },
    { label: 'Approver', value: '@Jie Yan Song' },
    { label: 'Contributors', value: '@Andres Ramos  @Joshua Williams' },
    { label: 'Informed', value: '@Hassana Ajayi  @Annika Rangarajan' },
    { label: 'Due Date', value: 'Launch phase 1 on Dec 15, 2022\nLaunch phase 2 on Jun 30, 2023' }
  ],
  status: 'IN PROGRESS'
}

// Initial whiteboard notes
const INITIAL_WHITEBOARD_NOTES: StickyNoteData[] = [
  { id: '1', x: 100, y: 60, text: 'Campaign was a success!', color: '#FFEB3B', author: 'Amar' },
  { id: '2', x: 280, y: 100, text: 'Recent marketing campaign resulted in a 2% increase of customers 📈', color: '#81C784', author: 'Crystal' },
  { id: '3', x: 100, y: 200, text: 'Great interaction from our blog and media campaigns', color: '#FFEB3B', author: 'Jane' },
  { id: '4', x: 280, y: 240, text: 'Smooth eng + marketing communication', color: '#81C784', author: 'Eva' },
  { id: '5', x: 450, y: 80, text: 'Change failure', color: '#F48FB1', author: 'Josh' },
  { id: '6', x: 450, y: 180, text: "Didn't catch this CF before it was released", color: '#F48FB1', author: 'Josh' },
  { id: '7', x: 450, y: 280, text: 'User limit is too small', color: '#F48FB1', author: 'Eva' },
  { id: '8', x: 650, y: 60, text: 'More blogs!', color: '#4FC3F7', author: 'Omar' },
  { id: '9', x: 650, y: 140, text: 'Get better at releasing campaigns', color: '#4FC3F7', author: 'Omar' },
  { id: '10', x: 650, y: 240, text: 'Guidelines for releases', color: '#4FC3F7', author: 'Team' },
]

function App() {
  const [rovoChatOpen, setRovoChatOpen] = useState(true)
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<CurrentPage>({
    id: 'blueberry-outline',
    title: 'Blueberry outline',
    type: 'page'
  })
  
  // Dynamic content state
  const [pageContent, setPageContent] = useState<PageContentData>(INITIAL_PAGE_CONTENT)
  const [whiteboardNotes, setWhiteboardNotes] = useState<StickyNoteData[]>(INITIAL_WHITEBOARD_NOTES)

  // Callback to apply AI-generated changes
  const handleApplyChanges = useCallback((changes: {
    pageContent?: Partial<PageContentData>
    whiteboardNotes?: StickyNoteData[]
    addNotes?: StickyNoteData[]
    removeNoteIds?: string[]
  }) => {
    if (changes.pageContent) {
      setPageContent(prev => ({
        ...prev,
        ...changes.pageContent,
        sections: changes.pageContent?.sections || prev.sections,
        tableRows: changes.pageContent?.tableRows || prev.tableRows,
      }))
    }
    if (changes.whiteboardNotes) {
      setWhiteboardNotes(changes.whiteboardNotes)
    }
    if (changes.addNotes) {
      setWhiteboardNotes(prev => [...prev, ...changes.addNotes!])
    }
    if (changes.removeNoteIds) {
      setWhiteboardNotes(prev => prev.filter(n => !changes.removeNoteIds!.includes(n.id)))
    }
  }, [])

  return (
    <div className="app">
      <ConfluenceShell
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onOpenRovoChat={() => setRovoChatOpen(true)}
        rovoChatOpen={rovoChatOpen}
        pageContent={pageContent}
        whiteboardNotes={whiteboardNotes}
        onUpdateNotes={setWhiteboardNotes}
      />
      <RovoChat
        isOpen={rovoChatOpen}
        onClose={() => setRovoChatOpen(false)}
        currentPage={currentPage}
        onOpenSettings={() => setApiKeyModalOpen(true)}
        pageContent={pageContent}
        whiteboardNotes={whiteboardNotes}
        onApplyChanges={handleApplyChanges}
      />
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSave={() => {}}
      />
    </div>
  )
}

export default App

