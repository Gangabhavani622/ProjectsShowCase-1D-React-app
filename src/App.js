import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectShowCase from './Components/ProjectShowCase'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'Failure',
}

class App extends Component {
  state = {
    projectsList: [],
    activeOption: categoriesList[0].id,
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    const {activeOption} = this.state
    this.setState({apiStatus: apiConstants.inProgress})

    const url = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchData = await response.json()
      const data = fetchData.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))

      this.setState({apiStatus: apiConstants.success, projectsList: data})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onChangeActiveOption = event => {
    console.log(event.target.value)
    this.setState({activeOption: event.target.value}, () => {
      this.getProjectsList()
    })
  }

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list-cont">
        {projectsList.map(eachProject => (
          <ProjectShowCase key={eachProject.id} projectItem={eachProject} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png "
        alt="failure view"
        className="failed-img"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for.
      </p>
      <div>
        <button
          type="button"
          onClick={this.getProjectsList}
          className="retry-btn"
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
    </div>
  )

  renderFinalView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()

      case apiConstants.inProgress:
        return this.renderLoadingView()
      case apiConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {activeOption} = this.state

    return (
      <div className="app-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png "
            alt="website logo"
            className="logo"
          />
        </div>
        <select
          value={activeOption}
          onChange={this.onChangeActiveOption}
          className="categories"
        >
          {categoriesList.map(eachItem => (
            <option key={eachItem.id} value={eachItem.id}>
              {eachItem.displayText}
            </option>
          ))}
        </select>
        {this.renderFinalView()}
      </div>
    )
  }
}

export default App
