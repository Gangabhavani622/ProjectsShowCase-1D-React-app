import './index.css'

const ProjectShowCase = props => {
  const {projectItem} = props
  const {name, imageUrl} = projectItem

  return (
    <li className="list-item">
      <img src={imageUrl} className="project-img" alt={name} />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectShowCase
