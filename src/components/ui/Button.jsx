import { contacts } from '../../config/contacts';
import './Button.css';

export function Button({ children }) {
  return (
    <a
      className="contact-button"
      href={contacts.community}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
