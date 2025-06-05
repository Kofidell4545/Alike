import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface Session {
  id: string;
  therapist: {
    name: string;
    title: string;
    avatar: string;
  };
  date: string;
  time: string;
}

const PastSessions = () => {
  // This would eventually come from your smart contract
  const sessions: Session[] = [
    {
      id: '1',
      therapist: {
        name: 'Dr. Sarah Chen',
        title: 'Clinical Psychologist',
        avatar: '/avatars/sarah-chen.jpg'
      },
      date: 'Oct 15, 2023',
      time: '10:00 AM - 10:45 AM'
    },
    {
      id: '2',
      therapist: {
        name: 'Michael Rodriguez',
        title: 'Addiction Counselor',
        avatar: '/avatars/michael-rodriguez.jpg'
      },
      date: 'Oct 8, 2023',
      time: '2:00 PM - 2:45 PM'
    },
    {
      id: '3',
      therapist: {
        name: 'Dr. Sarah Chen',
        title: 'Clinical Psychologist',
        avatar: '/avatars/sarah-chen.jpg'
      },
      date: 'Sep 30, 2023',
      time: '11:00 AM - 11:45 AM'
    }
  ];

  return (
    <div className="past-sessions">
      <h2 className="section-title">Past Sessions</h2>
      <div className="sessions-list">
        {sessions.map(session => (
          <div key={session.id} className="session-card">
            <div className="session-info">
              <div className="therapist-avatar">
                <Icon icon="lucide:user" />
              </div>
              <div className="session-details">
                <h3 className="therapist-name">{session.therapist.name}</h3>
                <p className="therapist-title">{session.therapist.title}</p>
                <p className="session-time">
                  {session.date} • {session.time}
                </p>
              </div>
            </div>
            <div className="session-actions">
              <Button 
                variant="flat"
                color="primary"
                className="action-btn view"
              >
                View Notes
              </Button>
              <Button 
                color="primary"
                className="action-btn book"
              >
                Book Again
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastSessions;
