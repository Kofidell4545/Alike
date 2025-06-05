import { Icon } from '@iconify/react';
import DashboardNavbar from '../components/DashboardNavbar';

interface ForumPost {
  id: string;
  author: string;
  timeAgo: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
}

const Forum = () => {
  const posts: ForumPost[] = [
    {
      id: '1',
      author: 'Anonymous User',
      timeAgo: '2 hours ago',
      title: 'Strategies for managing urges during recovery',
      content: 'I\'m 3 weeks into my recovery journey and finding it difficult to manage sudden urges. What strategies have worked for others in similar situations? I\'ve tried meditation but sometimes it\'s not enough.',
      tags: ['addiction', 'recovery', 'strategies'],
      likes: 24,
      comments: 12
    },
    {
      id: '2',
      author: 'Anonymous User',
      timeAgo: 'Yesterday',
      title: 'Nutrition tips that helped my recovery',
      content: 'I wanted to share some nutrition changes that have significantly helped my recovery process. Proper nutrition has been a game-changer for my mental clarity and overall wellbeing during this journey.',
      tags: ['nutrition', 'wellness', 'recovery'],
      likes: 42,
      comments: 15
    },
    {
      id: '3',
      author: 'Anonymous User',
      timeAgo: 'Yesterday',
      title: 'One month sober - my experience so far',
      content: 'Today marks one month of sobriety for me. It hasn\'t been easy, but I\'m proud of how far I\'ve come. I wanted to share my experience and some insights I\'ve gained during this first month.',
      tags: ['sobriety', 'milestone', 'journey'],
      likes: 56,
      comments: 23
    },
    {
      id: '4',
      author: 'Anonymous User',
      timeAgo: '2 days ago',
      title: 'How to handle triggers at family gatherings',
      content: 'With the holidays approaching, I\'m anxious about family gatherings where alcohol will be present. How do others handle these situations without compromising their recovery?',
      tags: ['triggers', 'family', 'holidays'],
      likes: 31,
      comments: 19
    },
    {
      id: '5',
      author: 'Anonymous User',
      timeAgo: '3 days ago',
      title: 'Recommended books for understanding food relationships',
      content: 'I\'m looking for book recommendations that address unhealthy relationships with food. Specifically interested in resources that take a psychological approach rather than just diet plans.',
      tags: ['books', 'resources', 'food-psychology'],
      likes: 15,
      comments: 11
    }
  ];

  const categories = ['All Posts', 'Addiction Recovery', 'Mental Health', 'Nutrition', 'Support'];

  return (
    <div className="forum">
      <DashboardNavbar />
      <div className="forum-container">
        <div className="forum-header">
          <div className="header-content">
            <h1>Community Forum</h1>
            <p>Connect with others on similar journeys while maintaining your privacy.</p>
          </div>
          <button className="new-post-btn">
            <Icon icon="lucide:plus" />
            New Post
          </button>
        </div>

        <div className="forum-filters">
          <div className="search-box">
            <Icon icon="lucide:search" className="search-icon" />
            <input type="text" placeholder="Search posts..." />
          </div>
          <div className="tags-filter">
            <Icon icon="lucide:tag" />
            <span>Tags</span>
            <Icon icon="lucide:chevron-down" />
          </div>
        </div>

        <div className="categories-nav">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${category === 'All Posts' ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="author-info">
                  <div className="author-avatar">
                    <Icon icon="lucide:user" />
                  </div>
                  <div className="post-meta">
                    <span className="author-name">{post.author}</span>
                    <span className="post-time">{post.timeAgo}</span>
                  </div>
                </div>
                <button className="more-options">
                  <Icon icon="lucide:more-horizontal" />
                </button>
              </div>

              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">{post.content}</p>

              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>

              <div className="post-actions">
                <button className="action-btn">
                  <Icon icon="lucide:heart" />
                  <span>{post.likes}</span>
                </button>
                <button className="action-btn">
                  <Icon icon="lucide:message-circle" />
                  <span>{post.comments}</span>
                </button>
                <button className="action-btn">
                  <Icon icon="lucide:share" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
