import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

interface Category {
  id: string;
  icon: string;
  title: string;
  description: string;
  professionals: number;
  link: string;
}

const Dashboard = () => {
  const categories: Category[] = [
    {
      id: 'porn-addiction',
      icon: 'lucide:heart-crack',
      title: 'Porn & Masturbation Addiction',
      description: 'Overcome compulsive behaviors and build healthier habits',
      professionals: 24,
      link: '/category/porn-addiction'
    },
    {
      id: 'drug-recovery',
      icon: 'lucide:pill',
      title: 'Drug & Alcoholism Recovery',
      description: 'Support for substance abuse and addiction recovery',
      professionals: 32,
      link: '/category/drug-recovery'
    },
    {
      id: 'nutrition',
      icon: 'lucide:apple',
      title: 'Nutrition Obsession',
      description: 'Address unhealthy relationships with food and body image',
      professionals: 18,
      link: '/category/nutrition'
    },
    {
      id: 'mental-health',
      icon: 'lucide:brain',
      title: 'Mental Health Support',
      description: 'Help with anxiety, depression, and other mental health challenges',
      professionals: 41,
      link: '/category/mental-health'
    }
  ];

  return (
    <div className="dashboard">
      <DashboardNavbar />
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Welcome to Alike</h1>
          <p className="dashboard-subtitle">
            Find the support you need while maintaining your privacy.
          </p>
        </div>
        <div className="header-nav">
          <Link to="/dashboard" className="nav-link active">
            <Icon icon="lucide:grid" />
            Categories
          </Link>
          <Link to="/professionals" className="nav-link">
            <Icon icon="lucide:users" />
            Professionals
          </Link>
          <Link to="/sessions" className="nav-link">
            <Icon icon="lucide:calendar" />
            Upcoming Sessions
          </Link>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <Link to={category.link} key={category.id} className="category-card">
            <div className="category-icon">
              <Icon icon={category.icon} />
            </div>
            <h2 className="category-title">{category.title}</h2>
            <p className="category-description">{category.description}</p>
            <div className="category-meta">
              <span className="professionals-count">
                {category.professionals} professionals available
              </span>
              <button className="explore-button">
                Explore
                <Icon icon="lucide:arrow-right" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
