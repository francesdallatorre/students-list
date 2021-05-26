import { Component } from 'react';
import { Table, Form, Button } from 'react-bootstrap'
import './App.css';


let baseURL = "https://students-list-api.herokuapp.com/students"

// if (process.env.NODE_ENV === "development") {
//   baseURL = "http://localhost:3003";
// } else {
//   baseURL = "https://students-list-api.herokuapp.com/students";
// }

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      students: [],

    }
    this.getStudents = this.getStudents.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAddStudent = this.handleAddStudent.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

  }
  componentDidMount() {
    this.getStudents()
  }
  getStudents() {
    fetch(baseURL)
      .then(
        (data) => {
          return data.json();
        },
        (err) => console.log(err)
      )
      .then(
        (parsedData) => this.setState({ students: parsedData }),
        (err) => console.log(err)
      )

  }

  handleAddStudent(student) {
    const copyStudents = [...this.state.students];
    copyStudents.unshift(student);
    this.setState({
      students: copyStudents
    })
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value })
    console.log(e.target.value)
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log('submit btn pressed')
    console.log(this.state.firstName, this.state.lastName)
    fetch(baseURL, {
      method: "POST",
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((resJson) => {
        this.handleAddStudent(resJson);
        this.setState({
          firstName: "",
          lastName: ""
        })
      })
      .catch((error) => console.log({ Error: error }));
    console.log("submit");
  }
  deleteStudent(id) {
    fetch(baseURL + "/" + id, {
      method: "DELETE",
    }).then((res) => {
      const findIndex = this.state.students.findIndex(
        (student) => student._id === id
      );
      const copyStudents = [...this.state.students];
      copyStudents.splice(findIndex, 1);
      this.setState({
        students: copyStudents
      })
    })
  }
  render() {
    return (
      <div className="container" >
        <h1>Students</h1>

        {/* Table */}
        <Table striped bordered hover>
          <thead>
            {
              this.state.students.map(student => {
                return (
                  <tr>
                    <th>{student.firstName}</th>
                    <th>{student.lastName}</th><button onClick={() => this.deleteStudent(student._id)}>delete</button>
                  </tr>
                )
              })
            }

          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table >
        <h3>Add a Student to the List</h3>
        {/* Form */}
        < Form onSubmit={this.handleSubmit}>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            onChange={this.handleChange}
            type="text"
            placeholder="John"
            name="firstName"
            id="firstName"
            value={this.state.firstName}
          />
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            onChange={this.handleChange}
            type="text"
            placeholder="Doe"
            name="lastName"
            id="lastName"
            value={this.state.lastName} />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form >
      </div >
    );
  }
}


