const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const todoModel = require('./models/todoModel');
const bodyParser = require('body-parser');

const app = express();
//middleware
app.use(bodyParser.json());
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

app.get('/todos/:todoId', async(req, res)=>{
    try{
   const getOneTodo = await todoModel.findById({_id:req.params.todoId});
   res.json({data: getOneTodo,
    message: "Todo successfully retrieved"
});
    } catch (err) {
        res.json({message: err});
    }
});
//database connection
mongoose.connect(process.env.DB_URL,()=>console.log('successfully connected'));
//port to listen to requests
app.listen(process.env.PORT_NUMBER || 2021);
