const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const todoModel = require('./models/todoModel');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
//middleware
app.use(express.json());
app.use(cors());
//routes
app.get('/',(req, res)=>{
res.send('we are in the root folder');
});

app.patch('/todos/:todoId', async(req, res)=>{
    try{
    const updateTodo = await todoModel.findOneAndUpdate({_id:req.params.todoId},{$set:{status:req.body.status}});
    res.json({
        data: updateTodo,
        message: 'Todo successfully updated'
    });
    } catch (err) {
        res.json({message: err});
    }
});
//delete a todo
app.delete('/todos/:todoId', async(req, res)=>{
    try{
   const deleteTodo = await todoModel.findOneAndDelete({_id:req.params.todoId});
   res.json({data:deleteTodo,
   message:'Todo successfully deleted'});  
    }catch(err){
        res.json({message: err});
    }
});
//creating a todo
app.post('/todos', async (req, res)=>{
    const todo = todoModel.create({
        title: req.body.title,
        body: req.body.body,
        status:req.body.status,
        endDate: req.body.endDate
    });
    try{
        const createTodo = await todo.save();
        res.json({
            data: createTodo,
            message: "Todo successfully created",
            status: true
        })
    }catch(err){
        res.json({message:err});    
    }
});
//get all todos
app.get('/todos',async(req, res)=>{
    try {
       const getTodo = await todoModel.find();
       res.json({message:'Todos successfullly retrieved',
         data: getTodo,
    });
    } catch (err) {
        res.json({message: err});
        
    }
});
//get a particular todo by its id

app.get('/todos',async (req,res)=>{
    const {status} = req.params;
    
    const todoModel = await TodoModel.find({}).where('status').equals(status);
    if(todoModel){
        return res.status(200).json({
            status:true,
            message: 'Todos fetched successfully',
            data: todoModel
        })
    }else{
        return res.status(400).json({
            status:false,
            message: 'Todos not found'
        })
    }
    });app.get('/todos/:todoId',async(req, res)=>{
        try {
           const getTodo = await todoModel.findById(req.params.todoId);
           res.json({message:'Todos successfullly retrieved',
             data: getTodo,
        });
        } catch (err) {
            res.json({message: err});
            
        }
    });
    
//database connection

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true},
    ()=>console.log('successfully connected'));

app.listen( 1002|| process.env.PORT_NUMBER);
