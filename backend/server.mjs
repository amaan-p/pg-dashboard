import express from 'express'
import cors from 'cors'

const app=express()

app.use(cors())
app.use(express.json())
app.post('/api/orders/create',(req,res)=>{
  try{
        // Get the order data from the request body
        const orderData = req.body;
        
        // Validate the required fields
        if (!orderData.order_number || !orderData.dispatcher_name || !orderData.customer_name) {
          return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        
        // Add the new order to the Orders array
        Orders.push(orderData);
        
        // Return success response
        return res.status(201).json({ 
          success: true, 
          message: 'Order created successfully',
          data: orderData
        });
      } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
   
  })



  app.get('/api/orders',(req,res)=>{
    try{
          return res.status(200).json({ 
           Orders
          });
        } catch (error) {
          console.error('Error creating order:', error);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
     
    })


app.listen(5000,()=>{console.log("live at 5000")})


export const Orders = [
  {
    "order_number": "30",
    "dispatcher_name": "abc",
    "customer_name": "xyz",
    "created_at": new Date().toLocaleDateString(),
    "order_status": "Pending",
    "order_details": {
      "items": [
        {
          "typeof_items": "Bottle",
          "quantity": 100,
          "weight": "500g",
          "team": "Glass Manufacturing Team",
          "status": "Done"
        }
      ],
      "caps": [
        {
          "cap_name": "Plastic Cap",
          "quantity": 100,
          "cap_type": "Screw Cap",
          "team": "Cap Manufacturing Team",
          "status": "Done"
        },
        {
          "cap_name": "Metal Cap",
          "quantity": 50,
          "cap_type": "Twist Cap",
          "team": "Cap Manufacturing Team",
          "status": "Pending"
        }
      ],
      "boxes": [
        {
          "box_name": "Carton Box",
          "quantity": 20,
          "box_finish": "Glossy",
          "team": "Packaging Team",
          "status": "Pending"
        }
      ],
      "pumps": [
        {
          "pump_name": "Dispenser Pump",
          "quantity": 100,
          "team": "Pump Manufacturing Team",
          "status": "Pending"
        },
        {
          "pump_name": "Spray Pump",
          "quantity": 50,
          "team": "Pump Manufacturing Team",
          "status": "Pending"
        }
      ],
      "decorations": [
        {
          "decoration_name": "Logo Sticker",
          "quantity": 100,
          "link": "https://example.com/logo1.png",
          "team": "Decoration Team",
          "status": "Pending"
        }
      ]
    }
  },
  {
    "order_number": "31",
    "dispatcher_name": "def",
    "customer_name": "uvw",
    "created_at": new Date().toLocaleDateString(),
    "order_status": "Pending",
    "order_details": {
      "items": [
        {
          "typeof_items": "Jar",
          "quantity": 200,
          "weight": "300g",
          "team": "Glass Manufacturing Team",
          "status": "Done"
        }
      ],
      "caps": [
        {
          "cap_name": "Metal Cap",
          "quantity": 200,
          "cap_type": "Twist Cap",
          "team": "Cap Manufacturing Team",
          "status": "Pending"
        }
      ],
      "boxes": [
        {
          "box_name": "Plastic Box",
          "quantity": 40,
          "box_finish": "Matte",
          "team": "Packaging Team",
          "status": "Pending"
        }
      ],
      "pumps": [
        {
          "pump_name": "Spray Pump",
          "quantity": 200,
          "team": "Pump Manufacturing Team",
          "status": "Pending"
        }
      ],
      "decorations": [
        {
          "decoration_name": "Printed Label",
          "quantity": 200,
          "link": "https://example.com/logo2.png",
          "team": "Decoration Team",
          "status": "Pending"
        }
      ]
    }
  }
]
