// implement your API here
const express = require('express');

// import the DB
const data = require('./data/db');

// initialize server/app
const app = express();

// Tell app/server that it will recieve json
app.use(express.json())

// Port I will be accessing it on
const port = 8000

// Get Friends
app.get('/api/users', (req,res) => {
    data.find()
        .then( data => {
            res.status(200).json(data)
        })
        .catch( err => {
            res.status(500).json({error: "There was an error while saving the user to the database"})
        })
})

// Get specific Friend

app.get('/api/users/:id', (req,res) => {
    const {id} = req.params

    data.findById(id)
        .then( response => {
            !response ? res.status(404).json({message: "The user with the specified ID does not exist."}) :
            res.status(200).json(response);
            console.log("SUCCESS", response)
        })
        .catch(error => {
            console.log("ERROR", error)
            res.status(500).json({ error: "The user information could not be retrieved." })
        })
})

// Create new Friend

app.post('/api/users', (req,res)=> {
    console.log("Data recieved from Body", req.body);
    const {name, bio} = req.body;

    // No name or bio in Body? That returns an error
    !name || !bio ? res.status(400).json({errorMessage: "Please provide name and bio for the user."}) :

    data.insert(req.body)
        .then( result => {
            res.status(201).json(result)
        })
        .catch( err => {
            res.status(500).json({ error: "There was an error while saving the user to the database" })
        })
})

// Delete a friend

app.delete('/api/users/:id', (req,res)=>{
    const id = req.params.id;
    data.remove(id)
        .then( response => {
            response === 0 ? res.status(404).json({message: "The user with the specified ID does not exist."}) :
            res.status(200).json({message:'User deleted Successfully'})
            console.log( "Succes", response);
        })
        .catch( error => {
            res.status(500).json({error: "The user could not be removed"})
            console.log("Error", error)
        })
})

// Update a friend

app.put('/api/users/:id', (req,res) => {
    const id = req.params.id
    const changes = req.body

    !changes.name || !changes.bio ? res.status(400).json({errorMessage: "Please provide name and bio for the user."}) :

    data.update(id, changes)
        .then( updated => {
            console.log("SUCCESS", updated);
            console.log("ID", id);
           if(updated){
            data.findById(id).then(user => {
                res.status(200).json(user)
            } )
            .catch(error => res.status(500).json({error: "The user information could not be modified."}))
            // res.status(202).json(updated)
           } else {
               res.status(404).json({  message: "The user with the specified ID does not exist." });
           }
        })
        .catch( error => {
            res.status(500).json({ error: "The user information could not be modified." })
        })

} )




app.listen(port, ()=> console.log("Server is Running!"))