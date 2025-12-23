import { useState } from 'react'
import { Search, Home, ChevronDown, Plus, Settings, Bell, HelpCircle } from 'lucide-react'
import { PageTree } from './PageTree'
import { PageContent } from './PageContent'
import { Whiteboard } from './Whiteboard'
import { RovoIcon } from './RovoIcon'
import type { CurrentPage, PageContentData, StickyNoteData } from '../App'
import styles from './ConfluenceShell.module.css'

interface ConfluenceShellProps {
  currentPage: CurrentPage
  onPageChange: (page: CurrentPage) => void
  onOpenRovoChat: () => void
  rovoChatOpen: boolean
  pageContent: PageContentData
  whiteboardNotes: StickyNoteData[]
  onUpdateNotes: (notes: StickyNoteData[]) => void
}

export function ConfluenceShell({ 
  currentPage, 
  onPageChange, 
  onOpenRovoChat, 
  rovoChatOpen,
  pageContent,
  whiteboardNotes,
  onUpdateNotes
}: ConfluenceShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={styles.shell} style={{ 
      marginRight: rovoChatOpen ? 'var(--rovo-sidebar-width)' : 0 
    }}>
      {/* Top Navigation */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.appSwitcher}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>
          </button>
          
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0052CC' }} />
                  <stop offset="100%" style={{ stopColor: '#2684FF' }} />
                </linearGradient>
              </defs>
              <path fill="url(#blue-grad)" d="M4.5 24.9c-.4.7-.8 1.4-.8 1.4-.3.5-.1 1.1.4 1.4l5.3 3.2c.5.3 1.1.1 1.4-.4 0 0 .4-.6.8-1.4 2.1-3.6 4.3-3.2 8.2-1.5l5.4 2.4c.5.2 1.1 0 1.4-.5l2.9-5.5c.2-.5 0-1.1-.5-1.4l-5.4-2.4c-6.4-2.8-11.8-2.9-19.1 4.7z"/>
              <path fill="url(#blue-grad)" d="M27.5 7.1c.4-.7.8-1.4.8-1.4.3-.5.1-1.1-.4-1.4L22.6 1.1c-.5-.3-1.1-.1-1.4.4 0 0-.4.6-.8 1.4-2.1 3.6-4.3 3.2-8.2 1.5L6.8 2c-.5-.2-1.1 0-1.4.5L2.5 8c-.2.5 0 1.1.5 1.4l5.4 2.4c6.4 2.8 11.8 2.9 19.1-4.7z"/>
            </svg>
            <span className={styles.logoText}>Confluence</span>
          </div>
          
          <nav className={styles.nav}>
            <button className={styles.navItem}>
              <Home size={16} />
              <span>Home</span>
            </button>
            <button className={styles.navItem}>
              <span>Recent</span>
              <ChevronDown size={14} />
            </button>
            <button className={styles.navItem}>
              <span>Spaces</span>
              <ChevronDown size={14} />
            </button>
            <button className={styles.navItem}>
              <span>Teams</span>
            </button>
            <button className={styles.navItem}>
              <span>Apps</span>
              <ChevronDown size={14} />
            </button>
            <button className={styles.navItem}>
              <span>Templates</span>
            </button>
            <button className={styles.createBtn}>
              <Plus size={16} />
              <span>Create</span>
            </button>
          </nav>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <span>Search</span>
          </div>
          
          <button 
            className={`${styles.iconBtn} ${styles.chatBtn}`}
            onClick={onOpenRovoChat}
            title="Open Rovo Chat"
          >
            <RovoIcon size={16} />
            <span>Chat</span>
          </button>
          
          <button className={styles.iconBtn}>
            <Bell size={18} />
          </button>
          <button className={styles.iconBtn}>
            <HelpCircle size={18} />
          </button>
          <button className={styles.iconBtn}>
            <Settings size={18} />
          </button>
          <button className={styles.avatar}>AK</button>
        </div>
      </header>

      <div className={styles.main}>
        {/* Left Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          <div className={styles.spaceHeader}>
            <div className={styles.spaceIcon}>V</div>
            <div className={styles.spaceInfo}>
              <div className={styles.spaceName}>Vitafleet</div>
            </div>
            <button 
              className={styles.collapseBtn}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronDown size={16} style={{ transform: sidebarCollapsed ? 'rotate(-90deg)' : 'rotate(0)' }} />
            </button>
          </div>

          <nav className={styles.sidebarNav}>
            <button className={styles.sidebarItem}>
              <span className={styles.sidebarIcon}>≡</span>
              <span>Overview</span>
            </button>
            <button className={styles.sidebarItem}>
              <span className={styles.sidebarIcon}>❝</span>
              <span>Blog</span>
              <Plus size={14} className={styles.sidebarItemAction} />
            </button>
            <button className={styles.sidebarItem}>
              <Settings size={14} />
              <span>Settings</span>
            </button>
          </nav>

          <div className={styles.pagesSection}>
            <div className={styles.pagesSectionHeader}>
              <span>Pages</span>
              <div className={styles.pagesSectionActions}>
                <button className={styles.moreBtn}>•••</button>
                <button className={styles.addBtn}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
            
            <PageTree currentPageId={currentPage.id} onPageSelect={onPageChange} />
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.content}>
          {currentPage.type === 'page' ? (
            <PageContent page={currentPage} content={pageContent} />
          ) : (
            <Whiteboard page={currentPage} notes={whiteboardNotes} onUpdateNotes={onUpdateNotes} />
          )}
        </main>
      </div>
    </div>
  )
}

