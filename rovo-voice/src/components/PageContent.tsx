import { Edit3, MessageSquare, Star, Eye, Sparkles, Share, MoreHorizontal } from 'lucide-react'
import type { CurrentPage, PageContentData } from '../App'
import styles from './PageContent.module.css'

interface PageContentProps {
  page: CurrentPage
  content: PageContentData
}

export function PageContent({ page, content }: PageContentProps) {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbItem}>Vitafleet</span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbItem}>{page.title}</span>
      </div>

      {/* Page Header */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.title}>{page.title}</h1>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <Edit3 size={16} />
            </button>
            <button className={styles.actionBtn}>
              <MessageSquare size={16} />
            </button>
            <button className={styles.actionBtn}>
              <Star size={16} />
            </button>
            <button className={styles.actionBtn}>
              <Eye size={16} />
            </button>
            <button className={styles.summarizeBtn}>
              <Sparkles size={16} />
              <span>Summarize</span>
            </button>
            <button className={styles.shareBtn}>
              <Share size={16} />
              <span>Share</span>
            </button>
            <button className={styles.actionBtn}>
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
        
        <div className={styles.meta}>
          <div className={styles.author}>
            <div className={styles.avatar}>VR</div>
            <div className={styles.authorInfo}>
              <span className={styles.authorLabel}>Owned by</span>
              <span className={styles.authorName}>Veronica Rodriguez</span>
            </div>
          </div>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.lastUpdated}>Last updated: Apr 8, 2024</span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.readTime}>4 min read</span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.views}>
            <Eye size={14} />
            29 people viewed
          </span>
        </div>
      </div>

      {/* Page Content */}
      <div className={styles.content}>
        {/* Intro Section */}
        {content.sections.find(s => s.id === 'intro') && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{content.sections.find(s => s.id === 'intro')!.title}</h2>
            <p className={styles.paragraph}>
              {content.sections.find(s => s.id === 'intro')!.content}
            </p>
          </section>
        )}

        {/* Launch Plan Section */}
        {content.sections.find(s => s.id === 'launch') && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{content.sections.find(s => s.id === 'launch')!.title}</h2>
            <div className={styles.twoColumn}>
              <div className={styles.textColumn}>
                <p className={styles.paragraph}>
                  {content.sections.find(s => s.id === 'launch')!.content}
                </p>
              </div>
              <div className={styles.embedColumn}>
                <div className={styles.embed}>
                  <div className={styles.embedIcon}>🫐</div>
                  <span className={styles.embedTitle}>Blueberry pitch deck</span>
                  <div className={styles.embedPreview}>
                    <div className={styles.embedImage}>
                      <span className={styles.blueberryLogo}>Blueberry</span>
                      <span className={styles.blueberrySubtitle}>Pitch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Key Outcomes Section with Dynamic Table */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Outcomes</h2>
          <div className={styles.table}>
            {content.tableRows.map((row, idx) => (
              <div className={styles.tableRow} key={idx}>
                <div className={styles.tableLabel}>{row.label}</div>
                <div className={styles.tableValue}>
                  {row.value.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.tableRow}>
              <div className={styles.tableLabel}>Key Outcomes</div>
              <div className={styles.tableValue}>
                <div className={styles.outcome}>
                  <span className={styles.outcomeIcon}>📊</span>
                  New signups as we raise awareness
                </div>
                <div className={styles.outcome}>
                  <span className={styles.outcomeIcon}>📈</span>
                  Add net new customers through product + marketing
                </div>
              </div>
            </div>
            <div className={styles.tableRow}>
              <div className={styles.tableLabel}>Status</div>
              <div className={styles.tableValue}>
                <span className={`${styles.statusBadge} ${content.status === 'COMPLETE' ? styles.statusComplete : ''}`}>
                  {content.status}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        {content.sections.find(s => s.id === 'mission') && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🤝</span>
              {content.sections.find(s => s.id === 'mission')!.title}
            </h2>
            <p className={styles.paragraph}>
              {content.sections.find(s => s.id === 'mission')!.content}
            </p>
          </section>
        )}
      </div>
    </div>
  )
}

