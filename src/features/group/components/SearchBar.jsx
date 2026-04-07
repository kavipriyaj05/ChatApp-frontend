import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsersThunk, clearSearchResults } from '../groupSlice';
import OnlineBadge from './OnlineBadge';
import './SearchBar.css';

export default function SearchBar({ onSelectUser }) {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { searchResults, searchLoading } = useSelector((state) => state.group);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        dispatch(searchUsersThunk(query.trim()));
      }, 400);
    } else {
      dispatch(clearSearchResults());
    }

    return () => clearTimeout(debounceRef.current);
  }, [query, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        dispatch(clearSearchResults());
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const handleSelect = (user) => {
    if (onSelectUser) onSelectUser(user);
    setQuery('');
    dispatch(clearSearchResults());
  };

  return (
    <div className="search-bar" ref={containerRef}>
      <div className="search-bar__input-wrap">
        <svg className="search-bar__icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          id="user-search-input"
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-bar__input"
          autoComplete="off"
        />
        {searchLoading && <span className="search-bar__spinner" />}
      </div>

      {searchResults.length > 0 && (
        <ul className="search-bar__dropdown">
          {searchResults.map((user) => (
            <li
              key={user.id}
              className="search-bar__result"
              onMouseDown={(e) => { e.preventDefault(); handleSelect(user); }}
            >
              <div className="search-bar__avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="" />
                ) : (
                  <span className="search-bar__avatar-fallback">
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </span>
                )}
                <OnlineBadge isOnline={user.isOnline} />
              </div>
              <div className="search-bar__info">
                <span className="search-bar__name">{user.username}</span>
                <span className="search-bar__email">{user.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
