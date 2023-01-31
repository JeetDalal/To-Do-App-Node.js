const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');
// const Item = require('./tasks');
const components = require('./tasks')
const Item = components.itemStruct
const Lists = components.listStruct

// const itemSList = require('./custom')

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.listen(3000,()=>{
    console.log('listening on port 3000');
});

var item ="";
var itemList = [];
// var currentRoute = "";
var date = ""; 

//connect to database
    const url = "mongodb://localhost/todo";
    mongoose.set('strictQuery',true);
   mongoose.connect(url,()=>{
    console.log("Connection Successful");
   });
 
  
app.get('/',(req,res)=>{
    const d = new Date();
    var day = d.getDay();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var formattedDate = d.toLocaleDateString("en-US",options);
    date = formattedDate;

    //Logic to add notes
    Item.find({},(err,allItems)=>{
        if(err){
            console.log(err)
        }else{
            console.log(allItems.length)
        if(allItems.length === 0){
               tasks.insertMany(
                    [{name:"X-Box"},{name:"Eating icecream"},{name:"Basketball"},{name:"Badminton"},{name:"Chess"}]
            );

        }
        res.render('notes',{kindOfDay: formattedDate, items: allItems, value: formattedDate});
        }
       });
    

});

//adding item 
app.post('/', (req,res)=>{

    const currentRoute = req.body.kindOfDay
    // console.log(req.body);
    if(currentRoute === date){
        Item.create({
            name:req.body.do
        })
        res.redirect('/')
    }else{ 
        console.log(currentRoute)
        Lists.findOne({listName: currentRoute},(err,list)=>{
            if(err){
                console.log(err)
            }else{
               if(!list){
                    console.log("Empty")
               }else{
                const newItemName = req.body.do;
                const newItem =  new Item({
                        name: newItemName,
                    });
                list.items.push(newItem)
                res.redirect(`/${currentRoute}`);
               }
            }
        })
        
    }
});

//deleting item 
app.post('/delete',(req,res)=>{
    const itemId = req.body.chkbox;
    Item.findByIdAndRemove(itemId,function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Deleted Successfully");
        }
    });
    res.redirect('/');
});


//adding item to itemlist
async function addItem(listName,itemName){
    const newItem =  Item({
        name: itemName,
    });

    await Lists.findOne({listName:listName},(err,foundList)=>{
        if(err){
            console.log(err.message);
        }else{
            foundList.items.push(newItem)
            foundList.save();
        }
    })
}

//custom routes
app.get('/:customRoute',(req,res)=>{
    const listName = req.params.customRoute;
    console.log(listName);
    currentRoute = listName;
    Lists.findOne({listName:listName},(err,results)=>{
        if(!results){
            //create the list
            Lists.create({
                listName:listName,
                items: []
            }).then((result) => {
              console.log("Created Successfully...")  
            });
            res.redirect('/')

        }else{
            console.log('already exists')
            res.render('notes',{kindOfDay: listName, items: results.items,value: listName})
        }
    })
    
});
