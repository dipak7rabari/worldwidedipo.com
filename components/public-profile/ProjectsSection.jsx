function validProject(
  project
) {
  return (
    project &&
    typeof project ===
      'object' &&
    typeof project.title ===
      'string'
  );
}

export default function ProjectsSection({
  profile,
}) {
  const projects =
    Array.isArray(
      profile?.projects
    )
      ? profile.projects.filter(
          validProject
        )
      : [];

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="public-profile-section">
      <div className="public-profile-section-heading">
        <p>Work</p>

        <h2>
          Projects
        </h2>
      </div>

      <div className="public-profile-project-list">
        {projects.map(
          (project, index) => (
            <article
              key={
                project.id ||
                `${project.title}-${index}`
              }
              className="public-profile-project-card"
            >
              <h3>
                {project.title}
              </h3>

              {project.description && (
                <p>
                  {project.description}
                </p>
              )}

              {typeof project.url ===
                'string' &&
                project.url.startsWith(
                  'https://'
                ) && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    View Project ↗
                  </a>
                )}
            </article>
          )
        )}
      </div>
    </section>
  );
}