import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import { Card,Button } from 'react-bootstrap';
import{Form} from 'react-bootstrap';

class FavFlowers extends React.Component {

  constructor(props){

    super(props);
    this.state = {
      FavFlower :[],
      index : -1,
      flowerName :'',
      flowerObj:{},
      showForm:false
    }
  }


  componentDidMount() {

    const {user} = this.props.auth0;
    axios
      .get('http://localhost:3003/getFavFlowers', {params : {userEmail:user.email}})
      .then(result => {
        this.setState({
          FavFlower: result.data,
        })
      }).catch(err => { console.log(err); })


  }

  deleteFlower = (idx) => {

   const{user} = this.props.auth0;
   axios
   .delete(`http://localhost:3003/deleteFlowers/${idx}`, {params: {userEmail:user.email}})
   .then(result => {
    this.setState({
      FavFlower: result.data,
    })
}).catch(err => {console.log(err);})
}

 updateFlower = (flower,idx) => {
   this.setState({
     index:idx,
     flowerName:flower.name,
     showForm:true,
     flowerObj:flower
     
   })




 }

 updateFormSubmit = (event) => {

  event.preventDefault();
  const{user} = this.props.auth0;
  const params = {
    userEmail:user.email,
    flowerObj:{
      flowerName: event.target.flowerName.value,
      flowerImg: this.state.flowerObj.photo
    }
      
  }

  axios
  .put(`http://localhost:3003/UpdateFlowers/${this.state.index}`,params)
  .then(result => {
    this.setState({
      FavFlower: result.data,
    })
  }).catch(err => {console.log(err);})


 }


  render() {
    return(
      <>


      {this.state.showForm &&
      <Form onSubmit={e => this.updateFormSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Flower Name</Form.Label>
        <Form.Control type="text" name='flowerName' defaultValue={this.state.flowerName} />
        
      </Form.Group>
    
      <Button variant="primary" type="submit">
        Update
      </Button>
    </Form>
      
  }
        <h1>My Favorite Flowers</h1>
        {this.state.FavFlower.length && this.state.FavFlower.map((favFlower,idx) => {
          return (

            <>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={favFlower.photo} />
                <Card.Body>
                  <Card.Title>{favFlower.name}</Card.Title>
                  <Card.Text>
                    {favFlower.instructions}
                  </Card.Text>
                  <Button onClick ={ () => {this.deleteFlower(idx)}} variant="danger">Delete</Button>
                  <Button onClick ={ () => {this.updateFlower(favFlower,idx)}} variant="primary">Update</Button>
                </Card.Body>
              </Card>


            </>


          )
          
        
        
          })}


      </>
    )
  
}

}

export default withAuth0(FavFlowers);
