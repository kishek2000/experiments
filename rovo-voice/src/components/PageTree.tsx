import { useState } from 'react'
import { ChevronRight, FileText, Layout } from 'lucide-react'
import type { CurrentPage, PageType } from '../App'
import styles from './PageTree.module.css'

interface PageNode {
  id: string
  title: string
  icon?: string
  type: PageType
  children?: PageNode[]
}

const pages: PageNode[] = [
  {
    id: 'multi-year-strategy',
    title: 'Multi-Year Banc.ly Strategy',
    icon: '🏔',
    type: 'page',
    children: []
  },
  {
    id: 'new-hire-resources',
    title: 'New hire resources!',
    icon: '📚',
    type: 'page',
    children: []
  },
  {
    id: 'cashback-project',
    title: '5% Cashback Credit Card Pr...',
    icon: '💳',
    type: 'page',
    children: [
      {
        id: 'cashback-gtm',
        title: 'Cashback GTM launch',
        icon: '🚀',
        type: 'page',
        children: [
          {
            id: 'cashback-requirements',
            title: 'Cashback Product Requir...',
            icon: '📋',
            type: 'page'
          },
          {
            id: 'cashback-launch',
            title: 'Cashback Product Launc...',
            icon: '📊',
            type: 'page'
          }
        ]
      }
    ]
  },
  {
    id: 'blueberry-outline',
    title: 'Blueberry outline',
    icon: '📄',
    type: 'page',
    children: []
  },
  {
    id: 'okrs',
    title: 'OKRs',
    icon: '📈',
    type: 'page',
    children: []
  },
  {
    id: 'quarterly-plans',
    title: 'Quarterly Plans',
    icon: '✍',
    type: 'page',
    children: []
  },
  {
    id: 'brand-standards',
    title: 'Banc.ly brand standards and...',
    icon: '📕',
    type: 'page',
    children: []
  },
  {
    id: 'q1-launch',
    title: 'Q1 Product Launch',
    icon: '🚀',
    type: 'page',
    children: []
  },
  {
    id: 'q2-launch',
    title: 'Q2 Product Launch',
    icon: '🚀',
    type: 'page',
    children: []
  },
  {
    id: 'okr-meeting-notes',
    title: 'OKR meeting notes',
    icon: '📒',
    type: 'page',
    children: []
  },
  {
    id: 'monthly-biz-review',
    title: 'Monthly Biz Review...',
    icon: '👤',
    type: 'page',
    children: []
  },
  {
    id: 'simple-retro',
    title: 'Simple retro',
    icon: '📋',
    type: 'whiteboard',
    children: []
  },
  {
    id: 'table-visualization',
    title: 'Table Visualization',
    icon: '📊',
    type: 'page',
    children: []
  }
]

interface PageTreeProps {
  currentPageId: string
  onPageSelect: (page: CurrentPage) => void
}

export function PageTree({ currentPageId, onPageSelect }: PageTreeProps) {
  return (
    <div className={styles.tree}>
      {pages.map((page) => (
        <PageTreeItem
          key={page.id}
          page={page}
          depth={0}
          currentPageId={currentPageId}
          onPageSelect={onPageSelect}
        />
      ))}
      <div className={styles.archivedPages}>
        <ChevronRight size={14} />
        <span>Archived pages</span>
      </div>
    </div>
  )
}

interface PageTreeItemProps {
  page: PageNode
  depth: number
  currentPageId: string
  onPageSelect: (page: CurrentPage) => void
}

function PageTreeItem({ page, depth, currentPageId, onPageSelect }: PageTreeItemProps) {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = page.children && page.children.length > 0
  const isSelected = page.id === currentPageId

  const handleClick = () => {
    onPageSelect({ id: page.id, title: page.title, type: page.type })
  }

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <div className={styles.item}>
      <div
        className={`${styles.itemRow} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <button className={styles.expandBtn} onClick={handleExpandClick}>
            <ChevronRight
              size={14}
              style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </button>
        ) : (
          <span className={styles.expandPlaceholder} />
        )}
        
        <span className={styles.icon}>
          {page.type === 'whiteboard' ? (
            <Layout size={14} />
          ) : page.icon ? (
            page.icon
          ) : (
            <FileText size={14} />
          )}
        </span>
        
        <span className={styles.title}>{page.title}</span>
      </div>
      
      {hasChildren && expanded && (
        <div className={styles.children}>
          {page.children!.map((child) => (
            <PageTreeItem
              key={child.id}
              page={child}
              depth={depth + 1}
              currentPageId={currentPageId}
              onPageSelect={onPageSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

