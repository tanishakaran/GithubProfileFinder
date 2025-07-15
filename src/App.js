import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!username) return;
    setError('');
    setUserData(null);
    setRepos([]);
    setLoading(true);

    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error('User not found');

      const user = await userRes.json();
      const repoRes = await fetch(user.repos_url);
      const repoList = await repoRes.json();

      setUserData(user);
      setRepos(repoList.slice(0, 5)); // top 5 repos
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Full-screen background */}
      <div className="animated-bg"></div>

      {/* Main container */}
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              className="logo"
            />
            <h4 className="ms-2 fw-bold">GitHub Finder</h4>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="btn btn-outline-light">
            {darkMode ? '🌞 Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Search input */}
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>

        {/* Spinner */}
        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-info"></div>
          </div>
        )}

        {/* Error */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Profile info */}
        {userData && (
          <div className="card profile-card text-center p-4">
            <img src={userData.avatar_url} alt="Avatar" className="avatar mx-auto mb-3" />
            <h4>{userData.name || userData.login}</h4>
            <p className="text-muted">@{userData.login}</p>
            <p>{userData.bio}</p>

            <div className="d-flex justify-content-around my-3 fw-bold">
              <span>Repos: {userData.public_repos}</span>
              <span>Followers: {userData.followers}</span>
              <span>Following: {userData.following}</span>
            </div>

            <a
              href={userData.html_url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-info mb-3"
            >
              View Profile
            </a>

            {/* Repositories */}
            {repos.length > 0 && (
              <>
                <h5 className="mt-4">Top Repositories</h5>
                <ul className="list-group mt-2">
                  {repos.map((repo) => (
                    <li key={repo.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="fw-bold">
                        {repo.name}
                      </a>
                      <span className="badge bg-secondary">⭐ {repo.stargazers_count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
