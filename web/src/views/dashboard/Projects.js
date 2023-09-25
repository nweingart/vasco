import React from 'react';
import ProjectInput from '../../firebase/utils/ProjectInput'
import Table from '../../common/Table';

const Projects = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Projects</h2>
      <ProjectInput />
      <hr style={{ margin: '20px 0' }} />
      <Table collectionName="projects" />
    </div>
  );
}

export default Projects
