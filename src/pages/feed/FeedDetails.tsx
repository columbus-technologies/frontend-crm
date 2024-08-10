import { useState } from 'react';
import { FeedEmailResponse } from "../../types/feed";
import { format, formatDistanceToNow } from 'date-fns';
import { FaEnvelope } from 'react-icons/fa'; // Import the email icon
import './FeedDetails.css';

// Define the constant for the number of lines to collapse
const COLLAPSE_LINES = 5;

const EmailIcon = () => (
  <div className="email-icon">
    <FaEnvelope size={25} color="#FFFFFF" />
  </div>
);

const FeedDetails = ({ selectedFeedEmails }: { selectedFeedEmails: FeedEmailResponse | null }) => {
  if (!selectedFeedEmails?.feed_emails) return <p>No emails found.</p>;

  const [expandedStates, setExpandedStates] = useState(
    new Array(selectedFeedEmails.feed_emails.length).fill(false)
  );

  const toggleExpand = (index: number) => {
    const newExpandedStates = [...expandedStates];
    newExpandedStates[index] = !newExpandedStates[index];
    setExpandedStates(newExpandedStates);
  };

  const renderFeedEmails = (
    emails: any[],
    expandedStates: boolean[],
    toggleExpand: (index: number) => void
  ) => {
    const sortedEmails = emails.sort(
      (a, b) =>
        new Date(b.received_date_time).getTime() -
        new Date(a.received_date_time).getTime()
    );

    return sortedEmails.map((email, index) => {
      const username = email.master_email.split('@')[0];
      const bodyLines = email.body_content.split('\n\n');
      const isLong = bodyLines.length > COLLAPSE_LINES;
      const isExpanded = expandedStates[index];

      // Create body content with line breaks
      const bodyContent = isExpanded
        ? email.body_content.replace(/\n\n/g, '<br />')
        : bodyLines.slice(0, COLLAPSE_LINES).join('<br />') + (isLong ? '...' : '');

      return (
        <div className="email-container" key={index}>
          <div className="email-icon-container">
            <EmailIcon />
          </div>
          <div className="email-details">
            <div className="email-header">
              <strong>Capt.  {username} </strong> sends an update.
            </div>
            <div className="email-header">
              <u>{format(new Date(email.received_date_time), 'yyyy-MM-dd HH:mm:ss')}</u>
            </div>
            <div className="email-subject">
              <strong>{email.subject}</strong>
            </div>
            <div
              className="email-body"
              dangerouslySetInnerHTML={{ __html: bodyContent }}
            />
            {isLong && (
              <a
                onClick={() => toggleExpand(index)}
                className="email-toggle"
              >
                {isExpanded ? 'See less' : 'See more'}
              </a>
            )}
            <div className="email-received">
              {formatDistanceToNow(new Date(email.received_date_time), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {renderFeedEmails(
        selectedFeedEmails.feed_emails,
        expandedStates,
        toggleExpand
      )}
    </div>
  );
};

export default FeedDetails;
