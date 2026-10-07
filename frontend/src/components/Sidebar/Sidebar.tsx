
export default function Sidebar({setIsSidebarOpen}: {setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const projects = [
    { id: 1, name: "Project One" },
    { id: 2, name: "Wireframe" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="menu-btn" onClick={() => setIsSidebarOpen(false)}>
          ☰
        </button>
      </div>

      <div className="sidebar-content">
        <h2>Projects</h2>

        <button className="new-project-btn">+ Create New Project</button>
        <div className="project-list">
          {projects.map((project) => (
            <button key={project.id} className="project-card">
              {project.name}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="profile-btn">C</button>
      </div>
    </aside>
  );
}
