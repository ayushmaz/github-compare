import { useScrollTrigger } from '@material-ui/core';
import React, { Component } from 'react';
import { Form, Button, Col, InputGroup, FormControl, Row, Card, Container, Image, Alert, Jumbotron } from 'react-bootstrap'
class App extends Component {
  state = {
    list: [],
    username: ""
  }

  onChangeHandler = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  scoreOf = user => {
    const score = 0.30 * user.followers + 0.20 * user.following + 0.30 * user.public_repos + 0.20 * user.public_gists
    //console.log(score)
    return score
  }

  onSubmitHandler = e => {

    const userFlag = this.state.list.some(val => {
      return val.login === e.target.username.value
    })

    e.preventDefault()
    //console.log(e.target.username.value)
    this.setState({
      username: ""
    })

    fetch("https://api.github.com/users/" + e.target.username.value)
      .then(data => data.json())
      .then(data => {
        if (!data.message && !userFlag) {
          this.setState({
            list: this.state.list.concat(data).sort((a, b) => this.scoreOf(b) - this.scoreOf(a)),
          })
        } else {
          
          if (userFlag) {
            alert("User already exists")
          } else {
            alert("Username not available")
          }
        }
      })
  }
  render() {
    return (
      <div>
        <Container>
          <Jumbotron>
            <h1 style={{display:"flex" , justifyContent:"center"}}>GITHUB COMPARE</h1>
          </Jumbotron>
        </Container>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <Form onSubmit={this.onSubmitHandler}>
            <Form.Row className="align-items-center">
              <Col xs="auto" className="my-1">
                <Form.Label htmlFor="inlineFormInputGroupUsername" srOnly>
                  Username
            </Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>@</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl value={this.state.username} id="username" placeholder="Github Username" onChange={this.onChangeHandler} />
                </InputGroup>
              </Col>
              <Col xs="auto" className="my-1">
                <Button disabled={this.state.username.trim()=== ''} type="submit">Submit</Button>
              </Col>
            </Form.Row>
          </Form>
        </div>
        <Container style={{ marginTop: "20px" }}>
          <ol>
            {this.state.list.map((user, idx) => {
              return <li key={user.id} >
                <a style={{ color: "inherit", textDecoration: "none" }} target="_blank" href={user.html_url}><Card style={{ marginTop: "5px", marginBottom: "5px", marginLeft: "5px" }} >
                  <Row>
                    <Col sm={3} md={2} xs={4}>
                      <Image src={user.avatar_url} height="100px" style={{ padding: "10px" }} roundedCircle />
                    </Col>
                    <Col sm={5} xs={8} style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                      <Row><Card.Title>{user.name}</Card.Title></Row>
                      <Row><Card.Subtitle>{user.login}</Card.Subtitle></Row>
                    </Col>
                    <Col style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                      <Row>
                        <Col style={{ display: "flex", alignItems: "center", flexDirection: "column", marginLeft: "15px" }}>
                          <Row><Card.Text>Repositories</Card.Text></Row>
                          <Row ><Card.Text>{user.public_repos}</Card.Text></Row>
                        </Col>
                        <Col style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                          <Row><Card.Text>Followers</Card.Text></Row>
                          <Row><Card.Text>{user.followers}</Card.Text></Row>
                        </Col>
                        <Col style={{ display: "flex", alignItems: "center", flexDirection: "column", paddingLeft: "0px" }}>
                          <Row><Card.Text>Gists</Card.Text></Row>
                          <Row><Card.Text>{user.public_gists}</Card.Text></Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card> </a>
              </li>
            })}
          </ol>
        </Container>
      </div>
    );
  }
}


export default App;
