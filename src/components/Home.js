import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card,Button } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react'

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      allFlowers: [],
    }
  }

  componentDidMount() {
    axios
      .get('http://localhost:3003/getAllFlowers')
      .then(result => {
        this.setState({
          allFlowers: result.data,
        })
      }).catch(err => { console.log(err); })


  }

  addFlower = (FlowerObj) => {
    const {user} = this.props.auth0;

    const params = {
      userEmail:user.email,
      FlowerObj:{
        FlowerName : FlowerObj.name,
        FlowerImg : FlowerObj.photo,
        FlowerDes : FlowerObj.instructions
      }
      }
    
      axios
      .post('http://localhost:3003/addFlowersToFav',params)
      .catch(err => {console.log(err)})
    }
  




  render() {
    return (
      <>
        <h1>API Flowers</h1>
        {this.state.allFlowers.length && this.state.allFlowers.map((flower, idx) => {

          return (
            <>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={flower.photo} />
                <Card.Body>
                  <Card.Title>{flower.name}</Card.Title>
                  <Card.Text>
                    {flower.instructions}
                  </Card.Text>
                  <Button onClick ={ () => {this.addFlower(flower)}}variant="primary">ADD TO FAV</Button>
                </Card.Body>
              </Card>


            </>


          )


        })}
      </>
    )
  }
}

export default withAuth0(Home);
