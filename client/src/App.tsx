import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <div className="app__container">
        <header className="app__header">
          <h1 className="app__title">Mini Blog</h1>
          <p className="app__subtitle">
            Share thoughts, ideas, and quick updates.
          </p>
        </header>

        <section className="app__create-section">
          <CreatePost />
        </section>

        <section className="app__posts-section">
          <div className="section-heading">
            <h2>Recent Posts</h2>
          </div>

          <PostList />
        </section>
      </div>
    </div>
  );
};

export default App;
